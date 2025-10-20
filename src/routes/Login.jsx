import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Alert,
  AlertTitle,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import "../animations.css";
import { motion, AnimatePresence } from "framer-motion";
import DocumentList from "../components/DocumentList";

const Login = () => {
  const vertical = "bottom";
  const horizontal = "right";
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
  };
  const { login } = useAuth();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [account, setAccount] = React.useState({ name: "", password: "" });
  const userType = {
    admin: "ADMIN",
    department_head: "PROGRAM HEAD",
    dean: "DEAN",
    professor: "PROFESSOR",
    coordinator: "OSD_COORDINATOR",
  };
  const [activeForm, setActiveForm] = React.useState("login");

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (account.name === "" || account.password === "") {
      setAlertMessage({
        open: true,
        title: "Error",
        message: "Please fill in all fields",
        variant: "error",
      });
      setIsLoading(false);
      return;
    }
    try {
      const responseData = await login(account.name, account.password);
      setIsLoading(false);
      switch (responseData) {
        case userType.admin:
          navigate("/violations");
          break;
        case userType.dean:
          navigate("/dean/home");
          break;
        case userType.professor:
          navigate("/professor/home");
          break;
        case userType.department_head:
          navigate("/department-head/home");
          break;
        case userType.coordinator:
          navigate("/coordinator/home");
          break;
        default:
          setAlertMessage({
            open: true,
            title: "Error",
            message: "Invalid login credentials",
            variant: "error",
          });
      }
    } catch (error) {
      setAlertMessage({
        open: true,
        title: "Error",
        message: error.message,
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const handleSwitchForm = (nextForm) => {
    setActiveForm(nextForm);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Left side: Image and Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 items-center justify-center bg-gray-900 relative">
        <img
          src="/bsu_image.jpg"
          alt="University Campus"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute text-white text-center p-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography variant="h2" component="h1" className="font-bold mb-4">
              Violation Monitoring System
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography variant="h5" className="font-light">
              Bulacan State University
            </Typography>
          </motion.div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col items-center justify-center bg-white p-6 md:p-12">
        <h1>hello</h1>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeForm}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {activeForm === "request" ? (
              <>
                <DocumentList />
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => handleSwitchForm("login")}
                  className="mt-4"
                >
                  Back to Login
                </Button>
              </>
            ) : (
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-y-5"
              >
                <motion.div
                  variants={inputVariants}
                  className="text-center"
                >
                  <Typography
                    variant="h4"
                    className="font-bold text-gray-800"
                  >
                    Login to Your Account
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mt-2">
                    Welcome back! Please enter your details.
                  </Typography>
                </motion.div>

                <motion.div variants={inputVariants}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    color="error"
                    onChange={(event) =>
                      setAccount({ ...account, name: event.target.value })
                    }
                  />
                </motion.div>

                <motion.div variants={inputVariants}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    color="error"
                    onChange={(event) =>
                      setAccount({ ...account, password: event.target.value })
                    }
                  />
                </motion.div>

                <motion.div variants={buttonVariants}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="error"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      paddingY: "14px",
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </motion.div>

                <div className="flex justify-center w-full">
                  <motion.div variants={buttonVariants}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      onClick={() => handleSwitchForm("request")}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "error.main",
                        },
                      }}
                    >
                      <Tooltip title="Go to Download Page" arrow>
                        <span>Request File Access</span>
                      </Tooltip>
                    </Typography>
                  </motion.div>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Snackbar
        open={alertMessage.open}
        autoHideDuration={6000}
        onClose={() => setAlertMessage({ ...alertMessage, open: false })}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          severity={alertMessage.variant}
          onClose={() => setAlertMessage({ ...alertMessage, open: false })}
          sx={{ width: "100%" }}
        >
          <AlertTitle>{alertMessage.title}</AlertTitle>
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
