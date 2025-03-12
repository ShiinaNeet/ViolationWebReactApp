import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import {
  Alert,
  AlertTitle,
  Container,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  TableFooter,
  TableHead,
} from "@mui/material";
import axios from "axios";
import "../animations.css";
import { AnimatePresence, motion } from "framer-motion";
import { StyledToolbar } from "../utils/StyledToolBar";
import TablePaginationActions from "../utils/TablePaginationActions";

function Users() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [departmentData, setDepartmentData] = React.useState([]);
  const [user, setUser] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    type: "",
    password: "",
    username: "",
    assigned_department: "",
    assigned_departments: [],
  });
  const [openCreate, setOpenCreate] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  const [errorMessages, setErrorMessages] = React.useState([]);
  const vertical = "bottom";
  const horizontal = "right";
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    }),
  };
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage({ open: false });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 5);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  const handleClose = () => {
    setOpenCreate(false);

    setUser({
      first_name: "",
      last_name: "",
      email: "",
      type: "",
      password: "",
      assigned_department: "",
      assigned_departments: [],
    });
  };
  const handleSave = async () => {
    setIsLoading(false);
    if (
      user.first_name === "" ||
      user.last_name === "" ||
      user.email === "" ||
      user.type === "" ||
      user.password === "" ||
      user.username === ""
    ) {
      setAlertMessage({
        open: true,
        title: "Error",
        message: "Please fill in all fields!",
        variant: "error",
      });
      // setErrorMessages(["Please fill in all fields"]);
      setIsLoading(false);
      return;
    }
    console.log("User to save:", user);
    let departmentToAssign = [];
    if (user.type === "PROGRAM HEAD") {
      const department = departmentData.find(
        (department) => department.name === user.assigned_department
      );
      if (department) {
        departmentToAssign = [department];
      }
    } else if (user.type === "OSD_COORDINATOR") {
      const department = departmentData.find(
        (department) => department.name === user.assigned_department
      );
      if (department) {
        departmentToAssign = [department];
      }
    } else if (user.type === "DEAN") {
      departmentToAssign = departmentData.filter((department) =>
        user.assigned_departments.includes(department.name)
      );
    } else if (user.type === "PROFESSOR") {
      const department = departmentData.find(
        (department) => department.name === user.assigned_department
      );
      if (department) {
        departmentToAssign = [department];
      }
    }
    const transformedDepartmentToAssign = departmentToAssign.map(
      (department) => department._id
    );

    axios
      .post(
        "/admin",
        {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          assigned_department: transformedDepartmentToAssign,
          email: user.email,
          type: user.type,
          password: user.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setErrorMessages([]);
        if (response.data.status === "success") {
          console.log("Saved");
          setAlertMessage({
            open: true,
            title: "Success",
            message: "User has been created successfully",
            variant: "success",
          });
          // fetchData(page * rowsPerPage, rowsPerPage);
          setIsLoading(false);
          handleClose();
        } else {
          console.log("Failed to save");
          setAlertMessage({
            open: true,
            title: "Failed",
            message: response.data.message,
            variant: "info",
          });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setErrorMessages([]);
        setIsLoading(false);
        setAlertMessage({
          open: true,
          title: e.title,
          message: e.message,
          variant: "error",
        });
      });
  };
  const addMultipleDepartment = (event) => {
    const {
      target: { value },
    } = event;
    setUser({
      ...user,
      assigned_departments:
        typeof value === "string" ? value.split(",") : value,
    });
  };
  const GetHeader = () => {
    return (
      <div className="flex flex-col md:flex-row justify-between gap-x-2 text-sm md:text-md bg-white my-2 rounded-md">
        <h1 className="text-2xl text-red-600 flex items-center py-3">
          Users List
        </h1>
        <Tooltip title="Create User">
          <Button
            onClick={() => setOpenCreate(true)}
            className="p-2"
            color="error"
          >
            Create User
          </Button>
        </Tooltip>
      </div>
    );
  };
  const GetTableHeader = () => {
    return (
      <TableHead>
        <TableRow className="text-sm font-bold">
          <TableCell className="py-5 px-4 font-bold ">Name</TableCell>
          <TableCell className="py-5 px-4 font-bold ">Username</TableCell>
          <TableCell className="py-5 px-4 font-bold">Email address</TableCell>
          <TableCell className="py-5 px-4 font-bold" align="center">
            Category
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };
  const GetTableLoadingBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center">
            Loading...
          </TableCell>
        </TableRow>
      );
    }
    if (isLoading == false && rows.length == 0) {
      return (
        <TableRow className="flex justify-center items-center">
          <TableCell>Loading...</TableCell>
        </TableRow>
      );
    }
    return null;
  };
  const emptyRows = React.useMemo(
    () =>
      Array.from({ length: 5 }, () => ({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        type: "",
        isPlaceholder: true,
      })),
    []
  );
  const displayedRows = React.useMemo(() => {
    return [...rows, ...emptyRows].slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [rows, emptyRows, page, rowsPerPage]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true);
        console.log("Fetching data...");
        const [dataResponse, departmentResponse] = await Promise.all([
          axios.get("admin", {
            params: { skip: 0, limit: 100 },
            headers: { "Content-Type": "application/json" },
          }),
          axios.get("/department", {
            params: { skip: 0, limit: 100 },
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        if (dataResponse.data.status === "success") {
          setRows(dataResponse.data.data);
        } else {
          setAlertMessage({
            open: true,
            title: "No Data",
            message: "No data available",
            variant: "info",
          });
        }

        if (departmentResponse.data.status === "success") {
          setDepartmentData(departmentResponse.data.data);
        } else {
          setAlertMessage({
            open: true,
            title: "No Data",
            message: "No department data available",
            variant: "info",
          });
        }
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        setAlertMessage({
          open: true,
          title: error.title,
          message: error.message || "An error occurred",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 15, sm: 15 },
          pb: { xs: 8, sm: 12 },
          height: "100vh",
        }}
      >
        <div className="w-full h-full mx-auto">
          <GetHeader />
          <StyledToolbar variant="dense" disableGutters>
            <Paper sx={{ width: "100%" }}>
              <TableContainer>
                <Table>
                  <GetTableHeader />
                  <TableBody>
                    {isLoading ? (
                      <GetTableLoadingBody />
                    ) : (
                      <AnimatePresence>
                        {displayedRows.map((row, index) => (
                          <TableRow
                            key={index}
                            component={motion.tr}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                            layout
                          >
                            <TableCell component="th" scope="row">
                              {row.first_name && row.last_name
                                ? `${row.first_name} ${row.last_name}`
                                : row.isPlaceholder
                                ? "-"
                                : "No name attached"}
                            </TableCell>
                            <TableCell>
                              {row.username ||
                                (row.isPlaceholder ? "-" : "No username")}
                            </TableCell>
                            <TableCell>
                              {row.email ||
                                (row.isPlaceholder
                                  ? "-"
                                  : "No email address attached")}
                            </TableCell>
                            <TableCell align="center">
                              {row.isPlaceholder ? (
                                "-"
                              ) : (
                                <Button
                                  className={`p-2 rounded-sm text-center ${
                                    row.type === "ADMIN"
                                      ? "primary"
                                      : "secondary"
                                  }`}
                                  color={
                                    row.type === "ADMIN"
                                      ? "primary"
                                      : "secondary"
                                  }
                                >
                                  {row.type || "No type attached"}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[{ label: "All", value: -1 }]}
                        count={Math.max(rows.length, 5)}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Paper>
          </StyledToolbar>
        </div>
      </Container>
      <motion.div
        key="create-user-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Dialog
          key={openCreate ? "open" : "closed"}
          open={openCreate}
          onClose={handleClose}
        >
          <DialogTitle className="slide-in-down-visible">
            Create User
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              color="error"
              margin="dense"
              label="First Name"
              type="text"
              fullWidth
              value={user.first_name}
              required={true}
              onChange={(e) =>
                setUser({
                  ...user,
                  first_name: e.target.value,
                })
              }
            />
            <TextField
              autoFocus
              color="error"
              margin="dense"
              label="last Name"
              type="text"
              fullWidth
              value={user.last_name}
              required={true}
              onChange={(e) =>
                setUser({
                  ...user,
                  last_name: e.target.value,
                })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              color="error"
              label="Username"
              autoComplete="username"
              type="text"
              fullWidth
              value={user.username}
              required={true}
              onChange={(e) =>
                setUser({
                  ...user,
                  username: e.target.value,
                })
              }
            />
            <TextField
              autoFocus
              color="error"
              margin="dense"
              label="Email Address"
              type="text"
              fullWidth
              value={user.email}
              required={true}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
            />
            <TextField
              className="mb-1"
              color="error"
              id="outlined-password-input"
              label="Password"
              type="password"
              margin="dense"
              fullWidth
              required={true}
              autoComplete="current-password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <InputLabel id="demo-simple-select-label" color="error">
              Type
            </InputLabel>
            <Select
              color="error"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.type}
              onChange={(e) => {
                setUser({ ...user, type: e.target.value }),
                  console.log(e.target.value);
              }}
              fullWidth
            >
              <MenuItem value={"ADMIN"}>Admin</MenuItem>
              <MenuItem value={"SECURITY"}>Security Guard</MenuItem>
              <MenuItem value={"PROGRAM HEAD"}>Program Head</MenuItem>
              <MenuItem value={"DEAN"}>Dean</MenuItem>
              <MenuItem value={"PROFESSOR"}>Professor</MenuItem>
              <MenuItem value={"OSD_COORDINATOR"}>OSD Coordinator</MenuItem>
            </Select>
            {user.type === "PROGRAM HEAD" ||
              (user.type === "OSD_COORDINATOR" && (
                <>
                  <InputLabel id="demo-simple-select-label" color="error">
                    Assign a Department
                  </InputLabel>
                  <Select
                    color="error"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={user.assigned_department}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        assigned_department: e.target.value,
                      }),
                        console.log(e.target.value);
                    }}
                    fullWidth
                  >
                    {departmentData.map((department, idx) => (
                      <MenuItem value={department.name} key={idx}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              ))}
            {user.type === "PROFESSOR" && (
              <>
                <InputLabel id="demo-simple-select-label" color="error">
                  Assign a Department
                </InputLabel>
                <Select
                  color="error"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={user.assigned_department}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      assigned_department: e.target.value,
                    }),
                      console.log(e.target.value);
                  }}
                  fullWidth
                >
                  {departmentData.map((department, idx) => (
                    <MenuItem value={department.name} key={idx}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
            {user.type === "DEAN" && (
              <>
                <InputLabel id="demo-simple-select-label" color="error">
                  Assign to Department/s
                </InputLabel>
                <Select
                  color="error"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={user.assigned_departments}
                  multiple
                  onChange={(e) => {
                    addMultipleDepartment(e);
                  }}
                  fullWidth
                >
                  {departmentData.map((department) => (
                    <MenuItem key={department.name} value={department.name}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ overflow: "hidden" }}>
            <Button
              onClick={handleSave}
              color="error"
              disabled={isLoading}
              className="slide-in-from-bottom"
            >
              {isLoading ? "Saving...." : "Create"}
            </Button>
            <Button
              onClick={handleClose}
              color="error"
              className="slide-in-from-bottom"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
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
    </>
  );
}
export default Users;
