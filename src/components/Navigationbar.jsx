import React from "react";
import reactsvg from "../assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Notification from "./Notification";
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
  borderColor: "red",
  backgroundColor: "red",
  boxShadow: `0px 4px 6px ${alpha(red[500], 0.9)}`,
  padding: "8px 12px",
}));

const Navigationbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    // <nav className="h-[100px] w-screen bg-red-500 px-2 md:justify-between flex justify-center text-white sticky shadow-md">
    //   <div className="md:flex px-2 hidden">
    //     <img
    //       src={reactsvg}
    //       alt="React Logo"
    //       className="h-fit mx-2 flex justify-center self-center"
    //     />
    //     <label className="flex justify-center self-center">
    //       Batangas State University Disciplinary Management
    //     </label>
    //   </div>
    //   <div className="h-[100px] flex gap-x-5 items-center flex-wrap mx-5">
    //     {/* <Link
    //       className="p-2 hover:bg-blue-700 hover:rounded-md hover:cursor-pointer"
    //       to="/Students"
    //     >
    //       Students
    //     </Link> */}
    //     <Link
    //       className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
    //       to="/Violations"
    //     >
    //       Violation
    //     </Link>
    //     <Link
    //       className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
    //       to="/Users"
    //     >
    //       Users
    //     </Link>
    //     <Link
    //       className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
    //       to="/Chart"
    //     >
    //       Charts
    //     </Link>
    //     <Link
    //       className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
    //       to="/Notification"
    //     >
    //       Notification
    //     </Link>
    //     {isAuthenticated && (
    //       <Link
    //         className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
    //         onClick={logout}
    //       >
    //         Logout
    //       </Link>
    //     )}

    //     {localStorage.getItem("accessToken") === null &&
    //       window.location.replace("/login")}
    //   </div>
    // </nav>
    <AppBar
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container>
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
              {" "}
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
                <Link onClick={toggleDrawer(false)} to="/Users">
                  <MenuItem>Report </MenuItem>
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
      </Container>
    </AppBar>
  );
};

export default Navigationbar;
