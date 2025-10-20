import React from "react";
import reactsvg from "../assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
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

const Navigationbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <AppBar
      position="fixed"
      style={{
        backgroundColor: "red",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        margin: 0,
        padding: 0,
        zIndex: 1300,
      }}
    >
      <StyledToolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            px: 0,
            py: 3,
            gap: 2,
          }}
        >
          <img
            src={reactsvg}
            alt="React Logo"
            className="h-fit mx-2 flex justify-center self-center "
          />
          <h1 className="text-white-500 hidden lg:block">
            Batangas State University Disciplinary Management
          </h1>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {/* <Link
                className="p-5 hover:bg-blue-700 hover:rounded-md hover:cursor-pointer"
                to="/Students"
              >
                Students
              </Link>{" "} */}
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          <Button variant="text" color="white" size="medium">
            <Link
              className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
              to="/students"
            >
              Home
            </Link>
          </Button>
          <Button variant="text" color="white" size="small">
            <Link
              className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
              to="/Violations"
            >
              Violation
            </Link>
          </Button>
          <Button variant="text" color="white" size="small">
            <Link
              className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
              to="/Users"
            >
              Users
            </Link>
          </Button>
          <Button variant="text" color="white" size="small">
            <Link
              className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
              to="/Forms"
            >
              Forms
            </Link>
          </Button>
          <Button variant="text" color="white" size="small">
            <Link
              className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
              to="/Reports"
            >
              Reports
            </Link>
          </Button>
          <Button variant="text" color="white" size="small">
            <Link
              className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
              to="/Chart"
            >
              Charts
            </Link>
          </Button>
          <Button variant="text" color="white" size="small">
            {" "}
            <Link
              className=" hover:bg-red-100 hover:text-red-600 hover:rounded-md hover:cursor-pointer p-2"
              to="/Notification"
            >
              Notification
            </Link>
          </Button>{" "}
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
                hidden: { xs: "none", md: "flex" },
              },
            }}
          >
            <Box sx={{ p: 2, pt: 10, backgroundColor: "background.default" }}>
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

              <Link onClick={toggleDrawer(false)} to="/students">
                <MenuItem>Students </MenuItem>
              </Link>
              <Link onClick={toggleDrawer(false)} to="/Violations">
                <MenuItem>Violation </MenuItem>
              </Link>
              <Link onClick={toggleDrawer(false)} to="/Users">
                <MenuItem>User </MenuItem>
              </Link>
              {/* <Link onClick={toggleDrawer(false)} to="/Chart">
                  <MenuItem>Charts </MenuItem>
                </Link> */}
              <Link onClick={toggleDrawer(false)} to="/Reports">
                <MenuItem>Reports </MenuItem>
              </Link>
              <Link onClick={toggleDrawer(false)} to="/Notification">
                <MenuItem>Notifications </MenuItem>
              </Link>
              <Divider sx={{ my: 3 }} />
              {isAuthenticated && (
                <Link onClick={logout}>
                  {" "}
                  <MenuItem>Logout </MenuItem>
                </Link>
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

export default Navigationbar;
