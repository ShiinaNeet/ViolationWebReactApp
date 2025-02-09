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
  ListItemButton,
  ListItemText,
  Snackbar,
  styled,
  TableHead,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import formatDate from "../utils/moment";
import { red } from "@mui/material/colors";
import { RemoveRedEye } from "@mui/icons-material";

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
  boxShadow: `0px 10px 6px rgba(0, 0, 0, 0.1)`,
}));
export default function Violations() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openDelete, setopenDelete] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState({
    _id: "",
    name: "",
    description: "",
    date: "",
  });
  const [search, setSearch] = React.useState("");
  const [violations, setViolations] = React.useState({
    name: "",
    description: "",
    date: "",
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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 6));
    setPage(0);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenCreate(false);
    setopenDelete(false);
    setCurrentRow({ _id: "", name: "", description: "", date: "" });
    setViolations({ id: "", name: "", description: "", date: "" });
  };
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertMessage({ open: false });
  };
  const [rowDataToView, setRowDataToView] = React.useState({
    id: "",
    category: "",
    section: "",
    offense_codes: [],
    sanctions: [],
    set: "",
    violations: [],
  });
  const handleOpen = (row) => {
    setRowDataToView(row);
    setOpen(true);
  };

  // const handleSave = async () => {
  //   setIsLoading(true);
  //   if (violations.name === "" || violations.description === "") {
  //     setAlertMessage({ open: true, title: "Error", variant: "error" });
  //     setErrorMessages(["Please fill in all fields"]);
  //     setIsLoading(false);
  //     return;
  //   }
  //   axios
  //     .post(
  //       "/violation/create",
  //       {
  //         name: violations.name,
  //         date: Date.now().toString(),
  //         description: violations.description,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       setErrorMessages([]);
  //       if (response.data.status === "success") {
  //         console.log("Saved");
  //         setAlertMessage({
  //           open: true,
  //           title: "Success",
  //           message: "Violation has been added successfully",
  //           variant: "success",
  //         });
  //         fetchData();
  //         setIsLoading(false);
  //         handleClose();
  //       } else {
  //         console.log("Failed to save");
  //         setAlertMessage({
  //           open: true,
  //           title: "Failed",
  //           message: response.data.message,
  //           variant: "info",
  //         });
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((e) => {
  //       console.log("Error Occurred: ", e);
  //       setErrorMessages([]);
  //       setIsLoading(false);
  //       setAlertMessage({
  //         open: true,
  //         title: "Error Occurred!",
  //         message: "Please try again later.",
  //         variant: "error",
  //       });
  //     });
  // };
  // const handleUpdate = async () => {
  //   setIsLoading(true);
  //   if (currentRow.name === "" || currentRow.description === "") {
  //     setAlertMessage({ open: true, title: "Error", variant: "error" });
  //     setErrorMessages(["Please fill in all fields"]);
  //     setIsLoading(false);
  //     return;
  //   }

  //   axios
  //     .put(
  //       `/violation/update?violation_id=${currentRow._id}`,
  //       {
  //         name: currentRow.name,
  //         date: Date.now().toString(),
  //         description: currentRow.description,
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
  //         fetchData();
  //         setAlertMessage({
  //           open: true,
  //           title: "Success",
  //           message: "Violation has been Updated successfully",
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
  //         title: e.title,
  //         message: e.message,
  //         variant: "error",
  //       });
  //     });
  //   setIsLoading(false);
  // };
  // const handleDelete = async (_id, name) => {
  //   setIsLoading(false);
  //   if (_id === "") {
  //     setAlertMessage({ open: true, title: "Error", variant: "error" });
  //     setErrorMessages(["Please fill in all fields"]);
  //     return;
  //   }
  //   axios
  //     .delete(`/violation/delete/${_id}`, {
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
  //           message: "Violation has been Deleted successfully",
  //           variant: "warning",
  //         });
  //         console.log("Deleted");
  //         fetchData();
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
    fetchData();
    //setRows(initialRows);
    return () => {
      console.log("Violations component unmounted");
    };
  }, []);

  const fetchData = async () => {
    axios
      .get("/violation", {
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

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 10, sm: 15 },
        pb: { xs: 8, sm: 12 },
        height: "100vh",
      }}
    >
      <div className="w-full h-full mx-auto ">
        <div className="flex flex-col md:flex-row justify-between gap-x-2 text-sm md:text-md bg-white my-2 rounded-md px-1 py-5">
          <h1 className="md:text-3xl text-2xl flex items-center">
            Violation List
          </h1>
          {/* <Tooltip title="Create Violation">
            <Button
              color="error"
              onClick={() => handleCreateOpen()}
              className="p-2"
            >
              <AddIcon /> Create Violation
            </Button>
          </Tooltip> */}
        </div>
        <StyledToolbar variant="dense" disableGutters>
          <TableContainer component={Paper} className="">
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <th className="py-5 px-4 font-bold ">Section</th>
                  <th className="py-5 px-4 font-bold text-center w-1/3 ">
                    Category
                  </th>
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
                  <TableRow key={row.id} className="slide-in-down-visible">
                    <TableCell scope="row">
                      <Tooltip title={row.section} arrow>
                        <div className="flex flex-wrap break-words whitespace-normal justify-start">
                          {row.section}
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          row.category.charAt(0).toUpperCase() +
                          row.category.slice(1)
                        }
                        arrow
                      >
                        <div className="flex flex-wrap break-words whitespace-normal justify-center">
                          <Chip
                            label={
                              row.category.charAt(0).toUpperCase() +
                              row.category.slice(1)
                            }
                            color={
                              row.category === "major" ? "primary" : "error"
                            }
                            sx={{ width: "50%" }}
                            variant="outlined"
                          />
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="flex justify-center" align="center">
                      <Tooltip title="Edit">
                        <Button
                          className="rounded-sm text-white hover:bg-red-100 hover:text-blue"
                          onClick={() => handleOpen(row)}
                        >
                          <RemoveRedEye color="error" />
                        </Button>
                      </Tooltip>
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
            {/* <Dialog
              open={open}
              onClose={handleClose}
              fullWidth="true"
              maxWidth="md"
            >
              <DialogTitle>Edit Violation</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  color="error"
                  margin="dense"
                  label="Violation Name"
                  type="text"
                  fullWidth
                  value={currentRow.name}
                  required={true}
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      name: e.target.value,
                    })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleUpdate}
                  color="error"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving...." : "Save"}
                </Button>
                <Button onClick={handleClose} color="error">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openCreate}
              onClose={handleClose}
              fullWidth="true"
              maxWidth="md"
            >
              <DialogTitle>Create Violation</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  color="error"
                  margin="dense"
                  label="Violation Name"
                  type="text"
                  fullWidth
                  value={violations.name}
                  onChange={(e) =>
                    setViolations({
                      ...violations,
                      name: e.target.value,
                    })
                  }
                />
                <TextField
                  color="error"
                  margin="dense"
                  label="Description"
                  type="text"
                  fullWidth
                  value={violations.description}
                  onChange={(e) =>
                    setViolations({
                      ...violations,
                      description: e.target.value,
                    })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSave} color="error" disabled={isLoading}>
                  {isLoading ? "Saving...." : "Save"}
                </Button>
                <Button onClick={handleClose} color="error">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openDelete} onClose={handleClose}>
              <DialogTitle>Delete Violation?</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  color="error"
                  margin="dense"
                  label="Violation Name"
                  type="text"
                  fullWidth
                  value={currentRow.name}
                  readOnly
                />
                <TextField
                  color="error"
                  margin="dense"
                  label="Date Updated"
                  type="text"
                  fullWidth
                  value={formatDate(
                    new Date(parseInt(currentRow.date)),
                    "MMMM DD, YYYY"
                  )}
                  readOnly
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => handleDelete(currentRow._id, currentRow.name)}
                  color="error"
                >
                  Delete
                </Button>
                <Button onClick={handleClose} color="error">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog> */}
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              fullWidth="true"
              maxWidth="false"
              sx={{
                // maxWidth: "95vw",
                maxHeight: "90vh",
                // width: "60vw",
                height: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginX: { md: "10px", lg: "auto" },
              }}
            >
              <DialogTitle>Violation Details</DialogTitle>
              <DialogContent
                sx={{
                  overflowY: "scroll", // Enable scrolling for long content
                  // Enable vertical scrolling when needed
                  marginBottom: "10px",
                  minWidth: "70vw",
                  maxWidth: "90vw",
                }}
              >
                <TextField
                  autoFocus
                  color="error"
                  margin="dense"
                  label="Category"
                  type="text"
                  fullWidth
                  className="capitalize"
                  value={
                    rowDataToView.category.length > 0
                      ? rowDataToView.category.charAt(0).toUpperCase() +
                        rowDataToView.category.slice(1)
                      : "No data"
                  }
                  sx={{ cursor: "none" }}
                  readOnly
                />
                <TextField
                  autoFocus
                  color="error"
                  margin="dense"
                  label="Section"
                  type="text"
                  fullWidth
                  value={
                    rowDataToView.section.length > 0
                      ? rowDataToView.section
                      : "No data"
                  }
                  sx={{ cursor: "none" }}
                  readOnly
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    my: 1,
                  }}
                >
                  <Typography variant="h8" sx={{ mb: 1 }}>
                    Offense Codes:
                  </Typography>
                  <div>
                    {rowDataToView.offense_codes.length > 0 && (
                      <>
                        {rowDataToView.offense_codes.map((offense_code) => (
                          <Chip
                            label={offense_code}
                            variant="outlined"
                            color="primary"
                            key={offense_code}
                            margin="dense"
                            size="medium"
                            sx={{ mr: 0.5, mb: 0.5, p: 0.5 }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", marginY: 1 }}
                >
                  <Typography variant="h8">Sanctions:</Typography>
                  <div>
                    {rowDataToView.sanctions &&
                      Object.entries(rowDataToView.sanctions).map(
                        ([key, value], idx) => (
                          <ListItemButton key={key}>
                            <ListItemText
                              primary={`${idx + 1}. ${
                                key.replace(/_/g, " ").charAt(0).toUpperCase() +
                                key.replace(/_/g, " ").slice(1)
                              }: ${value}`}
                            />
                          </ListItemButton>
                        )
                      )}
                  </div>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", my: 1 }}>
                  <Typography variant="h8" sx={{ mb: 1 }}>
                    Offense Codes:
                  </Typography>
                  <div>
                    {rowDataToView.violations.length > 0 &&
                      rowDataToView.violations.map((violation, idx) => (
                        <ListItemButton key={violation.code}>
                          <ListItemText
                            primary={`${violation.code}: ${violation.description}`}
                          />
                        </ListItemButton>
                      ))}
                  </div>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="error">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </TableContainer>
        </StyledToolbar>

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
