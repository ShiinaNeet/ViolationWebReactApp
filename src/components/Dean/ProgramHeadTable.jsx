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
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TableHead,
} from "@mui/material";
import axios from "axios";
import formatDate from "@src/utils/moment";

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
  const [departmentRows, setDepartmentRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openDelete, setopenDelete] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState({
    _id: "",
    first_name: "",
    last_name: "",
    email: "",
    type: "",
    assigned_department: "",
  });
  const [search, setSearch] = React.useState("");
  const [user, setUser] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    type: "",
    assigned_department: "",
    password: "",
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
      setAlertMessage({ open: true, title: "Error", variant: "error" });
      setErrorMessages(["Please fill in all fields"]);
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
          title: "Error Occurred!",
          message: "Please try again later.",
          variant: "error",
        });
      });
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    if (currentRow.type === "" || currentRow.assigned_department === "") {
      setAlertMessage({ open: true, title: "Error", variant: "error" });
      setErrorMessages(["Please fill in all fields"]);
      setIsLoading(false);
      return;
    }
    axios
      .put(
        `/user/update/admin/${currentRow._id}?id=${currentRow._id}`,
        {
          type: currentRow.type,
          assigned_department: currentRow.assigned_department,
        },
        {
          params: {
            id: currentRow._id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setErrorMessages([]);
        if (response.data.status === "success") {
          console.log("Saved");
          fetchData(page * rowsPerPage, rowsPerPage);
          setAlertMessage({
            open: true,
            title: "Success",
            message: "Program Head has been updated successfully.",
            variant: "info",
          });
          setIsLoading(false);
          handleClose();
        } else {
          console.log("Failed to Update. Please Try again later");
          setAlertMessage({
            open: true,
            title: "Failed",
            message: response.data.message,
            variant: "info",
          });
        }
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setErrorMessages([]);
        setAlertMessage({
          open: true,
          title: "Error Occurred!",
          message: "Please try again later.",
          variant: "error",
        });
      });
    setIsLoading(false);
  };
  const handleDelete = async (_id, name) => {
    setIsLoading(false);
    if (_id === "") {
      setAlertMessage({ open: true, title: "Error", variant: "error" });
      setErrorMessages(["User ID is missing. Please try again!"]);
      return;
    }
    axios
      .delete(`/admin/user/delete/${_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setErrorMessages([]);
        if (response.data.status === "success") {
          setAlertMessage({
            open: true,
            title: "Success",
            message: "User has been Deleted successfully",
            variant: "warning",
          });
          console.log("Deleted");
          fetchData(page * rowsPerPage, rowsPerPage);
          handleClose();
        } else {
          console.log("Failed to Delete. Please Try again later");
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setErrorMessages([]);
        setAlertMessage({
          open: true,
          title: "Error Occurred!",
          message: "Please try again later.",
          variant: "error",
        });
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchData(page * rowsPerPage, rowsPerPage);
    fetchDepartments();
    return () => {
      console.log("Users Management component unmounted");
    };
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
        if (response.data.status == "success") {
          console.log("Data fetched successfully");
          setRows(response.data.data);
        } else {
          console.log("Failed to fetch data");
          setAlertMessage({
            open: true,
            title: "Failed",
            message: "Failed to fetch data.",
            variant: "info",
          });
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setAlertMessage({
          isOpen: true,
          title: "Failed",
          message: response.data.message,
          variant: "info",
        });
      });
  };
  const fetchDepartments = async () => {
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
          console.log("Data fetched successfully");
          setDepartmentRows(response.data.data);
        } else {
          console.log("Failed to fetch data");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  // const searchFunction = async () => {
  //   if (search === "") {
  //     return;
  //   }
  //   console.log(search);
  //   // axios.get('https://student-discipline-api-fmm2.onrender.com/violation/search', {
  //   //     params: {
  //   //     query: search
  //   //     },
  //   //     headers: {
  //   //     'Content-Type': 'application/json',
  //   //     }
  //   // })
  //   // .then((response) => {
  //   //     if(response.data.success === true){
  //   //         console.log("Searched data fetched successfully!");
  //   //         setRows(response.data.data);
  //   //     }
  //   //     else{
  //   //         console.log("Failed to fetch search data");
  //   //     }
  //   // })
  //   // .catch((error) => {
  //   //     console.error('There was an error searching the data!', error);
  //   // });
  // };

  // const debounce = (func, delay) => {
  //     let debounceTimer;
  //     return function(...args) {
  //         clearTimeout(debounceTimer);
  //         debounceTimer = setTimeout(() => {
  //             // console.log('Debounced function called with args:', args);
  //             func.apply(this, args);
  //         }, delay);
  //     };
  // };

  // const debouncedSearchFunction = debounce(searchFunction, 300);

  return (
    <div className="container h-full mx-auto px-2">
      <div className="flex justify-between h-fit gap-x-2 my-2 md:m-0 text-sm md:text-md">
        <h1 className="text-3xl py-3">Program Head</h1>
        {/* <Tooltip title="Create User">
          <button
            className="bg-blue-500 my-2 px-2 rounded-sm text-white hover:bg-blue-600"
            onClick={() => handleCreateOpen()}
          >
            <AddIcon /> Create User
          </button>
        </Tooltip> */}
      </div>
      {/* 
                <div className='flex justify-between h-fit gap-x-2'>
                    <TextField
                    className='my-2 py-2'
                    autoFocus
                    margin="dense"
                    label="Search Violation"
                    type="text"
                        fullWidth
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            // debouncedSearchFunction(e.target.value);
                        }}
                        />
                        <button className='bg-blue-500 my-2 p-5 rounded-sm text-white hover:bg-blue-600'
                        onClick={() => searchFunction()}
                        >
                        Search
                        </button>
                    </div> */}
      <div className="shadow-sm shadow-zinc-500 rounded-lg">
        <TableContainer component={Paper} className="">
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <th className="py-5 px-4 font-bold ">Name</th>
                <th className="py-5 px-4 font-bold">Email address</th>
                <th className="py-5 px-4 font-bold ">Department</th>
                <th className="py-5 px-4 font-bold text-center">Type</th>
                <th className="py-5 px-4 font-bold text-center">Actions</th>
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
                    {row.email ? row.email : "No email address attached"}
                  </TableCell>
                  <TableCell>
                    {row.assigned_department
                      ? row.assigned_department
                      : "No department attached"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      className="p-2 rounded-sm text-center error"
                      color="error"
                    >
                      {row.type ? row.type : "No type attached"}{" "}
                    </Button>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="flex items-center justify-center"
                  >
                    <Tooltip
                      title="Edit"
                      className="flex items-end justify-center"
                    >
                      <Button
                        className=" rounded-sm text-white"
                        onClick={() => handleOpen(row)}
                        color="error"
                      >
                        <EditIcon color="error" />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length == 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6}>No Data.</TableCell>
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
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              Assign Program Chair to their Respective Departments
            </DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="dense">
                <InputLabel id="demo-simple-select-label" color="error">
                  Category
                </InputLabel>
                <Select
                  color="error"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentRow.type}
                  label="Category"
                  onChange={(e) =>
                    setCurrentRow({ ...currentRow, type: e.target.value })
                  }
                >
                  <MenuItem value={"ADMIN"}>Admin</MenuItem>
                  <MenuItem value={"SECURITY"}>Security Guard</MenuItem>
                  <MenuItem value={"PROGRAM HEAD"}>Program Head</MenuItem>
                  <MenuItem value={"DEAN"}>Dean</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel id="demo-simple-select-label" color="error">
                  Department
                </InputLabel>
                <Select
                  color="error"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentRow.assigned_department}
                  label="Department"
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      assigned_department: e.target.value,
                    })
                  }
                >
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                  {departmentRows.map((department) => {
                    return (
                      <MenuItem key={department.name} value={department.name}>
                        {department.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdate} color="error" disabled={isLoading}>
                {isLoading ? "Saving...." : "Save"}
              </Button>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
      </div>

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
}
