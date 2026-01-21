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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import {
  Alert,
  AlertTitle,
  Snackbar,
  TableHead,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

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
  const [open, setOpen] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState({
    id: "",
    username: "",
    first_name: "",
    last_name: "",
    assigned_department: "",
    email: "",
    password: "",
    type: "",
  });

  const handleOpen = (row) => {
    setCurrentRow(row);
    setOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlertMessage({ open: false });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData();
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 6);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRow({
      id: "",
      username: "",
      first_name: "",
      last_name: "",
      assigned_department: "",
      email: "",
      password: "",
      type: "",
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
    console.log(currentRow);
    // return;
    const assignedDepartment = departmentRows.find(
      (department) => department.name === currentRow.assigned_department
    );
    let departmentsToAssign = [assignedDepartment._id];

    axios
      .put(
        `admin`,
        {
          id: currentRow.id,
          username: currentRow.username,
          first_name: currentRow.first_name,
          last_name: currentRow.last_name,
          assigned_department: departmentsToAssign,
          email: currentRow.email,
          password: currentRow.password,
          type: currentRow.type,
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


  React.useEffect(() => {
    fetchData(page * rowsPerPage, rowsPerPage);
    fetchDepartments();
    return () => {
      console.log("Users Management component unmounted");
    };
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    axios
      .get("admin", {
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
          message: error.message,
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

  const getDepartmentValue = (departmentId) => {
    const department = departmentRows.find(
      (department) => department._id === departmentId[0]
    );

    // Check if department was found
    if (department) {
      return department.name;
    } else {
      console.warn("Department not found for ID:", departmentId);
      return null;
    }
  };
  return (
    <div className="flex flex-col w-full transition-colors duration-300">
      <div
        className="flex justify-between gap-x-2 my-2 md:m-0 bg-white dark:bg-dark-paper px-4 rounded-md transition-colors duration-300"
        style={{ fontSize: "16px" }}
      >
        <h1 className="py-3" style={{ fontSize: "16px", color: "black" }}>
          <span className="dark:text-white">Program Head</span>
        </h1>
      </div>
      <div>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table sx={{ minWidth: 500, width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Email address</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Type</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center" component="th" scope="row">
                    {row.first_name && row.last_name
                      ? row.first_name + " " + row.last_name
                      : "No name attached"}
                  </TableCell>
                  <TableCell align="center">
                    {row.email ? row.email : "No email address attached"}
                  </TableCell>
                  <TableCell align="center">
                    {row.assigned_department
                      ? getDepartmentValue(row.assigned_department)
                      : "No department attached"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      className="p-2 rounded-sm text-center error"
                      color="primary"
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
                        color="primary"
                      >
                        <EditIcon color="primary" />
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
        </TableContainer>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Assign Program Chair to their Respective Departments
        </DialogTitle>
        <DialogContent>
          {/* <FormControl fullWidth margin="dense" readOnly>
                <InputLabel id="demo-simple-select-label" color="primary">
                  Category
                </InputLabel>
                <Select
                  readOnly
                  color="primary"
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
              </FormControl> */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label" color="primary">
              Department
            </InputLabel>
            <Select
              color="primary"
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
          <Button onClick={handleUpdate} color="primary" disabled={isLoading}>
            {isLoading ? "Saving...." : "Save"}
          </Button>
          <Button onClick={handleClose} color="primary">
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
  );
}
