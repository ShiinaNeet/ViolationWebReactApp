import reactsvg from "@src/assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import React from "react";
import {
  alpha,
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  styled,
  Toolbar,
  Drawer,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { StyledToolbarWithRed } from "@src/utils/StyledToolBar.js";

const NavigationBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const MenuButtons = [
    { name: "Home", link: "/coordinator/home" },
    { name: "Students", link: "/coordinator/students" },
    { name: "Forms", link: "/coordinator/forms" },
    { name: "Notifications", link: "/coordinator/Notification" },
  ];
  const GetNavigationButtons = () => {
    return MenuButtons.map((button) => {
      return (
        <Button variant="text" color="white" size="small" key={button.name}>
          <Link
            className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
            to={button.link}
          >
            {button.name}
          </Link>
        </Button>
      );
    });
  };
  const GetMenuButtons = () => {
    return MenuButtons.map((button) => {
      return (
        <Link to={button.link} key={button.name}>
          <MenuItem>{button.name} </MenuItem>
        </Link>
      );
    });
  };
  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbarWithRed variant="dense" disableGutters>
          <Box className="flex items-center px-0 flex-grow">
            <img
              src={reactsvg}
              alt="React Logo"
              className="h-fit mx-2 flex justify-center self-center"
            />
            <h1 className="text-white-500 hidden sm:block">
              Batangas State University Disciplinary Management
            </h1>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <GetNavigationButtons />
            {isAuthenticated && (
              <Button variant="text" color="white" size="small">
                <Link
                  className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
                  onClick={logout}
                >
                  Logout
                </Link>
              </Button>
            )}
            {localStorage.getItem("accessToken") === null &&
              window.location.replace("/login")}
          </Box>
          <Box
            sx={{
              display: { xs: "flex", md: "none" }, // Change grid to flex
              justifyContent: "flex-end", // Align items to the end horizontally
              alignItems: "center", // Align vertically
            }}
          >
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Drawer
            anchor="top"
            open={open}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                top: "var(--template-frame-height, 0px)",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: "background.default",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
              <GetMenuButtons />
              <Divider sx={{ my: 3 }} />
              {isAuthenticated && (
                <Link onClick={logout}>
                  <MenuItem>Logout </MenuItem>
                </Link>
              )}
              {localStorage.getItem("accessToken") === null &&
                window.location.replace("/login")}
            </Box>
          </Drawer>
        </StyledToolbarWithRed>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
