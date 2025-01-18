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
import { alpha } from "@mui/material/styles";
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

export default function DepartmentTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openDelete, setopenDelete] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState({
    name: "",
  });
  const [search, setSearch] = React.useState("");
  const [department, setDepartment] = React.useState({
    name: "",
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
      name: "",
    });
    setDepartment({
      name: "",
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
    if (department.name === "") {
      setAlertMessage({ open: true, title: "Error", variant: "error" });
      setErrorMessages(["Please fill in all fields"]);
      setIsLoading(false);
      return;
    }
    axios
      .post(
        "/department/create",
        {
          name: department.name,
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
            message: "Department has been created successfully",
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

  React.useEffect(() => {
    fetchData(page * rowsPerPage, rowsPerPage);
    return () => {
      console.log("Department Management component unmounted");
    };
  }, [page, rowsPerPage]);

  const fetchData = async (skip, limit) => {
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
          console.log("Department data fetched successfully");
          setRows(response.data.data);
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
    <div className="container h-full mx-auto px-2 mb-20 mt-5">
      <div className="flex flex-col sm:flex-row justify-between gap-x-2 md:m-0 text-sm md:text-md bg-white rounded-sm px-2">
        <h1 className="text-3xl py-3">Departments</h1>
        {/* <Tooltip title="Create Department">
          <Button
            className="bg-blue-500 my-2 px-2 rounded-sm text-white "
            onClick={() => handleCreateOpen()}
            color="error"
          >
            <AddIcon color="error" /> Create Department
          </Button>
        </Tooltip> */}
      </div>
      <div style={{ boxShadow: `0px 4px 6px ${alpha(red[500], 0.9)}` }}>
        <TableContainer component={Paper} className="">
          <Table sx={{ minWidth: 350 }}>
            <TableHead>
              <TableRow>
                <th className="py-5 px-4 font-bold ">Name</th>
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
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name ? row.name : "No name attached"}
                  </TableCell>
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
          <Dialog open={openCreate} onClose={handleClose}>
            <DialogTitle>Create Department</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  autoFocus
                  color="error"
                  margin="dense"
                  label="Department Name"
                  type="text"
                  fullWidth
                  value={department.name}
                  required={true}
                  onChange={(e) =>
                    setDepartment({
                      ...department,
                      name: e.target.value,
                    })
                  }
                />
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
