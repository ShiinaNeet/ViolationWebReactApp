import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { Alert, AlertTitle, Snackbar, TableHead } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import StudentViolationList from "../components/StudentViolationList";
import AlertMessageStudent from "../components/AlertMessageStudent";
import formatDate from "../utils/moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}
const Students = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [isLoading, setIsLoading] = React.useState(false);
    const [ViewModal, setViewModal] = React.useState(false);
    const [targetStudent, setStudent] = React.useState({
        userid: 0,
        fullname: "",
        violations: [],
        year: "",
        department: "",
        section: "",
        email: "",
    });
    const [violationList, setViolationList] = React.useState([]);

    const theme = useTheme();
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };
    const vertical = "bottom";
    const horizontal = "right";
    const [alertMessage, setAlertMessage] = React.useState({
        open: false,
        title: "",
        message: "",
        variant: "",
    });
    const [errorMessages, setErrorMessages] = React.useState([]);
    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setAlertMessage({ open: false });
    };

    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log("Rows per page: ", event.target.value);
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const [addStudentModal, setAddStudentModal] = React.useState(false);
    const [updateStudentViolationModal, setUpdateStudentViolationModal] =
        React.useState(false);
    const [deleteStudentViolationModal, setDeleteStudentViolationModal] =
        React.useState(false);
    const [messageStudentModal, setMessageStudentModal] = React.useState(false);

    useEffect(() => {
        fetchViolationData();
        fetchData();
    }, []);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setViewModal(false);
        setAddStudentModal(false);
        // setMessageStudentModal(false);
        setDeleteStudentViolationModal(false);
        setUpdateStudentViolationModal(false);
        setStudent({
            fullname: "",
            violations: [],
            year: "",
            department: "",
            section: "",
        });
    };
    const handleSendMessageModalClose = () => {
        setMessageStudentModal(false);
    }
    const handleViewViolationModal = (person) => {
        setAnchorEl(null);
        // console.log(person);
        // setStudent(person);
        fetchUser(person);
        setViewModal(true);
        setAddStudentModal(false);
    };
    const handleUpdateViolationModal = (person) => {
        setAnchorEl(null);
        setUpdateStudentViolationModal(true);
        setStudent(person);
    };

    const handleDeleteViolationModal = (person) => {
        setDeleteStudentViolationModal(true);
        setStudent(person);
        setAnchorEl(null);
    };
    const handleDelete = async () => {
        setIsLoading(true);
        if (
            targetStudent.userid == "" ||
            targetStudent.userid == null ||
            targetStudent.userid == 0
        ) {
            console.log("No violation to delete");
            setAlertMessage({
                open: true,
                title: "Error occured!",
                message:
                    "There is no target student to be deleted! Please try again!",
                variant: "info",
            });
            setIsLoading(false);
            return;
        }
        axios
            .delete(`/user/delete/${targetStudent.userid}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                setErrorMessages([]);
                if (response.data.status === "success") {
                    console.log("Saved");
                    fetchData();
                    setAlertMessage({
                        open: true,
                        title: "Success",
                        message: "Student Violation was deleted successfully!",
                        variant: "info",
                    });
                    setIsLoading(false);
                    setDeleteStudentViolationModal(false);
                    handleClose();
                } else {
                    console.log("Failed to Update");
                    setAlertMessage({
                        open: true,
                        title: "Failed",
                        message: response.data.description,
                        variant: "info",
                    });
                    setIsLoading(false);
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
                setIsLoading(false);
            });
    };
    const fetchData = async () => {
        axios
            .get("/user/paginated", {
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
                    // setRows(prevRows => {
                    //     const newRows = response.data.data.filter(
                    //         newRow => !prevRows.some(row => row.id === newRow.id)
                    //     );
                    //     return [...prevRows, ...newRows]; // Append only unique rows
                    // });
                    setPage(0);
                    console.log(
                        "Fetch data from fetch data function: ",
                        response.data.data
                    );
                    setRows(response.data.data);
                } else {
                    console.log("Failed to fetch data");
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
            });
    };
    const fetchViolationData = async () => {
        axios
            .get(
                "https://student-discipline-api-fmm2.onrender.com/violation/paginated",
                {
                    params: {
                        skip: 0,
                        limit: 100,
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                if (response.data.success === true) {
                    // console.log("Violation data fetched successfully");
                    setViolationList(response.data.total);
                } else {
                    console.log("Failed to fetch data");
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
            });
    };
    const fetchUser = async (person) => {
        axios
            .get(`/user/${person.userid}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                setStudent({
                    fullname: response.data.fullname,
                    userid: response.data.userid,
                    violations:
                        response.data.violations.length > 0
                            ? response.data.violations
                            : [],
                    year_and_department: response.data.year_and_department,
                    section: response.data.section,
                    email: response.data.email,
                });
                // console.log(targetStudent);
            })
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
            });
    };
    const [selectedViolation, setSelectedViolation] = React.useState({
        name: "",
        _id: "",
        date: "",
        description: "",
    });

    const handleDeleteViolation = (index) => {
        const updatedViolations = [...targetStudent.violations];
        updatedViolations.splice(index, 1);
        setStudent({ ...targetStudent, violations: updatedViolations });
    };

    const handleAddViolation = () => {
        // if (selectedViolation && !targetStudent.violations.some(v => v.name === selectedViolation.name)) {
        if (selectedViolation) {
            setSelectedViolation({
                ...selectedViolation,
                date: new Date().getTime(),
            });
            console.log(selectedViolation);
            const updatedViolations = [
                ...targetStudent.violations,
                selectedViolation,
            ];
            setStudent({ ...targetStudent, violations: updatedViolations });
            setSelectedViolation("");
        }
    };
    const transformedViolations = targetStudent.violations.map((violation) => ({
        ...violation,
        $oid: violation._id,
        _id: undefined, // Remove the _id field
    }));
    const handleUpdateViolation = () => {
        // console.log('Updating violation...');
        // console.log("Current student violation: ",targetStudent.violations);
        setIsLoading(true);
        if (
            targetStudent.violations.length == 0 ||
            targetStudent.department == ""
        ) {
            console.log("No violation to update");
            setAlertMessage({
                open: true,
                title: "Error occured!",
                message:
                    "Student Violation and Department fields are required!",
                variant: "info",
            });
            setIsLoading(false);
            return;
        }
        axios
            .put(
                `/user/update/${targetStudent.userid}`,
                {
                    year_and_department: targetStudent.year_and_department,
                    violations: transformedViolations,
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
                    fetchData();
                    setAlertMessage({
                        open: true,
                        title: "Success",
                        message: "Student Violation was updated successfully!",
                        variant: "info",
                    });
                    setIsLoading(false);
                    setUpdateStudentViolationModal(false);
                } else {
                    console.log("Failed to Update");
                    setAlertMessage({
                        open: true,
                        title: "Failed",
                        message: response.data.description,
                        variant: "info",
                    });
                    setIsLoading(false);
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
                setIsLoading(false);
            });
    };

    return (
        <>
            <div className="container mx-auto py-5">
                <div className="flex flex-col md:flex-row md:justify-between h-fit">
                    <h1 className="text-3xl p-3">Student List</h1>
                    {/* <button className='bg-blue-500 my-2 p-2 rounded-sm text-white hover:bg-blue-600'
                        onClick={() => setAddStudentModal(true)}
                    >
                        Add Student
                    </button> */}
                </div>
                <div className="shadow-sm shadow-zinc-500 rounded-lg p-3">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }}>
                            <TableHead>
                                <TableRow className="text-left">
                                    {/* <th className="py-5 px-4 border-b">ID</th> */}
                                    <th className="py-5 px-4 border-b">Name</th>
                                    <th className="py-5 px-4 border-b">
                                        Violation
                                    </th>
                                    <th className="py-5 px-4 border-b">
                                        Department and Year
                                    </th>
                                    <th className="py-5 px-4 border-b text-center">
                                        Date
                                    </th>
                                    <th className="py-5 px-4 border-b text-center">
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
                                ).map((student, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50"
                                    >
                                        {/* <td className="py-2 px-4 border-b">
                                            {student.userid}
                                        </td> */}
                                        <td className="py-2 px-4 border-b">
                                            {student.fullname}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {student.violations.length > 0
                                                ? student.violations[0].name
                                                : ""}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {student.year_and_department}
                                        </td>
                                        <td className="py-2 px-4 border-b flex-shrink-1 text-center">
                                            {student.violations.length > 0
                                                ? formatDate(
                                                      new Date(
                                                          parseInt(
                                                              student
                                                                  .violations[0]
                                                                  .date
                                                          )
                                                      ),
                                                      "MMMM DD, YYYY - hh:mm A"
                                                  )
                                                : ""}
                                        </td>
                                        <td className="border-b flex justify-center">
                                            <Tooltip title="View Student">
                                                <Button
                                                    className="rounded-sm text-white hover:bg-blue-600 hover:text-white"
                                                    onClick={() =>
                                                        handleViewViolationModal(
                                                            student
                                                        )
                                                    }
                                                >
                                                    <RemoveRedEyeIcon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Edit Student">
                                                <Button
                                                    className=" rounded-sm text-white hover:bg-yellow-600 hover:text-white"
                                                    onClick={() =>
                                                        handleUpdateViolationModal(
                                                            student
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Delete Student">
                                                <Button
                                                    className="rounded-sm text-white hover:bg-red-600 hover:text-white"
                                                    onClick={() =>
                                                        handleDeleteViolationModal(
                                                            student
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                                {rows.length == 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={6}>
                                            {" "}
                                            Loading....{" "}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            { label: "All", value: -1 },
                                        ]}
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        ActionsComponent={
                                            TablePaginationActions
                                        }
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            {ViewModal && (
                <Modal
                    open={ViewModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="modal bg-white h-fit sm:w-fit w-full my-auto rounded-md flex flex-col gap-y-3">
                        <div className="flex flex-col justify-center items-center md:flex-row sm:justify-between sm:items-center sm:w-full gap-x-5">
                            <h2 className="py-3 sm:text-2xl sm:font-bold text-center font-semibold">
                                Student Violation History
                            </h2>
                            <div className="gap-x-2">
                                <Button
                                    className="bg-blue-500 p-2 rounded-sm text-white hover:bg-blue-600 hover:text-white"
                                    onClick={() => setMessageStudentModal(true)}
                                >
                                    <AddAlertIcon /> Alert
                                </Button>
                                <Button
                                    className="bg-red-500 p-2 rounded-sm text-white hover:bg-red-600 hover:text-white"
                                    onClick={handleClose}
                                >
                                    <CloseIcon /> Close
                                </Button>
                            </div>
                        </div>

                        <label readOnly>
                            <strong className="font-bold">Name:</strong>
                            {targetStudent.fullname}
                        </label>
                        <label readOnly>
                            <strong className="font-bold">
                                Email Address:
                            </strong>
                            {targetStudent.email &&
                            targetStudent.email.length > 0
                                ? targetStudent.email
                                : "No Email Address"}
                        </label>
                        <label readOnly>
                            <strong className="font-bold">Department: </strong>{" "}
                            {targetStudent.year_and_department
                                ? targetStudent.year_and_department.includes(
                                      " - "
                                  )
                                    ? targetStudent.year_and_department.split(
                                          " - "
                                      )[0]
                                    : "Incorrect Format"
                                : "No Data"}
                        </label>
                        <label readOnly>
                            <strong className="font-bold"> Year: </strong>{" "}
                            {targetStudent.year_and_department
                                ? targetStudent.year_and_department.includes(
                                      " - "
                                  )
                                    ? targetStudent.year_and_department.split(
                                          " - "
                                      )[1]
                                    : "Incorrect Format"
                                : "No Data"}
                        </label>
                        {/* <label
                        readOnly
                        >
                            <strong className='font-bold'> Violation: </strong>{ targetStudent.violations && targetStudent.violations.length > 0 ? targetStudent.violations[0].name : ''}
                        </label> */}
                        <div id="Violation list">
                            <h2 className="py-3 text-2xl font-bold text-left">
                                Violation Records
                            </h2>
                            <StudentViolationList student={targetStudent} />
                        </div>
                    </div>
                </Modal>
            )}
            {addStudentModal && (
                <Modal
                    open={addStudentModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="modal bg-white h-fit w-fit rounded-md flex">
                        <div className="flex flex-col w-[400px] gap-y-5">
                            <h2 className="py-3 text-2xl font-bold text-center">
                                Add New Student
                            </h2>
                            <TextField
                                required
                                id="outlined-required"
                                label="Student Name"
                            />
                            <div className="flex gap-x-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                                    onClick={() => handleSave()}
                                >
                                    Submit
                                </button>
                                <button
                                    className=" hover:bg-slate-200 text-black font-bold py-2 px-4 rounded w-full"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {updateStudentViolationModal && (
                <Dialog
                    open={updateStudentViolationModal}
                    onClose={handleClose}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <DialogTitle>Edit Violation</DialogTitle>
                    <DialogContent>
                        <div>
                            <h3>Current Violations</h3>
                            <ul>
                                {targetStudent.violations.map(
                                    (violation, index) => (
                                        <li
                                            key={index}
                                            className="my-2 rounded-sm flex justify-between text-black border-2 border-solid border-red-500 "
                                        >
                                            <label className="p-2">
                                                {violation.name}{" "}
                                            </label>
                                            <Button
                                                onClick={() =>
                                                    handleDeleteViolation(index)
                                                }
                                                className="hover:border-1 hover:border-solid hover:border-blue-500 hover:border- hover:text-white rounded-none"
                                            >
                                                <DeleteOutlineIcon color="error" />
                                            </Button>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="my-5 w-full">
                            <h3 className="mb-3">Add Violation</h3>
                            <div className="flex ">
                                <select
                                    className="w-full border rounded  flex-1"
                                    value={selectedViolation.name}
                                    onChange={(e) => {
                                        const selectedName = e.target.value;
                                        const violation = violationList.find(
                                            (v) => v.name === selectedName
                                        );
                                        setSelectedViolation({
                                            name: violation.name,
                                            _id: violation._id,
                                            date: violation.date,
                                            description: violation.description,
                                        });
                                    }}
                                >
                                    <option value="">Select Violation</option>
                                    {violationList.map((violation, index) => (
                                        <option
                                            key={index}
                                            value={violation.name}
                                        >
                                            {violation.name}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    className=""
                                    onClick={handleAddViolation}
                                    color="primary"
                                >
                                    <AddIcon /> Add
                                </Button>
                            </div>

                            <TextField
                                className="my-5 py-5"
                                label="Department and Year (e.g. Computer Science - 3rd Year)"
                                type="text"
                                variant="standard"
                                value={targetStudent.year_and_department}
                                onChange={(e) =>
                                    setStudent({
                                        ...targetStudent,
                                        year_and_department: e.target.value,
                                    })
                                }
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                fullWidth
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className="bg-red-500"
                            onClick={handleUpdateViolation}
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating Student" : "Update Student"}
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {deleteStudentViolationModal && (
                <Dialog
                    open={deleteStudentViolationModal}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        Are you sure you want to delete this violation?
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex flex-col gap-y-2">
                            <p></p>
                            <label>Name: {targetStudent.fullname}</label>
                            <label readOnly>
                                <strong className="font-bold">
                                    Department:{" "}
                                </strong>{" "}
                                {targetStudent.year_and_department &&
                                targetStudent.year_and_department.includes(
                                    " - "
                                )
                                    ? targetStudent.year_and_department.split(
                                          " - "
                                      )[0]
                                    : ""}
                            </label>
                            <label readOnly>
                                <strong className="font-bold"> Year: </strong>{" "}
                                {targetStudent.year_and_department &&
                                targetStudent.year_and_department.includes(
                                    " - "
                                )
                                    ? targetStudent.year_and_department.split(
                                          " - "
                                      )[1]
                                    : ""}
                            </label>
                            <br />
                            <label>Violation(s): </label>
                            <ul>
                                {targetStudent.violations.map(
                                    (violation, index) => (
                                        <li
                                            key={index}
                                            className="border-2 border-solid border-red-500 my-2 rounded-sm flex justify-between text-black"
                                        >
                                            <label className="p-2">
                                                {violation.name}{" "}
                                            </label>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className="bg-red-500"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Deleting student..."
                                : "Delete student"}
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {messageStudentModal && (
                <AlertMessageStudent
                    open={messageStudentModal}
                    handleClose={handleSendMessageModalClose}
                    data={targetStudent}
                />
            )}
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
};

export default Students;
