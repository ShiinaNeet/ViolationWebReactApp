import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
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
  alpha,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  styled,
  TableHead,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import formatDate from "../utils/moment";
import { red } from "@mui/material/colors";

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function UserManagement() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openDelete, setopenDelete] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState({
    _id: "",
    first_name: "",
    last_name: "",
    email: "",
    type: "",
    assigned_department: null,
    username: "",
  });
  const [departmentData, setDepartmentData] = React.useState([]);
  const [search, setSearch] = React.useState("");
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
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  const [errorMessages, setErrorMessages] = React.useState([]);
  const vertical = "bottom";
  const horizontal = "right";
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const [isLoading, setIsLoading] = React.useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData(newPage * rowsPerPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 6);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchData(0, newRowsPerPage);
  };

  const handleOpen = (row) => {
    setCurrentRow(row);
    setOpen(true);
  };
  const handleCreateOpen = () => {
    setOpenCreate(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenCreate(false);
    setopenDelete(false);
    setCurrentRow({
      _id: "",
      first_name: "",
      last_name: "",
      email: "",
      type: "",
      assigned_department: "",
    });
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
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertMessage({ open: false });
  };

  const handleSave = async () => {
    setIsLoading(true);
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
    axios
      .post(
        "/user/create/admin",
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          type: user.type,
          password: user.password,
          username: user.username,
          assigned_department:
            user.type == "PROGRAM HEAD"
              ? user.assigned_department
              : user.assigned_departments,
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
          fetchData(page * rowsPerPage, rowsPerPage);
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
  // const handleUpdate = async () => {
  //   setIsLoading(true);
  //   if (
  //     currentRow.first_name === "" ||
  //     currentRow.last_name === "" ||
  //     currentRow.email === "" ||
  //     currentRow.type === ""
  //   ) {
  //     setAlertMessage({ open: true, title: "Error", variant: "error" });
  //     setErrorMessages(["Please fill in all fields"]);
  //     setIsLoading(false);
  //     return;
  //   }

  //   axios
  //     .put(
  //       `/admin/user/update?user_id=${currentRow._id}`,
  //       {
  //         first_name: currentRow.first_name,
  //         last_name: currentRow.last_name,
  //         email: currentRow.email,
  //         type: currentRow.type,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       setErrorMessages([]);
  //       if (response.data.success === true) {
  //         console.log("Saved");
  //         fetchData(page * rowsPerPage, rowsPerPage);
  //         setAlertMessage({
  //           open: true,
  //           title: "Success",
  //           message: "User has been Updated successfully",
  //           variant: "info",
  //         });
  //         setIsLoading(false);
  //         handleClose();
  //       } else {
  //         console.log("Failed to Update");
  //         setAlertMessage({
  //           open: true,
  //           title: "Failed",
  //           message: response.data.message,
  //           variant: "info",
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("Error Occurred: ", e);
  //       setErrorMessages([]);
  //       setAlertMessage({
  //         open: true,
  //         title: "Error Occurred!",
  //         message: "Please try again later.",
  //         variant: "error",
  //       });
  //     });
  //   setIsLoading(false);
  // };
  // const handleDelete = async (_id, name) => {
  //   setIsLoading(false);
  //   if (_id === "") {
  //     setAlertMessage({ open: true, title: "Error", variant: "error" });
  //     setErrorMessages(["User ID is missing. Please try again!"]);
  //     return;
  //   }
  //   axios
  //     .delete(`/admin/user/delete/${_id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       setErrorMessages([]);
  //       if (response.data.status === "success") {
  //         setAlertMessage({
  //           open: true,
  //           title: "Success",
  //           message: "User has been Deleted successfully",
  //           variant: "warning",
  //         });
  //         console.log("Deleted");
  //         fetchData(page * rowsPerPage, rowsPerPage);
  //         handleClose();
  //       } else {
  //         console.log("Failed to Delete. Please Try again later");
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((e) => {
  //       console.log("Error Occurred: ", e);
  //       setErrorMessages([]);
  //       setAlertMessage({
  //         open: true,
  //         title: "Error Occurred!",
  //         message: "Please try again later.",
  //         variant: "error",
  //       });
  //       setIsLoading(false);
  //     });
  // };

  React.useEffect(() => {
    fetchData(page * rowsPerPage, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchData = async (skip, limit) => {
    axios
      .get("/user/paginated/admin", {
        params: {
          skip: 0,
          limit: 100,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Data fetched successfully");
          setRows(response.data.data);
        } else {
          console.log("Failed to fetch data");
          setAlertMessage({
            open: true,
            title: "No Data",
            message: "No data available",
            variant: "info",
          });
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setAlertMessage({
          open: true,
          title: error.title,
          message: error.message,
          variant: "error",
        });
      });
    axios
      .get("/department", {
        params: {
          skip: 0,
          limit: 100,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Department Data fetched successfully");
          setDepartmentData(response.data.data);
        } else {
          console.log("Failed to fetch data");
          setAlertMessage({
            open: true,
            title: "No Data",
            message: "No data available",
            variant: "info",
          });
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setAlertMessage({
          open: true,
          title: error.title,
          message: error.message,
          variant: "error",
        });
      });
  };

  const searchFunction = async () => {
    if (search === "") {
      return;
    }
    console.log(search);
    // axios.get('https://student-discipline-api-fmm2.onrender.com/violation/search', {
    //     params: {
    //     query: search
    //     },
    //     headers: {
    //     'Content-Type': 'application/json',
    //     }
    // })
    // .then((response) => {
    //     if(response.data.success === true){
    //         console.log("Searched data fetched successfully!");
    //         setRows(response.data.data);
    //     }
    //     else{
    //         console.log("Failed to fetch search data");
    //     }
    // })
    // .catch((error) => {
    //     console.error('There was an error searching the data!', error);
    // });
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // console.log('Debounced function called with args:', args);
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedSearchFunction = debounce(searchFunction, 300);
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
  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: "blur(24px)",
    border: "1px solid",
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
      : alpha(theme.palette.background.default, 0.4),
    boxShadow: `0px 4px 6px ${alpha(red[500], 0.9)}`,
  }));
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 15, sm: 15 },
        pb: { xs: 8, sm: 12 },
        height: "100svh",
      }}
    >
      <div className="w-full h-full mx-auto ">
        <div className="flex flex-col md:flex-row justify-between gap-x-2 text-sm md:text-md bg-white my-2 rounded-md px-1 py-5">
          <h1 className="md:text-3xl text-2xl flex items-center">Users List</h1>
          <Tooltip title="Create User">
            <button
              className=" my-2 p-2 rounded-sm  hover:bg-red-200 text-red-500 hover:text-red-700"
              onClick={() => handleCreateOpen()}
            >
              <AddIcon /> Create User
            </button>
          </Tooltip>
        </div>
        {/* <div className="flex">
        <TextField
          className=""
          autoFocus
          label="Search by Name"
          placeholder="Ex. John Doe"
          id="standard-required"
          variant="standard"
          type="text"
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSearchFunction(e.target.value);
          }}
        />
        <Button
          className="rounded-sm text-white bg-blue-600 text-center  hover:bg-blue-750 hover:text-black"
          onClick={() => searchFunction()}
        >
          Search
        </Button>
      </div> */}
        <StyledToolbar variant="dense" disableGutters>
          <TableContainer component={Paper} className="">
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <th className="py-5 px-4 font-bold ">Name</th>
                  <th className="py-5 px-4 font-bold ">Username</th>
                  <th className="py-5 px-4 font-bold">Email address</th>
                  <th className="py-5 px-4 font-bold text-center">Category</th>
                  {/* <th className="py-5 px-4 font-bold text-center">Actions</th> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row">
                      {row.first_name && row.last_name
                        ? row.first_name + " " + row.last_name
                        : "No name attached"}
                    </TableCell>
                    <TableCell>
                      {row.username ? row.username : "No username"}
                    </TableCell>
                    <TableCell>
                      {row.email ? row.email : "No email address attached"}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        className={`p-2 rounded-sm text-center
                      ${row.type === "ADMIN" ? "primary" : "secondary"}`}
                        color={row.type === "ADMIN" ? "primary" : "secondary"}
                      >
                        {row.type ? row.type : "No type attached"}{" "}
                      </Button>
                    </TableCell>
                    {/* <td className="flex justify-center">
                    <Tooltip title="Edit">
                      <Button
                        className=" p-2 rounded-sm text-white hover:bg-yellow-600 hover:text-white"
                        onClick={() => handleOpen(row)}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        className=" p-2 rounded-sm text-white hover:bg-red-600 hover:text-white"
                        onClick={() => {
                          setCurrentRow({ ...row });
                          setopenDelete(true);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </td> */}
                  </TableRow>
                ))}
                {rows.length == 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6}>Loading....</TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[{ label: "All", value: -1 }]} // Provide an array of options
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
            {/* <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit User Information</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="First Name"
                type="text"
                fullWidth
                value={currentRow.first_name}
                required={true}
                onChange={(e) =>
                  setCurrentRow({
                    ...currentRow,
                    first_name: e.target.value,
                  })
                }
              />
              <TextField
                autoFocus
                margin="dense"
                label="last Name"
                type="text"
                fullWidth
                value={currentRow.last_name}
                required={true}
                onChange={(e) =>
                  setCurrentRow({
                    ...currentRow,
                    last_name: e.target.value,
                  })
                }
              />
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="text"
                fullWidth
                value={currentRow.email}
                required={true}
                onChange={(e) =>
                  setCurrentRow({
                    ...currentRow,
                    email: e.target.value,
                  })
                }
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentRow.type}
                  label="Type"
                  onChange={(e) =>
                    setCurrentRow({ ...currentRow, type: e.target.value })
                  }
                >
                  <MenuItem value={"ADMIN"}>Admin</MenuItem>
                  <MenuItem value={"SECURITY"}>Security Guard</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleUpdate}
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving...." : "Save"}
              </Button>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog> */}

            {/* <Dialog open={openDelete} onClose={handleClose}>
            <DialogTitle>Delete User?</DialogTitle>
            <DialogContent>
              <TextField
                id="outlined-read-only-input"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                margin="dense"
                label="First Name"
                fullWidth
                defaultValue={currentRow.first_name}
                readOnly={true}
              />
              <TextField
                id="outlined-read-only-input"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                margin="dense"
                label="Last Name"
                type="text"
                fullWidth
                defaultValue={currentRow.last_name}
                readOnly
              />
              <TextField
                id="outlined-read-only-input"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                margin="dense"
                label="Email Address"
                type="text"
                fullWidth
                defaultValue={currentRow.email}
                readOnly
              />
              <TextField
                id="outlined-read-only-input"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                margin="dense"
                label="Type"
                type="text"
                fullWidth
                defaultValue={currentRow.type}
                readOnly
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDelete(currentRow._id, currentRow.name)}
                color="primary"
              >
                Delete
              </Button>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog> */}
          </TableContainer>
        </StyledToolbar>
        <Dialog open={openCreate} onClose={handleClose}>
          <DialogTitle>Create User</DialogTitle>
          <DialogContent>
            <form>
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
              <FormControl fullWidth margin="dense">
                <InputLabel id="demo-simple-select-label" color="error">
                  Type
                </InputLabel>
                <Select
                  color="error"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={user.type}
                  label="Type"
                  onChange={(e) => {
                    setUser({ ...user, type: e.target.value }),
                      console.log(e.target.value);
                  }}
                >
                  <MenuItem value={"ADMIN"}>Admin</MenuItem>
                  <MenuItem value={"SECURITY"}>Security Guard</MenuItem>
                  <MenuItem value={"PROGRAM HEAD"}>Program Head</MenuItem>
                  <MenuItem value={"DEAN"}>Dean</MenuItem>
                  {/* <MenuItem value={"PROFESSOR"}>Professor</MenuItem> */}
                </Select>
              </FormControl>
              {user.type === "PROGRAM HEAD" && (
                <FormControl fullWidth margin="dense">
                  <InputLabel id="demo-simple-select-label" color="error">
                    Assign a Department
                  </InputLabel>
                  <Select
                    color="error"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={user.assigned_department}
                    label="Assign a Department"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        assigned_department: e.target.value,
                      }),
                        console.log(e.target.value);
                    }}
                  >
                    {departmentData.map((department, idx) => (
                      <MenuItem value={department.name} key={idx}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {user.type === "DEAN" && (
                <FormControl fullWidth margin="dense">
                  <InputLabel id="demo-simple-select-label" color="error">
                    Assign to Department/s
                  </InputLabel>
                  <Select
                    color="error"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={user.assigned_departments}
                    label="Assign a Department"
                    multiple
                    onChange={(e) => {
                      addMultipleDepartment(e);
                      // console.log(e.target.value);
                      // if (
                      //   user.assigned_departments.includes(e.target.value)
                      // ) {
                      //   return;
                      // } else {
                      //   setUser({
                      //     ...user,
                      //     assigned_departments: e.target.value.split(","),
                      //   });
                      // }
                    }}
                  >
                    {departmentData.map((department) => (
                      <MenuItem key={department.name} value={department.name}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave} color="error" disabled={isLoading}>
              {isLoading ? "Saving...." : "Create"}
            </Button>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
    </Container>
  );
}
