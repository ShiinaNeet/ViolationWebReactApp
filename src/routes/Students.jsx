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
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  AlertTitle,
  Container,
  Input,
  Snackbar,
  TableHead,
  Toolbar,
  styled,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import StudentViolationList from "../components/StudentViolationList";
import AlertMessageStudent from "../components/AlertMessageStudent";
import formatDate from "../utils/moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { red } from "@mui/material/colors";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";

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
const Students = ({ DataToGet }) => {
  const { userType } = useAuth();
  const [CurrentUserType, setCurrentUserType] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingData, setIsFetchingData] = React.useState(false);
  const [fetchingDataError, setFetchingDataError] = React.useState("");
  const [ViewModal, setViewModal] = React.useState(false);
  const [targetStudent, setTargetStudent] = React.useState({
    _id: "",
    userid: 0,
    fullname: "",
    violations: [],
    year: "1st Year",
    department: "CICS",
    email: "",
    course: "BS Information Technology",
    term: "First Semester",
  });
  const [violationList, setViolationList] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [searchFilter, setSearchFilter] = React.useState({
    name: "",
    violation: "",
    department: "",
  });
  const yearList = ["1st year", "2nd year", "3rd year", "4th year", "5th year"];

  const schoolTermList = [
    "First Semester",
    "Second Semester",
    "Third Semester",
    "Fourth Semester",
    "Fifth Semester",
    "Summer Term",
  ];
  const coursesList = [
    "BS Information Technology",
    "BS Computer Science",
    "Doctor of Business Administration (DBA)",
    "Master of Public Administration (MPA) (Thesis/Non-Thesis program)",
    "Master of Business Administration (MBA) (Thesis/Non-Thesis program)",
    "BS Accountancy",
    "BS Accounting Management",
    "BS Applied Economics",
    "BS Business Administration Major in: Business Economics",
    "BS Business Administration Major in: Financial Management",
    "BS Business Administration Major in: Human Resource Development Management",
    "BS Business Administration Major in: Marketing Management",
    "BS Business Administration Major in: Operations Management",
    "Associate in Accounting",
    "Associate in Management",
    "BS Hotel and Restaurant Management",
    "BS Tourism Management",
    "Associate in Hotel and Restaurant Management",
    "Associate in Tourism Management",
    "BA Public Administration",
    "BS Customs Administration",
    "BS Entrepreneurship",
    "Doctor of Technology",
    "Master of Technology",
    "Bachelor of Industrial Technology (BIT 4 – years)",
    "BS Nursing",
    "BS Nutrition & Dietetics",
  ];
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

  const [searchFilterModal, setSearchFilterModal] = React.useState(false);
  const [updateStudentViolationModal, setUpdateStudentViolationModal] =
    React.useState(false);
  const [deleteStudentViolationModal, setDeleteStudentViolationModal] =
    React.useState(false);
  const [messageStudentModal, setMessageStudentModal] = React.useState(false);

  useEffect(() => {
    fetchViolationData();
    fetchData("/user/paginated");
    fetchDepartments();

    setCurrentUserType(localStorage.getItem("userType"));
    // if (DataToGet == "ADMIN") {
    //   fetchData("/user/paginated");
    // } else if (DataToGet == "PROGRAM HEAD") {
    //   fetchData("/department_head/paginated");
    //   console.log("Data to get: ", DataToGet);
    // } else if (DataToGet == "DEAN") {
    //   fetchData("/dean/paginated");
    //   console.log("Data to get: ", DataToGet);
    // }
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setViewModal(false);
    setSearchFilterModal(false);
    // setMessageStudentModal(false);
    setDeleteStudentViolationModal(false);
    setUpdateStudentViolationModal(false);
    setTargetStudent({
      fullname: "",
      violations: [],
      year: "",
      department: "",
      course: "",
      term: "",
      userid: 0,
      email: "",
    });
  };
  const handleSendMessageModalClose = () => {
    setMessageStudentModal(false);
  };
  const handleViewViolationModal = (person) => {
    setAnchorEl(null);
    // console.log(person);
    // setTargetStudent(person);
    fetchUser(person);
    setViewModal(true);
    setSearchFilterModal(false);
  };
  const handleUpdateViolationModal = (person) => {
    setAnchorEl(null);
    setUpdateStudentViolationModal(true);
    // setTargetStudent(person);
    console.log("Person: ", person);
    setTargetStudent((prev) => ({
      _id: person._id,
      email: person.email,
      course: person.course ? person.course : "BS Information Technology",
      term: person.term ? person.term : "First Semester",
      department: person.year_and_department.split(" - ")[1],
      year: person.year_and_department.split(" - ")[0],
      violations: person.violations,
      fullname: person.fullname,
      userid: person.userid,
    }));
  };

  const handleDeleteViolationModal = (person) => {
    setDeleteStudentViolationModal(true);
    setTargetStudent(person);
    setAnchorEl(null);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchFilter);
    console.log("Searching...");
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
        message: "There is no target student to be deleted! Please try again!",
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
  const fetchData = async (API_URI_TO_FETCH) => {
    setIsFetchingData(true);
    axios
      .get("user/paginated/student", {
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
          setPage(0);
          setIsFetchingData(false);
          setFetchingDataError("");
          setRows(response.data.data);
          if (response.data.data.length == 0) {
            setAlertMessage({
              open: true,
              title: "No Data",
              message: "No student data found.",
              variant: "info",
            });
          }
        } else {
          console.log("Failed to fetch data");
          // setIsFetchingData(false);
          // setFetchingDataError("Failed");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setIsFetchingData(false);
        setFetchingDataError("Failed");
        setAlertMessage({
          open: true,
          title: error.title,
          message: error.message,
          variant: "info",
        });
      });
    setIsFetchingData(false);
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
          setDepartments(response.data.data);
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
          variant: "info",
        });
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
        setTargetStudent({
          fullname: response.data.fullname,
          userid: response.data.userid,
          violations:
            response.data.violations.length > 0 ? response.data.violations : [],
          year_and_department: response.data.year_and_department,
          section: response.data.section,
          email: response.data.email,
          course: response.data.course,
          term: response.data.term,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setAlertMessage({
          open: true,
          title: error.title,
          message: error.message,
          variant: "info",
        });
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
    setTargetStudent({ ...targetStudent, violations: updatedViolations });
  };

  const handleAddViolation = () => {
    // if (selectedViolation && !targetStudent.violations.some(v => v.name === selectedViolation.name)) {
    if (
      selectedViolation._id.length > 0 &&
      !targetStudent.violations.some((v) => v.name === selectedViolation.name)
    ) {
      setSelectedViolation({
        ...selectedViolation,
        date: new Date().getTime(),
      });
      console.log("Selected Violations: ", selectedViolation);
      const updatedViolations = [
        ...targetStudent.violations,
        selectedViolation,
      ];
      setTargetStudent({ ...targetStudent, violations: updatedViolations });
      setSelectedViolation({ name: "", _id: "", date: "", description: "" });
      console.log("Updated Violations: ", targetStudent.violations);
    }
  };
  const transformedViolations = targetStudent.violations.map((violation) => ({
    ...violation,
    $oid: violation._id,
    _id: undefined, // Remove the _id field
  }));
  const handleUpdateViolation = () => {
    // console.log('Updating violation...');
    console.log("Current student violation: ", targetStudent);
    setIsLoading(true);

    if (
      targetStudent.violations.length === 0 ||
      targetStudent.department == "" ||
      targetStudent.year == "" ||
      targetStudent.course == "" ||
      targetStudent.term == "" ||
      targetStudent.term == null ||
      targetStudent.course == null
    ) {
      console.log("No violation to update");
      setAlertMessage({
        open: true,
        title: "Error occured!",
        message: "All fields are required!",
        variant: "info",
      });
      setIsLoading(false);
      return;
    }
    console.log("Student to update: ", targetStudent);
    axios
      .put(
        `/user/update/student/${targetStudent.userid}`,
        {
          year_and_department:
            targetStudent.year + " - " + targetStudent.department,
          course: targetStudent.course
            ? targetStudent.course
            : "BS Information Technology",
          term: targetStudent.term ? targetStudent.term : "First Semester",
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
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 10, sm: 15 },
          pb: { xs: 8, sm: 12 },
          minHeight: "100vh",
        }}
      >
        <div className="w-full mx-auto h-full">
          <div className="flex flex-row justify-between h-fit bg-white p-2 rounded-md shadow-md my-2">
            <h1 className="text-3xl py-3">Student Violations</h1>
            {/* <button
            className="bg-red-500 my-2 p-2 rounded-sm text-white hover:bg-red-600"
            onClick={() => setSearchFilterModal(true)}
          >
            Filter
          </button> */}
          </div>
          <StyledToolbar variant="dense" disableGutters>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow className="text-left px-4">
                    <th className="py-5 px-4 border-b">Name</th>
                    <th className="py-5 px-4 border-b">Violation</th>
                    <th className="py-5 px-4 border-b">Department and Year</th>
                    <th className="py-5 px-4 border-b text-center">Date</th>
                    <th className="py-5 px-4 border-b text-center sticky">
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
                    <tr key={index} className="hover:bg-gray-50">
                      {/* <td className="py-2 px-4 border-b">
                                            {student.userid}
                                        </td> */}
                      <td className="py-5 px-4 border-b">{student.fullname}</td>
                      <td className="py-5 px-4 border-b">
                        {student.violations.length > 0
                          ? student.violations[0].name
                          : ""}
                      </td>
                      <td className="py-5 px-4 border-b">
                        {student.year_and_department}
                      </td>
                      <td className="py-5 px-4 border-b flex-shrink-1 text-center">
                        {student.violations.length > 0
                          ? formatDate(
                              new Date(parseInt(student.violations[0].date)),
                              "MMMM DD, YYYY - hh:mm A"
                            )
                          : ""}
                      </td>
                      <td className="border-b flex justify-center sticky">
                        <Tooltip title="View Student">
                          <Button
                            className="rounded-sm text-white hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleViewViolationModal(student)}
                            color="error"
                          >
                            <RemoveRedEyeIcon color="error" />
                          </Button>
                        </Tooltip>
                        {CurrentUserType == "ADMIN" ||
                        localStorage.getItem("userType") == "ADMIN" ? (
                          <Tooltip title="Edit Student">
                            <Button
                              className="rounded-sm text-white hover:bg-red-100 hover:text-red-700"
                              onClick={() =>
                                handleUpdateViolationModal(student)
                              }
                              color="error"
                            >
                              <EditIcon color="error" />
                            </Button>
                          </Tooltip>
                        ) : (
                          ""
                        )}

                        {/* <Tooltip title="Delete Student">
                        <Button
                          className="rounded-sm text-white hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteViolationModal(student)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip> */}
                      </td>
                    </tr>
                  ))}
                  {isFetchingData && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6}>Loading...</TableCell>
                    </TableRow>
                  )}
                  {isFetchingData && rows.length == 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6}>No data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[{ label: "All", value: -1 }]}
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
          </StyledToolbar>
        </div>
      </Container>
      {ViewModal && (
        <Dialog
          open={ViewModal}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
        >
          <div className="px-2 flex-wrap">
            <div className="flex flex-col justify-center items-center md:flex-row sm:justify-between sm:items-center sm:w-full gap-x-5">
              <h2 className="py-3 sm:text-2xl sm:font-bold text-center font-semibold">
                Student Violation History
              </h2>
              <div className="gap-x-2">
                <Button
                  className="bg-red-500 p-2 rounded-sm text-red hover:bg-red-100"
                  onClick={() => setMessageStudentModal(true)}
                  color="error"
                >
                  <AddAlertIcon color="error" /> Alert
                </Button>
                <Button
                  className=" p-2 rounded-sm hover:bg-red-200 "
                  onClick={handleClose}
                  color="error"
                >
                  <CloseIcon /> Close
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <TextField
                id="standard-read-only-input"
                label="Full Name"
                value={targetStudent.fullname}
                variant="standard"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Email Address"
                value={
                  targetStudent.email && targetStudent.email.length > 0
                    ? targetStudent.email
                    : "No Email Address"
                }
                variant="standard"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Department"
                value={
                  targetStudent.year_and_department
                    ? targetStudent.year_and_department.includes(" - ")
                      ? targetStudent.year_and_department.split(" - ")[0]
                      : "Incorrect Format"
                    : "No Data"
                }
                variant="standard"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Course"
                value={targetStudent.course ? targetStudent.course : "No Data"}
                variant="standard"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Term"
                value={targetStudent.term ? targetStudent.term : "No Data"}
                variant="standard"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Year"
                value={
                  targetStudent.year_and_department
                    ? targetStudent.year_and_department.includes(" - ")
                      ? targetStudent.year_and_department.split(" - ")[1]
                      : "Incorrect Format"
                    : "No Data"
                }
                variant="standard"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </div>
            <div id="Violation list">
              <h2 className="py-3 text-base font-bold text-left">
                Violation Records
              </h2>
              <StudentViolationList student={targetStudent} />
            </div>
          </div>
        </Dialog>
      )}
      {searchFilterModal && (
        <Dialog
          open={searchFilterModal}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle>Search</DialogTitle>
          <DialogContent className=" flex ">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex flex-col gap-y-1">
                <TextField
                  id="standard-required"
                  label="Student Name"
                  value={searchFilter.name}
                  onChange={(e) =>
                    setSearchFilter({ ...searchFilter, name: e.target.value })
                  }
                  variant="standard"
                  fullWidth
                />
                <TextField
                  id="standard-required"
                  label="Violation"
                  value={searchFilter.violation}
                  onChange={(e) =>
                    setSearchFilter({
                      ...searchFilter,
                      violation: e.target.value,
                    })
                  }
                  variant="standard"
                  fullWidth
                />
                <TextField
                  id="standard-required"
                  label="Department"
                  value={searchFilter.department}
                  onChange={(e) =>
                    setSearchFilter({
                      ...searchFilter,
                      department: e.target.value,
                    })
                  }
                  variant="standard"
                  fullWidth
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              className="flex w-full sm:w-1/2 justify-center"
            >
              Search
            </Button>
            <Button
              className="flex w-full sm:w-1/2 justify-center"
              onClick={() => setSearchFilterModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
                {targetStudent.violations.map((violation, index) => (
                  <li
                    key={index}
                    className="my-2 rounded-sm flex justify-between text-black border-2 border-solid border-red-500 "
                  >
                    <label className="p-2">{violation.name} </label>
                    <Button
                      onClick={() => handleDeleteViolation(index)}
                      className="hover:border-1 hover:border-solid hover:border-red-500 hover:border- hover:text-white rounded-none"
                    >
                      <DeleteOutlineIcon color="error" />
                    </Button>
                  </li>
                ))}
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
                    <option key={index} value={violation.name}>
                      {violation.name}
                    </option>
                  ))}
                </select>
                <Button onClick={handleAddViolation} color="error">
                  <AddIcon color="error" /> Add
                </Button>
              </div>
              <div className="my-2">
                <label htmlFor="course">Course</label>
                <select
                  id="course"
                  name="course"
                  className="w-full border rounded  flex-1 my-2"
                  value={targetStudent.course}
                  onChange={(e) => {
                    setTargetStudent({
                      ...targetStudent,
                      course: e.target.value,
                    });
                    console.log("Course: ", e.target.value);
                  }}
                >
                  {coursesList.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-2">
                <label htmlFor="term">Term</label>
                <select
                  id="term"
                  name="term"
                  className="w-full border rounded  flex-1 my-2"
                  value={targetStudent.term}
                  onChange={(e) => {
                    setTargetStudent({
                      ...targetStudent,
                      term: e.target.value,
                    });
                    console.log("School Term: ", e.target.value);
                  }}
                >
                  {schoolTermList.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-2">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className="w-full border rounded  flex-1 my-2"
                  value={targetStudent.department}
                  onChange={(e) => {
                    setTargetStudent({
                      ...targetStudent,
                      department: e.target.value,
                    });
                    console.log("Department: ", e.target.value);
                  }}
                >
                  {departments.map((department) => (
                    <option key={department.name} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-2">
                <label htmlFor="year">School Year</label>
                <select
                  id="year"
                  name="year"
                  className="w-full border rounded  flex-1 my-2"
                  value={targetStudent.year}
                  onChange={(e) => {
                    setTargetStudent({
                      ...targetStudent,
                      year: e.target.value,
                    });
                    console.log("Year: ", e.target.value);
                  }}
                >
                  {yearList.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {/* <TextField
                margin="dense"
                className="my-5 py-5"
                label="Year"
                type="text"
                color="error"
                variant="standard"
                value={targetStudent.year}
                onChange={(e) =>
                  setTargetStudent({
                    ...targetStudent,
                    year: e.target.value,
                  })
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
              /> */}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="bg-red-500"
              onClick={handleUpdateViolation}
              disabled={isLoading}
              color="error"
            >
              {isLoading ? "Updating Student" : "Update Student"}
            </Button>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {deleteStudentViolationModal && (
        <Dialog open={deleteStudentViolationModal} onClose={handleClose}>
          <DialogTitle>
            Are you sure you want to delete this violation?
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-col gap-y-2">
              <p></p>
              <label>Name: {targetStudent.fullname}</label>
              <label readOnly>
                <strong className="font-bold">Department: </strong>{" "}
                {targetStudent.year_and_department &&
                targetStudent.year_and_department.includes(" - ")
                  ? targetStudent.year_and_department.split(" - ")[0]
                  : ""}
              </label>
              <label readOnly>
                <strong className="font-bold"> Year: </strong>{" "}
                {targetStudent.year_and_department &&
                targetStudent.year_and_department.includes(" - ")
                  ? targetStudent.year_and_department.split(" - ")[1]
                  : ""}
              </label>
              <br />
              <label>Violation(s): </label>
              <ul>
                {targetStudent.violations.map((violation, index) => (
                  <li
                    key={index}
                    className="border-2 border-solid border-red-500 my-2 rounded-sm flex justify-between text-black"
                  >
                    <label className="p-2">{violation.name} </label>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="bg-red-500"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting student..." : "Delete student"}
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
