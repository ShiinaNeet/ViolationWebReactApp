import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckIcon from "@mui/icons-material/Check";
import { useTheme, THEME_COLORS } from "../context/ThemeContext";

const ThemeColorPicker = () => {
  const { themeColor, setThemeColor, isDarkMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (colorName) => {
    setThemeColor(colorName);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Change Theme Color">
        <IconButton
          onClick={handleClick}
          sx={{ color: "white" }}
          aria-controls={open ? "theme-color-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-color-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1,
            backgroundColor: isDarkMode ? "#16213e" : "#ffffff",
            border: "1px solid",
            borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, color: isDarkMode ? "white" : "black" }}>
            Theme Color
          </Typography>
        </Box>
        {THEME_COLORS.map((color) => (
          <MenuItem
            key={color.name}
            onClick={() => handleSelect(color.name)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 150,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: isDarkMode ? color.dark : color.light,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
            <Typography sx={{ flexGrow: 1, color: isDarkMode ? "white" : "black" }}>{color.name}</Typography>
            {themeColor === color.name && (
              <CheckIcon sx={{ fontSize: 18, color: isDarkMode ? color.dark : color.light }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ThemeColorPicker;
