import React, { useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Link,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import "../animations.css";
import { Download } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { login, setUserType } = useAuth();
  const navigate = useNavigate();

  const vertical = "bottom";
  const horizontal = "right";

  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [account, setAccount] = React.useState({ name: "", password: "" });
  const userType = {
    admin: "ADMIN",
    department_head: "PROGRAM HEAD",
    dean: "DEAN",
    professor: "PROFESSOR",
  };

  const [activeForm, setActiveForm] = React.useState("login");
  const [isAnimating, setIsAnimating] = React.useState(false);
  const formRef = useRef(null); // Ref for the form element

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
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
      //If there is time, use switch case instead of if else
      if (responseData == userType.admin) {
        navigate("/violations");
      } else if (responseData == userType.dean) {
        navigate("/dean/home");
      } else if (responseData == userType.professor) {
        navigate("/professor/home");
      } else if (responseData == userType.department_head) {
        navigate("/department-head/home");
      } else {
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
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }, // Each child appears every 100ms
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
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
  const documents = [
    "Student-Incident-Report",
    "Formal-Complaint-Letter",
    "Call-Slip",
    "Notice-Of-Case-Dismissal",
    "Written-Warning-For-Violation-Of-Norms-Conduct",
    "Letter-Of-Suspension",
    "Request-For-Non-Wearing-Of-Uniform",
  ];
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeForm}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="sm:w-[450px] md:w-[550px] w-full- p-6 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-huge"
        >
          {activeForm === "login" ? (
            <div className="flex flex-col gap-y-2">
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <Typography
                  variant="h4"
                  className="text-center font-bold text-gray-800"
                  margin={3}
                >
                  🔐 Welcome back! Let&apos;s keep our campus safe and
                  compliant.
                </Typography>
              </motion.div>
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  color="error"
                  margin="none"
                />
              </motion.div>
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  color="error"
                  className="mb-6"
                  margin="normal"
                />
              </motion.div>
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleLogin}
                  sx={{ marginBottom: 1, height: "100%" }}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
              <div className="flex justify-end w-full">
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <Typography
                    variant="outlined"
                    color="error"
                    onClick={() => handleSwitchForm("request")}
                    sx={{
                      marginBottom: 1,
                      textUnderlinePosition: "under",
                      textDecoration: "underline",
                      textAlign: "right",
                      cursor: "pointer",
                      "&:hover": {
                        color: "error.dark",
                        textDecorationThickness: "3px",
                      },
                    }}
                  >
                    <Tooltip title="Go to Download Page" arrow>
                      <label htmlFor=""> Request File Access</label>
                    </Tooltip>
                  </Typography>
                </motion.div>
              </div>
            </div>
          ) : (
            <>
              <Typography
                variant="h4"
                className="text-center font-bold text-gray-800 mb-10"
              >
                📄 Request File
              </Typography>
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 mb-5"
              >
                {documents.map((filename, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="shadow-md transition-transform transform hover:scale-105">
                      <CardContent className="flex items-center justify-between">
                        <Typography
                          variant="body1"
                          className="text-gray-700 font-semibold"
                        >
                          {filename.replace(/-/g, " ")}
                        </Typography>
                        <Tooltip title="Download File" arrow>
                          <a
                            href={`/documents/${filename}.docx`}
                            download
                            target="_blank"
                          >
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<Download />}
                            >
                              Download
                            </Button>
                          </a>
                        </Tooltip>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => handleSwitchForm("login")}
                  className="mt-4 my-2"
                >
                  Back to Login
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <Snackbar
        open={alertMessage.open}
        autoHideDuration={6000}
        onClose={() => setAlertMessage({ ...alertMessage, open: false })}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          severity={alertMessage.variant}
          onClose={() => setAlertMessage({ ...alertMessage, open: false })}
        >
          <AlertTitle>{alertMessage.title}</AlertTitle>
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
