import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Backdrop,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

const BarChartComponent = memo(() => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [authError, setAuthError] = useState("");
  const activityTimerRef = useRef(null);

  const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds

  // Reset inactivity timer
  const resetTimer = useCallback(() => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }

    if (!showAuthModal) {
      const timer = setTimeout(() => {
        setIsBlurred(true);
        setShowAuthModal(true);
      }, INACTIVITY_TIMEOUT);

      activityTimerRef.current = timer;
    }
  }, [showAuthModal, INACTIVITY_TIMEOUT]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (!showAuthModal) {
      resetTimer();
    }
  }, [showAuthModal, resetTimer]);

  // Handle authentication
  const handleAuth = useCallback(async () => {
    try {
      // You can replace this with your actual authentication endpoint
      const response = await axios.post("/auth/login", {
        username: credentials.login,
        password: credentials.password,
      });

      if (response.status === 200) {
        setIsBlurred(false);
        setShowAuthModal(false);
        setCredentials({ login: "", password: "" });
        setAuthError("");
        resetTimer(); // Restart the timer after successful auth
      }
    } catch (error) {
      setAuthError("Invalid credentials. Please try again.");
    }
  }, [resetTimer, credentials.login, credentials.password]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, []);

  // Set up activity listeners
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add event listeners
    events.forEach((event) => {
      // document.addEventListener(event, handleActivity, true);
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [handleActivity, resetTimer]);

  // Handle credential changes
  const handleLoginChange = useCallback((e) => {
    setCredentials((prev) => ({ ...prev, login: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setCredentials((prev) => ({ ...prev, password: e.target.value }));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/statistic", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response: ", response);
      if (response.status === 200) {
        console.log("Data fetched successfully");
        const departmentData = response.data.map((department) => ({
          departmentViolationCount: department.departmentViolationCount,
          name: department.department_name,
          programs: department.programs.map((program) => ({
            name:
              program.program_name || "No Violations Recorded for this Program",
            value: Number(program.programViolationCount) || 0,
          })),
        }));
        setDepartments(departmentData);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const GetLoadingUI = useMemo(() => {
    return (
      <div className="flex items-center justify-center h-40">
        <p style={{ fontSize: "16px" }}>Loading...</p>
      </div>
    );
  }, []);

  const GetDepartmentBarChart = useMemo(() => {
    return departments.map((department) => (
      <Box
        key={department.name}
        sx={{
          marginTop: "30px",
          marginBottom: "30px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        <h1 className="font-semibold" style={{ fontSize: "16px" }}>
          {department.name} - Program Violations
        </h1>
        <label className="text-gray-500" style={{ fontSize: "16px" }}>
          Total Department Violation : {department.departmentViolationCount}
        </label>
        {department.programs.length > 0 ? (
          <BarChart
            colors={["#FF0000"]}
            height={300}
            xAxis={[
              {
                scaleType: "band",
                data: department.programs.map((program) => program.name),
              },
            ]}
            series={[
              {
                data: department.programs.map((program) => program.value),
                label: "Total Violations",
              },
            ]}
          />
        ) : (
          <div className="flex items-center justify-center h-40">
            <p style={{ fontSize: "16px" }}>No data for this department.</p>
          </div>
        )}
      </Box>
    ));
  }, [departments]);

  const GetNoDataToDisplay = useMemo(() => {
    return (
      <div className="flex items-center justify-center h-40">
        <p style={{ fontSize: "16px" }}>No data to display.</p>
      </div>
    );
  }, []);
  const GetAuthModal = useMemo(() => {
    return (
      <Dialog
        open={showAuthModal}
        onClose={() => {}} // Prevent closing by clicking outside
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "white",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#d32f2f",
            fontSize: "16px",
          }}
        >
          Session Timeout - Re-authentication Required
        </DialogTitle>
        <DialogContent>
          <p
            className="text-center text-gray-600 mb-4"
            style={{ fontSize: "16px" }}
          >
            You&apos;ve been inactive for 1 minute. Please re-enter your credentials
            to continue.
          </p>

          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Login"
            variant="outlined"
            margin="normal"
            value={credentials.login}
            onChange={handleLoginChange}
            color="error"
            InputProps={{
              style: { fontSize: "16px" },
            }}
            InputLabelProps={{
              style: { fontSize: "16px" },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={credentials.password}
            onChange={handlePasswordChange}
            onKeyPress={() => {}}
            color="error"
            InputProps={{
              style: { fontSize: "16px" },
            }}
            InputLabelProps={{
              style: { fontSize: "16px" },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleAuth}
            variant="contained"
            color="error"
            size="large"
            disabled={!credentials.login || !credentials.password}
            sx={{
              minWidth: "120px",
              fontSize: "16px",
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    );
  }, [
    showAuthModal,
    authError,
    credentials.login,
    credentials.password,
    handleLoginChange,
    handlePasswordChange,
    handleAuth,
  ]);

  useEffect(() => {
    console.log("Barchart mounted: Fetching data...");
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: isBlurred ? "blur(10px)" : "none",
          backgroundColor: isBlurred ? "rgba(0, 0, 0, 0.3)" : "transparent",
          pointerEvents: isBlurred ? "all" : "none",
        }}
        open={isBlurred}
      />

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 15, sm: 15 },
          pb: { xs: 8, sm: 12 },
          minHeight: "100vh",
          filter: isBlurred ? "blur(5px)" : "none",
          transition: "filter 0.3s ease-in-out",
        }}
      >
        <div className="mx-auto h-full w-full px-4">
          {loading
            ? GetLoadingUI
            : departments.length > 0 && !loading
            ? GetDepartmentBarChart
            : GetNoDataToDisplay}
        </div>
      </Container>

      {GetAuthModal}
    </>
  );
});

export default BarChartComponent;
