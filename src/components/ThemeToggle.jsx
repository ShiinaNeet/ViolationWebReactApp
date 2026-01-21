import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: "white",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "rotate(180deg)",
          },
        }}
      >
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
