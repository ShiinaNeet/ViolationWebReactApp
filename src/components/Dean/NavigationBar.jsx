import React from "react";
import bsuLogo from "@src/assets/bsu_logo_no_bg.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { useTheme, THEME_COLORS } from "../../context/ThemeContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThemeToggle from "../ThemeToggle";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Drawer,
  MenuItem,
  Divider,
  Typography,
  useTheme as useMuiTheme,
} from "@mui/material";
import ThemeColorPicker from "../ThemeColorPicker";
import { NavigationToolbar as StyledToolbar } from "../../utils/StyledToolBar";

const NavigationBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const { isDarkMode, themeColor } = useTheme();
  const muiTheme = useMuiTheme();
  const [open, setOpen] = React.useState(false);
  const MenuButtonItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Home", link: "/dean/home" },
    { name: "Students", link: "/dean/students" },
    { name: "Departments", link: "/dean/departments" },
    { name: "Notification", link: "/dean/Notification" },
  ];

  const selectedColor = THEME_COLORS.find(c => c.name === themeColor) || THEME_COLORS[0];
  const navBgColor = selectedColor.light;
  const drawerBgColor = isDarkMode ? "#16213e" : muiTheme.palette.primary.main;

  const toggleDrawer = (newOpen) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        bgcolor: navBgColor,
        color: "white",
        boxShadow: 3,
      }}
    >
      <StyledToolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src={bsuLogo}
            alt="BSU Logo"
            sx={{
              height: 40,
              width: 40,
              mr: 2,
              objectFit: "contain",
            }}
          />
          <Typography
            variant="h6"
            component="div"
            color="white"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: "bold",
            }}
          >
            Batangas State University Disciplinary Management
          </Typography>
        </Box>

        {/* Desktop Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            alignItems: "center",
          }}
        >
          {MenuButtonItems.map((item, index) => (
            <Button
              variant="text"
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
              key={index}
            >
              <Link
                to={item.link}
                style={{
                  textDecoration: "none",
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                {item.name}
              </Link>
            </Button>
          ))}

          {isAuthenticated && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
              onClick={logout}
            >
              Logout
            </Button>
          )}
          <ThemeColorPicker />
          <ThemeToggle />
          {localStorage.getItem("accessToken") === null &&
            window.location.replace("/login")}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
          <ThemeColorPicker />
          <ThemeToggle />
          <IconButton
            aria-label="Menu button"
            onClick={toggleDrawer(true)}
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
            <Box sx={{ p: 2, backgroundColor: drawerBgColor }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  onClick={toggleDrawer(false)}
                  sx={{ color: "white" }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              {MenuButtonItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <MenuItem
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    {item.name}
                  </MenuItem>
                </Link>
              ))}

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.3)" }} />

              {isAuthenticated && (
                <MenuItem
                  onClick={logout}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Logout
                </MenuItem>
              )}

              {localStorage.getItem("accessToken") === null &&
                window.location.replace("/login")}
            </Box>
          </Drawer>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default NavigationBar;
