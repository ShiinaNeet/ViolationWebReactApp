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
import { Alert, AlertTitle, Snackbar, TableHead } from "@mui/material";
import axios from "axios";
import formatDate from "../utils/moment";

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
        date: Date.now(),
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
        setCurrentRow({ _id: "", name: "", description: "", date: "" });
        setViolations({ id: "", name: "", description: "", date: "" });
    };
    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setAlertMessage({ open: false });
    };

    const handleSave = async () => {
        setIsLoading(true);
        if (violations.name === "" || violations.description === "") {
            setAlertMessage({ open: true, title: "Error", variant: "error" });
            setErrorMessages(["Please fill in all fields"]);
            setIsLoading(false);
            return;
        }
        axios
            .post(
                "/violation/create",
                {
                    name: violations.name,
                    date: Date.now().toString(),
                    description: violations.description,
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
                        message: "Violation has been added successfully",
                        variant: "success",
                    });
                    fetchData();
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
        if (currentRow.name === "" || currentRow.description === "") {
            setAlertMessage({ open: true, title: "Error", variant: "error" });
            setErrorMessages(["Please fill in all fields"]);
            setIsLoading(false);
            return;
        }

        axios
            .put(
                `/violation/update?violation_id=${currentRow._id}`,
                {
                    name: currentRow.name,
                    date: Date.now().toString(),
                    description: currentRow.description,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setErrorMessages([]);
                if (response.data.success === true) {
                    console.log("Saved");
                    fetchData();
                    setAlertMessage({
                        open: true,
                        title: "Success",
                        message: "Violation has been Updated successfully",
                        variant: "info",
                    });
                    setIsLoading(false);
                    handleClose();
                } else {
                    console.log("Failed to Update");
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
            setErrorMessages(["Please fill in all fields"]);
            return;
        }
        axios
            .delete(`/violation/delete/${_id}`, {
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
                        message: "Violation has been Deleted successfully",
                        variant: "warning",
                    });
                    console.log("Deleted");
                    fetchData();
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
        fetchData();
        //setRows(initialRows);
        return () => {
            console.log("Violations component unmounted");
        };
    }, []);

    const fetchData = async () => {
        axios
            .get("/violation/paginated", {
                params: {
                    skip: 0,
                    limit: 100,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data.success === true) {
                    console.log("Data fetched successfully");
                    setRows(response.data.total);
                } else {
                    console.log("Failed to fetch data");
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
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
        <div className="container h-full mx-auto">
            <div className="container md:mx-auto py-5 ">
                <div className="flex justify-between h-fit gap-x-2 m-2 md:m-0 text-sm md:text-md">
                    <h1 className="text-3xl py-3">Violation List</h1>
                    <button
                        className="bg-blue-500 my-2 px-2 rounded-sm text-white hover:bg-blue-600"
                        onClick={() => handleCreateOpen()}
                    >
                        Add Violation
                    </button>
                </div>
                {/* <div className='flex justify-between h-fit gap-x-2'>
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

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }}>
                        <TableHead>
                            <TableRow>
                                <th className="py-5 px-4 font-bold ">Name</th>
                                <th className="py-5 px-4 font-bold">
                                    Description
                                </th>
                                <th className="py-5 px-4 font-bold">Date</th>
                                <th className="py-5 px-4 font-bold text-center">
                                    Actions
                                </th>
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
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>
                                        {formatDate(
                                            new Date(parseInt(row.date)),
                                            "MMMM DD, YYYY"
                                        )}
                                    </TableCell>
                                    <td className="flex gap-x-2 flex-row justify-center items-center">
                                        <Button
                                            className=" p-2 rounded-sm text-white hover:bg-yellow-600 hover:text-white"
                                            onClick={() => handleOpen(row)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className=" p-2 rounded-sm text-white hover:bg-red-600 hover:text-white"
                                            onClick={() => {
                                                setCurrentRow({ ...row });
                                                setopenDelete(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </TableRow>
                            ))}
                            {rows.length == 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6}>
                                        Loading....
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[
                                        { label: "All", value: -1 },
                                    ]} // Provide an array of options
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={
                                        handleChangeRowsPerPage
                                    }
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit Violation</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
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
                            <TextField
                                margin="dense"
                                label="Description"
                                type="text"
                                fullWidth
                                required={true}
                                value={currentRow.description}
                                onChange={(e) =>
                                    setCurrentRow({
                                        ...currentRow,
                                        description: e.target.value,
                                    })
                                }
                            />
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
                    </Dialog>
                    <Dialog open={openCreate} onClose={handleClose}>
                        <DialogTitle>Create Violation</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
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
                            <Button
                                onClick={handleSave}
                                color="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving...." : "Save"}
                            </Button>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openDelete} onClose={handleClose}>
                        <DialogTitle>Delete Violation?</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Violation Name"
                                type="text"
                                fullWidth
                                value={currentRow.name}
                                readOnly
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                type="text"
                                fullWidth
                                value={currentRow.description}
                                readOnly
                            />
                            <TextField
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
                                onClick={() =>
                                    handleDelete(
                                        currentRow._id,
                                        currentRow.name
                                    )
                                }
                                color="primary"
                            >
                                Delete
                            </Button>
                            <Button onClick={handleClose} color="primary">
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
