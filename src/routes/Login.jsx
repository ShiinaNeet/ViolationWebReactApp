import React, { useCallback, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

const Login = () => {
    const { login } = useAuth();
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

    const animationPlayed = useRef(false); // Track if the animation has been played
    const formRef = useRef(null); // Ref for the form element

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setAlertMessage({ open: false });
    };

    const handleLogin = useCallback(
        async (event) => {
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
                const success = await login(account.name, account.password);
                setIsLoading(false);
                if (success) {
                    navigate("/Students");
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
        },
        [account, login, navigate]
    );

    useEffect(() => {
        if (!animationPlayed.current) {
            formRef.current.classList.add("animate-slide-in");
            animationPlayed.current = true;
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-500">
            <form
                ref={formRef}
                onSubmit={handleLogin}
                className="flex flex-col bg-slate-100 w-full md:w-2/3 p-3 rounded-md gap-y-5 border-2 border-red-500 border-solid shadow-sm shadow-red-400"
            >
                <h1 className=" text-3xl text-center font-mono font-extrabold">
                    STUDENT VIOLATION TRACKING APP
                </h1>
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    onChange={(e) =>
                        setAccount({ ...account, name: e.target.value })
                    }
                    value={account.name}
                />
                <TextField
                    id="outlined-password-input"
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={account.password}
                    onChange={(e) =>
                        setAccount({ ...account, password: e.target.value })
                    }
                />
                <Button type="submit" className="" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
            <Snackbar
                open={alertMessage.open}
                autoHideDuration={3000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
            >
                <Alert
                    onClose={handleAlertClose}
                    icon={false}
                    severity="info"
                    sx={{ width: "100%" }}
                >
                    <AlertTitle>{alertMessage.title}</AlertTitle>
                    {errorMessages.length > 0
                        ? errorMessages.join(", ")
                        : alertMessage.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;
