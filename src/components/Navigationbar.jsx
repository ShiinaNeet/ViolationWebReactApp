import React from "react";
import bsuLogo from "../assets/bsu_logo_no_bg.png";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useTheme, THEME_COLORS } from "../context/ThemeContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThemeToggle from "./ThemeToggle";
import ThemeColorPicker from "./ThemeColorPicker";
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
  useTheme as useMuiTheme,
} from "@mui/material";

const StyledToolbar = styled(Toolbar)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  width: "100%",
  backdropFilter: "blur(24px)",
  padding: "8px 12px",
}));

const Navigationbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const { isDarkMode, themeColor } = useTheme();
  const muiTheme = useMuiTheme();
  const [open, setOpen] = React.useState(false);

  // Always use the 'light' version of the color for the navbar background
  const selectedColor = THEME_COLORS.find(c => c.name === themeColor) || THEME_COLORS[0];
  const navBgColor = selectedColor.light;
  const drawerBgColor = isDarkMode ? "#16213e" : muiTheme.palette.primary.main;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <AppBar
      position="fixed"
      style={{
        backgroundColor: navBgColor,
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
            src={bsuLogo}
            alt="BSU Logo"
            className="h-10 w-10 mx-2 flex justify-center self-center object-contain"
          />
          <h1 className="text-white hidden lg:block">
            Batangas State University Disciplinary Management
          </h1>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {/* <Link
                className="p-5 hover:bg-gray-700 hover:rounded-md hover:cursor-pointer"
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
          <Button variant="text" sx={{ color: "white" }} size="medium">
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/dashboard"
            >
              Dashboard
            </Link>
          </Button>
          <Button variant="text" sx={{ color: "white" }} size="medium">
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/students"
            >
              Home
            </Link>
          </Button>
          <Button variant="text" sx={{ color: "white" }} size="small">
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/Violations"
            >
              Violation
            </Link>
          </Button>
          <Button variant="text" sx={{ color: "white" }} size="small">
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/Users"
            >
              Users
            </Link>
          </Button>
          <Button variant="text" sx={{ color: "white" }} size="small">
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/Forms"
            >
              Forms
            </Link>
          </Button>
          <Button variant="text" sx={{ color: "white" }} size="small">
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/Reports"
            >
              Reports
            </Link>
          </Button>
          <Button variant="text" sx={{ color: "white" }} size="small">
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/Chart"
            >
              Charts
            </Link>
          </Button>
          <Button variant="text" sx={{ color: "white" }} size="small">
            {" "}
            <Link
              className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
              to="/Notification"
            >
              Notification
            </Link>
          </Button>{" "}
          {isAuthenticated && (
            <Button variant="text" sx={{ color: "white" }} size="small">
              {" "}
              <Link
                className="text-white hover:bg-white hover:text-black hover:rounded-md hover:cursor-pointer p-2"
                onClick={logout}
              >
                Logout
              </Link>
            </Button>
          )}
          <ThemeColorPicker />
          <ThemeToggle />
          {localStorage.getItem("accessToken") === null &&
            window.location.replace("/login")}
        </Box>
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
            <Box sx={{ p: 2, pt: 10, backgroundColor: drawerBgColor }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  onClick={toggleDrawer(false)}
                  sx={{ color: "white" }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              <Link onClick={toggleDrawer(false)} to="/dashboard">
                <MenuItem
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Dashboard
                </MenuItem>
              </Link>
              <Link onClick={toggleDrawer(false)} to="/students">
                <MenuItem
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Students{" "}
                </MenuItem>
              </Link>
              <Link onClick={toggleDrawer(false)} to="/Violations">
                <MenuItem
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Violation{" "}
                </MenuItem>
              </Link>
              <Link onClick={toggleDrawer(false)} to="/Users">
                <MenuItem
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  User{" "}
                </MenuItem>
              </Link>
              {/* <Link onClick={toggleDrawer(false)} to="/Chart">
                  <MenuItem>Charts </MenuItem>
                </Link> */}
              <Link onClick={toggleDrawer(false)} to="/Reports">
                <MenuItem
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Reports{" "}
                </MenuItem>
              </Link>
              <Link onClick={toggleDrawer(false)} to="/Notification">
                <MenuItem
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Notifications{" "}
                </MenuItem>
              </Link>
              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.3)" }} />
              {isAuthenticated && (
                <Link onClick={logout}>
                  {" "}
                  <MenuItem
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    Logout{" "}
                  </MenuItem>
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
