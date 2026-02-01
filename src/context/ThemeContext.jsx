/* eslint-disable react/prop-types */
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

export const THEME_COLORS = [
  { name: "Default", light: "#000000", dark: "#ffffff" },
  { name: "Blue", light: "#2196f3", dark: "#90caf9" },
  { name: "Green", light: "#4caf50", dark: "#81c784" },
  { name: "Red", light: "#f44336", dark: "#e57373" },
  { name: "Orange", light: "#ff9800", dark: "#ffb74d" },
  { name: "Purple", light: "#9c27b0", dark: "#ce93d8" },
  { name: "Teal", light: "#009688", dark: "#4db6ac" },
];

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
const getStoredColorPreference = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("themeColor") || "Default";
  }
  return "Default";
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = getStoredPreference();
    return stored !== null ? stored : getSystemPreference();
  });

  const [themeColor, setThemeColor] = useState(getStoredColorPreference());

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("themeColor", themeColor);

    const selectedColor = THEME_COLORS.find(c => c.name === themeColor) || THEME_COLORS[0];
    const primaryColor = isDarkMode ? selectedColor.dark : selectedColor.light;
    
    document.documentElement.style.setProperty("--primary-color", primaryColor);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode, themeColor]);

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

  const muiTheme = useMemo(() => {
    const selectedColor =
      THEME_COLORS.find((c) => c.name === themeColor) || THEME_COLORS[0];
    const primaryColor = isDarkMode ? selectedColor.dark : selectedColor.light;

    return createTheme({
      palette: {
        mode: isDarkMode ? "dark" : "light",
        primary: {
          main: primaryColor,
        },
        secondary: {
          main: primaryColor,
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
    });
  }, [isDarkMode, themeColor]);

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? "dark" : "light",
    themeColor,
    setThemeColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
