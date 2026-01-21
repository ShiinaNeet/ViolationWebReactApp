import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const getSystemPreference = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

const getStoredPreference = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme");
    if (stored) {
      return stored === "dark";
    }
  }
  return null;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = getStoredPreference();
    return stored !== null ? stored : getSystemPreference();
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const stored = getStoredPreference();
      if (stored === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: isDarkMode ? "#ffffff" : "#000000",
          },
          secondary: {
            main: isDarkMode ? "#ffffff" : "#000000",
          },
          background: {
            default: isDarkMode ? "#1a1a2e" : "#ffffff",
            paper: isDarkMode ? "#16213e" : "#ffffff",
          },
          text: {
            primary: isDarkMode ? "#ffffff" : "#000000",
            secondary: isDarkMode ? "#b0b0b0" : "#666666",
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.12)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
