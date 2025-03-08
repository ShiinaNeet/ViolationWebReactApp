import React from "react";
import reactsvg from "@src/assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  alpha,
  styled,
  Toolbar,
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Drawer,
  MenuItem,
  Divider,
} from "@mui/material";
import { red } from "@mui/material/colors";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid ",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: "red",
  boxShadow: `0px 4px 6px ${alpha(red[500], 0.9)}`,
  padding: "8px 12px",
}));

const Department_Head_NavigationBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(newOpen);
  };

  const MenuButtonItems = [
    { name: "Program Head", link: "/department-head/home" },
    { name: "Graph", link: "/department-head/graph" },
    { name: "Notification", link: "/department-head/Notification" },
  ];
  const GetMenuButtons = () => {
    return (
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
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
        {MenuButtonItems.map((item, index) => (
          <Link key={index} to={item.link}>
            <MenuItem>{item.name}</MenuItem>
          </Link>
        ))}
        <Divider sx={{ my: 3 }} />
        {isAuthenticated && (
          <Link onClick={logout}>
            <MenuItem>Logout </MenuItem>
          </Link>
        )}
        {localStorage.getItem("accessToken") === null &&
          window.location.replace("/login")}
      </Box>
    );
  };
  const GetNavigationButtons = () => {
    return MenuButtonItems.map((item, index) => (
      <Button variant="text" color="white" size="small" key={index}>
        <Link
          className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
          to={item.link}
        >
          {item.name}
        </Link>
      </Button>
    ));
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
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <img
              src={reactsvg}
              alt="React Logo"
              className="h-fit mx-2 flex justify-center self-center "
            />
            <h1 className="text-white-500">
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
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: { top: "var(--template-frame-height, 0px)" },
              }}
            >
              <GetMenuButtons />
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Department_Head_NavigationBar;
