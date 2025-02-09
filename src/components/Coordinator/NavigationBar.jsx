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
import { red } from "@mui/material/colors";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: "red",
  boxShadow: `0px 4px 6px ${alpha(red[500], 0.9)}`,
  padding: "8px 12px",
}));

const NavigationBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
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
            <Button variant="text" color="white" size="small">
              <Link
                className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
                to="/coordinator/students"
              >
                Students
              </Link>
            </Button>
            <Button variant="text" color="white" size="small">
              <Link
                className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
                to="/coordinator/Notification"
              >
                Notifications
              </Link>
            </Button>
            {isAuthenticated && (
              <Button variant="text" color="white" size="small">
                {" "}
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
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
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
                <Link to="/dean/students">
                  <MenuItem>Students </MenuItem>
                </Link>
                <Link to="/dean/Notification">
                  <MenuItem>Notifications </MenuItem>
                </Link>
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
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
