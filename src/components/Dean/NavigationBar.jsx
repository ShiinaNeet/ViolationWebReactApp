import React from "react";
import reactsvg from "@src/assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  styled,
  Toolbar,
  Drawer,
  MenuItem,
  Divider,
  Typography,
} from "@mui/material";

const StyledToolbar = styled(Toolbar)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  width: "100%",
  backdropFilter: "blur(24px)",
  backgroundColor: "red",
  padding: "8px 12px",
}));

const NavigationBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);
  const MenuButtonItems = [
    { name: "Home", link: "/dean/home" },
    { name: "Students", link: "/dean/students" },
    { name: "Departments", link: "/dean/departments" },
    { name: "Notification", link: "/dean/Notification" },
  ];

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
        bgcolor: "red",
        color: "black",
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
            src={reactsvg}
            alt="React Logo"
            sx={{
              height: 40,
              mr: 2,
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
                color: "red",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
              onClick={logout}
            >
              Logout
            </Button>
          )}
          {localStorage.getItem("accessToken") === null &&
            window.location.replace("/login")}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            aria-label="Menu button"
            onClick={toggleDrawer(true)}
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
            <Box sx={{ p: 2, backgroundColor: "white" }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              {MenuButtonItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem>{item.name}</MenuItem>
                </Link>
              ))}

              <Divider sx={{ my: 2 }} />

              {isAuthenticated && (
                <MenuItem onClick={logout} sx={{ color: "red" }}>
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
