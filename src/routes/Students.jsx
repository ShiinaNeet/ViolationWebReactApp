import React, { useEffect, useState } from "react";
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
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import "../animations.css";
import {
  Alert,
  AlertTitle,
  Chip,
  Container,
  DialogContentText,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Snackbar,
  TableHead,
  Toolbar,
  styled,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import StudentViolationList from "../components/StudentViolationList";
import AlertMessageStudent from "../components/AlertMessageStudent";
import formatDate from "../utils/moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { red } from "@mui/material/colors";
import axios from "axios";
import QRScanner from "../components/QRScanner";
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
  boxShadow: `0px 4px 6px ${alpha(red[500], 0.9)}`,
}));
const Students = () => {
  // const { userType } = useAuth();
  const [CurrentUserType, setCurrentUserType] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [ViewModal, setViewModal] = React.useState(false);
  const [CreateStudentViolationModal, setCreateStudentViolationModal] =
    React.useState(false);
  const [targetStudent, setTargetStudent] = React.useState({
    id: "",
    userid: 0,
    fullname: "",
    violations: [],
    year: "",
    department: "",
    email: "",
    course: "",
    term: "First Semester",
  });
  const [createStudent, setCreateStudent] = React.useState({
    srcode: "",
    userid: 0,
    email: "",
    fullname: "",
    course: "",
    term: "First Semester",
    year: "1st year",
    department: "",
    violations: [],
  });
  const [violationList, setViolationList] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [searchFilter, setSearchFilter] = React.useState({
    category: "",
    userid: "",
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
  const searchViolationCategory = ["academic_dishonesty", "major", "minor"];
  // const coursesList = [
  //   "BS Information Technology",
  //   "BS Computer Science",
  //   "Doctor of Business Administration (DBA)",
  //   "Master of Public Administration (MPA) (Thesis/Non-Thesis program)",
  //   "Master of Business Administration (MBA) (Thesis/Non-Thesis program)",
  //   "BS Accountancy",
  //   "BS Accounting Management",
  //   "BS Applied Economics",
  //   "BS Business Administration Major in: Business Economics",
  //   "BS Business Administration Major in: Financial Management",
  //   "BS Business Administration Major in: Human Resource Development Management",
  //   "BS Business Administration Major in: Marketing Management",
  //   "BS Business Administration Major in: Operations Management",
  //   "Associate in Accounting",
  //   "Associate in Management",
  //   "BS Hotel and Restaurant Management",
  //   "BS Tourism Management",
  //   "Associate in Hotel and Restaurant Management",
  //   "Associate in Tourism Management",
  //   "BA Public Administration",
  //   "BS Customs Administration",
  //   "BS Entrepreneurship",
  //   "Doctor of Technology",
  //   "Master of Technology",
  //   "Bachelor of Industrial Technology (BIT 4 – years)",
  //   "BS Nursing",
  //   "BS Nutrition & Dietetics",
  // ];
  const [programList, setProgramList] = React.useState([]);
  const [filteredPrograms, setFilteredPrograms] = React.useState([]);

  // const theme = useTheme();
  // const handleChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setPersonName(
  //     // On autofill we get a stringified value.
  //     typeof value === "string" ? value.split(",") : value
  //   );
  // };
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
  const [createProps, setCreateProps] = React.useState({
    isLoading: false,
    errorMessage: "",
    successMessage: "",
  });
  const [isQrScannerOpen, setIsQrScannerOpen] = React.useState(false);
  const [isDepartmentLoading, setIsDepartmentLoading] = React.useState(false);
  const [isProgramLoading, setIsProgramLoading] = React.useState(false);
  const [isViolationLoading, setIsViolationLoading] = React.useState(false);
  const [isUpdateModalLoading, setIsUpdateModalLoading] = React.useState(false);
  const [isviewModalLoading, setIsViewModalLoading] = React.useState(false);
  const [isFetchingDone, setIsFetchingDone] = React.useState(false);
  const [searchFilterModal, setSearchFilterModal] = React.useState(false);
  const [updateStudentViolationModal, setUpdateStudentViolationModal] =
    React.useState(false);
  const [deleteStudentViolationModal, setDeleteStudentViolationModal] =
    React.useState(false);
  const [messageStudentModal, setMessageStudentModal] = React.useState(false);

  useEffect(() => {
    fetchAllData();
    // fetchPrograms().then(() => {
    //   fetchDepartments();
    // });
    fetchPrograms();
    setCurrentUserType(localStorage.getItem("userType"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setViewModal(false);
    setSearchFilterModal(false);
    setCreateStudentViolationModal(false);
    setIsQrScannerOpen(false);
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
    setCreateStudent({
      srcode: "",
      userid: 0,
      email: "",
      fullname: "",
      course: "",
      term: "First Semester",
      year: "1st year",
      department: "",
      violations: [],
    });
  };
  const handleSendMessageModalClose = () => {
    setMessageStudentModal(false);
  };
  const handleViewViolationModal = (person) => {
    console.log("View Person", person);
    // setTargetStudent(person);
    setIsViewModalLoading(true);
    setViewModal(true);

    const completeCourseData = programList.find(
      (program) => program.id === person.course
    );

    // fetchUser(person);
    setTargetStudent({ ...person, course: completeCourseData });

    setSearchFilterModal(false);
  };
  const handleUpdateViolationModal = (person) => {
    setUpdateStudentViolationModal(true);

    console.log("Person to update: ", person);

    const selectedDepartment = departments.find(
      (department) =>
        department.name === person.year_and_department.split(" - ")[1]
    );

    if (selectedDepartment) {
      const programsToAddFilter = programList.filter(
        (program) => program.department_id === selectedDepartment._id
      );
      setFilteredPrograms(programsToAddFilter);
    }
    setTargetStudent({
      id: person.id,
      email: person.email,
      course: person.course ? person.course : filteredPrograms[0].name,
      term: person.term ? person.term : "First Semester",
      department: person.year_and_department.split(" - ")[1]
        ? person.year_and_department.split(" - ")[1]
        : departments[0].name,
      year: person.year_and_department.split(" - ")[0]
        ? person.year_and_department.split(" - ")[0]
        : "1st year",
      violations: person.violations,
      fullname: person.fullname,
      userid: person.userid,
    });
    setIsUpdateModalLoading(false);
    // setTimeout(() => {
    //   setIsUpdateModalLoading(false);
    // }, 300);
  };

  const handleSearch = () => {
    console.log(searchFilter);
    console.log("Searching...");
    if (searchFilter.userid == "" || searchFilter.userid == null) {
      setSearchFilter({ ...searchFilter, userid: "" });
    }
    fetchAllData();
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

  const fetchAllData = async () => {
    try {
      // Set loading states
      // setIsDepartmentLoading(true);
      setIsLoading(true);
      setIsViolationLoading(true);
      setIsFetchingDone(true);

      const violationResponse = await axios.get("/violation", {
        params: { skip: 0, limit: 100 },
      });
      if (violationResponse.data.status === "success") {
        const violationList = violationResponse.data.data;
        setViolationList(violationList);
        console.log("Violation List in FetchALlFunction: ", violationList);
      }

      const violationMap = new Map();
      violationList.forEach((violationGroup) => {
        violationGroup.violations.forEach((vio) => {
          violationMap.set(vio.code, vio.description);
        });
      });

      const studentResponse = await axios.get("/student", {
        params: {
          skip: 0,
          limit: 100,
          userid: searchFilter.userid || undefined,
          violation_category: searchFilter.category || undefined,
        },
      });
      if (studentResponse.data.status === "success") {
        console.log("Student fetched successfully", studentResponse.data.data);

        const completedDataWithViolationName = studentResponse.data.data.map(
          (student) => {
            const updatedViolations = student.violations.map((violation) => ({
              ...violation,
              description:
                violationMap.get(violation.code) || "Unknown Violation",
            }));

            console.log("Updated Violations:", updatedViolations);
            return { ...student, violations: updatedViolations };
          }
        );

        setRows(completedDataWithViolationName);
        if (studentResponse.data.data.length === 0) {
          setAlertMessage({
            open: true,
            title: "No Data",
            message: "No student data found.",
            variant: "info",
          });
        }
      } else {
        console.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertMessage({
        open: true,
        title: "Error",
        message: error.message,
        variant: "error",
      });
    } finally {
      // Reset loading states
      setIsLoading(false);
      setIsFetchingDone(false);
      setIsViolationLoading(false);
      console.log(rows);
    }
  };
  const fetchDepartments = async (FetchedProgramData) => {
    setIsDepartmentLoading(true);
    try {
      const response = await axios.get("/department", {
        params: { skip: 0, limit: 100 },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        console.log("Department fetched successfully");
        const fetchedDepartments = response.data.data;
        setDepartments(fetchedDepartments);

        // Default to the first department if none is selected
        if (!targetStudent.department) {
          const firstDepartment = fetchedDepartments[0];
          if (FetchedProgramData.length > 0) {
            const programs = FetchedProgramData.filter(
              (program) => program.department_id === firstDepartment._id
            );
            setFilteredPrograms(programs);
          }
          // setTargetStudent({
          //   ...targetStudent,
          //   department: firstDepartment.name,
          //   course: programs.length > 0 ? programs[0].name : "",
          // });
        }
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
    setIsDepartmentLoading(false);
  };
  const fetchPrograms = async () => {
    setIsProgramLoading(true);
    try {
      const response = await axios.get("/progams", {
        params: { skip: 0, limit: 100 },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        console.log("Program List fetched successfully");
        setProgramList(response.data.data);
        fetchDepartments(response.data.data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
    setIsProgramLoading(false);
  };
  const fetchUser = async (person) => {
    axios
      .get(`student`, {
        params: {
          userid: person.userid,
          limit: 100,
          skip: 0,
          id: undefined,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          const violationsArray = Array.isArray(
            response.data.data[0].violations
          )
            ? response.data.data[0].violations
            : [];

          const completedViolationList = violationsArray
            .map((violation) =>
              violationList.find((vio) => vio.id === String(violation))
            )
            .filter((violation) => violation !== undefined);
          const completeCourseData = programList.find(
            (program) => program.id === response.data.data[0].course
          );
          setTargetStudent({
            ...targetStudent,
            fullname: response.data.data[0].fullname,
            userid: response.data.data[0].userid,
            violations: completedViolationList,
            year_and_department: response.data.data[0].year_and_department,
            section: response.data.data[0].section,
            email: response.data.data[0].email,
            course: completeCourseData,
            term: response.data.data[0].term,
          });

          console.log("Fetched User: ", response.data);
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
      })
      .finally(() => {
        setIsViewModalLoading(false);
      });
  };
  const fetchIfExisitingUser = async (userid, decodedPotentialUser) => {
    axios
      .get(`student`, {
        params: {
          userid: userid,
          limit: 100,
          skip: 0,
          id: undefined,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          if (response.data.data.length != 0) {
            setCreateStudent({
              ...createStudent,
              userid: decodedPotentialUser.userid,
              srcode: decodedPotentialUser.srcode,
              fullname: decodedPotentialUser.fullname,
            });
            console.log("User Fetched To Update Modal: ", response.data.data);
            setCreateStudentViolationModal(false);
            handleUpdateViolationModal(response.data.data[0]);
            // setAlertMessage({
            //   open: true,
            //   title: "Information",
            //   message:
            //     "User already exists! Please go find the user in the list!",
            //   variant: "info",
            // });
            // Open Modal here
            return;
          }
          if (response.data.data.length == 0) {
            setCreateStudent({
              ...createStudent,
              userid: decodedPotentialUser.userid,
              srcode: decodedPotentialUser.srcode,
              fullname: decodedPotentialUser.fullname,
            });
            return;
          }
          const violationsArray = Array.isArray(
            response.data.data[0].violations
          )
            ? response.data.data[0].violations
            : [];

          const completedViolationList = violationsArray
            .map((violation) =>
              violationList.find((vio) => vio.code === String(violation))
            )
            .filter((violation) => violation !== undefined);
          const completeCourseData = programList.find(
            (program) => program.id === response.data.data[0].course
          );
          console.log("Fetched User CompleteCourseData: ", completeCourseData);
          const selectedDepartment = departments.find(
            (department) =>
              department.name ===
              response.data.data[0].year_and_department.split(" - ")[1]
          );

          if (selectedDepartment) {
            const programsToAddFilter = programList.filter(
              (program) => program.department_id === selectedDepartment._id
            );
            setFilteredPrograms(programsToAddFilter);
          }
          setCreateStudent({
            ...createStudent,
            fullname: response.data.data[0].fullname,
            userid: response.data.data[0].userid,
            violations: completedViolationList,
            // year_and_department: response.data.data[0].year_and_department,
            year: response.data.data[0].year_and_department.split(" - ")[0],
            department:
              response.data.data[0].year_and_department.split(" - ")[1],
            srcode: response.data.data[0].srcode,
            email: response.data.data[0].email,
            course: completeCourseData,
            term: response.data.data[0].term,
          });

          console.log("Fetched User: ", response.data);
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
      })
      .finally(() => {
        setIsQrScannerOpen(false);
      });
  };
  const [qrData, setQrData] = React.useState({
    fullname: "",
    srcode: "",
    userid: "",
  });
  const fetchDecodedQRCode = async (data) => {
    axios
      .get(`/decode_qr`, {
        params: {
          token: data,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (
          response.data.data.userid &&
          response.data.data.srcode &&
          response.data.data.userid.length > 0 &&
          response.data.data.srcode.length > 0
        ) {
          setQrData({
            srcode: response.data.data.srcode,
            userid: response.data.data.userid,
            fullname: response.data.data.fullname,
          });
          fetchIfExisitingUser(response.data.data.userid, response.data.data);
        } else {
          console.log("Unable to decode QR Code");
          setAlertMessage({
            open: true,
            title: "Error occured!",
            message: "Unable to decode QR Code! Please try again later!",
            variant: "info",
          });
        }
      })
      .catch((error) => {
        console.warn("Error Occurred fetching QR Code: ", error);
      });
  };

  const [selectedViolation, setSelectedViolation] = React.useState({
    code: "",
    description: "",
  });

  const handleDeleteViolation = (index, type) => {
    if (type === "update") {
      const updatedViolations = [...targetStudent.violations];
      updatedViolations.splice(index, 1);
      setTargetStudent({ ...targetStudent, violations: updatedViolations });
    } else if (type === "create") {
      const updatedViolations = [...createStudent.violations];
      updatedViolations.splice(index, 1);
      setCreateStudent({ ...createStudent, violations: updatedViolations });
    }
  };
  const handleAddViolation = (type) => {
    if (selectedViolation.code.length === 0) {
      console.warn("No violation selected");
      return;
    }
    if (type === "create") {
      if (
        !createStudent.violations.some((v) => v.code === selectedViolation.code)
      ) {
        console.log("Selected Violations: ", selectedViolation);
        setCreateStudent({
          ...createStudent,
          violations: [...createStudent.violations, selectedViolation],
        });
        setSelectedViolation({ code: "", description: "" });
      }
    } else if (type === "update") {
      if (
        !targetStudent.violations.some((v) => v.code === selectedViolation.code)
      ) {
        console.log("Selected Violations: ", selectedViolation);
        setTargetStudent({
          ...targetStudent,
          violations: [...targetStudent.violations, selectedViolation],
        });
        setSelectedViolation({ code: "", description: "" });
      }
    }
  };
  // const transformedViolations = targetStudent.violations.map((violation) => ({
  //   ...violation,
  //   $oid: violation.id,
  //   id: undefined, // Remove the _id field
  //   name: undefined,
  // }));
  const transformViolationToArray = () => {
    return targetStudent.violations.map((violation) => {
      return {
        code: violation.code,
        description: violation.description,
        date_committed: violation.date_committed
          ? violation.date_committed
          : new Date().toISOString(),
      };
    });
  };
  const handleUpdateViolation = () => {
    // console.log('Updating violation...');

    console.log("Current student info: ", targetStudent);

    setIsLoading(true);

    if (
      targetStudent.violations.length === 0 ||
      targetStudent.year == "" ||
      targetStudent.term == "" ||
      targetStudent.term == null
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
    const PayloadYear = targetStudent.year ? targetStudent.year : "1st Year";
    const PayloadDepartment = targetStudent.department
      ? targetStudent.department
      : departments[0].name;
    const PayloadCourse = targetStudent.course
      ? targetStudent.course
      : programList[0].name;

    var courseToAdd = programList.find(
      (program) => program.name === PayloadCourse
    );
    if (!courseToAdd) {
      console.warn("No course found");
      courseToAdd = programList[0];
    }
    console.log("Course Name: ", courseToAdd);
    // console.log("Transformed Violation: ", transformViolationToArray());
    // return;
    axios
      .put(
        `/student`,
        {
          id: targetStudent.id,
          course: courseToAdd.id,
          term: targetStudent.term ? targetStudent.term : "First Semester",
          year_and_department: PayloadYear + " - " + PayloadDepartment,
          violations: transformViolationToArray(),
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
            message: "Student Violation was updated successfully!",
            variant: "info",
          });
          setIsLoading(false);
          setUpdateStudentViolationModal(false);
        } else {
          console.log("Failed to Update");
          // setAlertMessage({
          //   open: true,
          //   title: "Failed",
          //   message: response.data.description,
          //   variant: "info",
          // });
          setIsLoading(false);
          setUpdateStudentViolationModal(false);
        }
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setErrorMessages([]);
        // setAlertMessage({
        //   open: true,
        //   title: "Error Occurred!",
        //   message: "Please try again later.",
        //   variant: "error",
        // });
        setUpdateStudentViolationModal(false);
        setIsLoading(false);
      });
  };
  const handeSaveStudent = () => {
    console.log("Creating student...");
    console.log("Current student info: ", createStudent);
    console.log("Current student violation: ", createStudent.violations);
    setIsLoading(true);

    if (
      createStudent.userid == "" ||
      createStudent.violations.length == 0 ||
      createStudent.department == "" ||
      createStudent.department == undefined ||
      createStudent.year == undefined ||
      createStudent.year == "" ||
      createStudent.course == "" ||
      createStudent.course == undefined ||
      createStudent.term == "" ||
      createStudent.term == undefined ||
      createStudent.email == "" ||
      createStudent.email == undefined ||
      createStudent.fullname == "" ||
      createStudent.fullname == undefined
    ) {
      console.log("Invalid student information. Please fill all fields");
      setAlertMessage({
        open: true,
        title: "Error occured!",
        message: "All fields are required!",
        variant: "info",
      });
      setIsLoading(false);
      return;
    }
    console.log("Student to create: ", createStudent);
    const PayloadYear = createStudent.year ? createStudent.year : "1st Year";
    const PayloadDepartment = createStudent.department
      ? createStudent.department
      : departments[0].name;
    const PayloadCourse = createStudent.course
      ? createStudent.course
      : programList[0].name;
    //Need to transform course name into id
    const courseToSave = programList.find(
      (program) => program.name === PayloadCourse
    )?.id;
    const violationsToSave = createStudent.violations.map((violation) => {
      return {
        code: violation.code,
        // description: violation.description,
        date_committed: new Date().toISOString(),
      };
    });
    axios
      .post(
        `/student`,
        {
          srcode: String(createStudent.userid),
          userid: String(createStudent.userid),
          email: createStudent.email,
          fullname: createStudent.fullname,
          course: courseToSave,
          term: targetStudent.term ? targetStudent.term : "First Semester",
          year_and_department: PayloadYear + " - " + PayloadDepartment,
          violations: violationsToSave,
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
            message: "Student Violation was created successfully!",
            variant: "info",
          });
          setCreateStudentViolationModal(false);
        } else {
          console.log("Failed to create student violation");
          setAlertMessage({
            open: true,
            title: "Failed",
            message: response.data.description,
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleDepartmentChange = (e) => {
    const selectedDepartmentName = e.target.value;
    const selectedDepartment = departments.find(
      (department) => department.name === selectedDepartmentName
    );
    console.log("Selected Department: ", selectedDepartment);
    if (selectedDepartment) {
      const programs = programList.filter(
        (program) => program.department_id === selectedDepartment._id
      );
      setTargetStudent({
        ...targetStudent,
        department: selectedDepartment.name,
        course: programs.length > 0 ? programs[0].name : "",
      });
      setFilteredPrograms(programs);
    }
  };
  const handleDepartmentChangeInCreateStudent = (e) => {
    const selectedDepartmentName = e.target.value;
    const selectedDepartment = departments.find(
      (department) => department.name === selectedDepartmentName
    );
    console.log("Selected Department: ", selectedDepartment);
    if (selectedDepartment) {
      const programs = programList.filter(
        (program) => program.department_id === selectedDepartment._id
      );
      setCreateStudent({
        ...createStudent,
        department: selectedDepartment.name,
        course: programs.length > 0 ? programs[0].name : "",
      });
      setFilteredPrograms(programs);
    }
  };
  const handleOpenQRScanner = () => {
    setIsQrScannerOpen(true);
  };
  const handleDatafromQRScanner = (data) => {
    console.log("Data from QR Scanner: ", data);
    fetchDecodedQRCode(data);

    // setCreateStudent({ ...createStudent, srcode: data });
  };
  const closeQrScanner = () => {
    setIsQrScannerOpen(false);
    // navigator.mediaDevices
    //   .getUserMedia({ video: true })
    //   .then((stream) => {
    //     stream.getTracks().forEach((track) => track.stop());
    //     console.log("Camera forcefully closed.");
    //   })
    //   .catch((error) => console.error("Error accessing media devices:", error));
  };
  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  React.useEffect(() => {
    const listItems = document.querySelectorAll(".slide-in-down-visible");
    listItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("slide-in-visible");
      }, index * 69);
    });
  }, [rows]);
  const listRef = React.useRef(null);
  useEffect(() => {
    // Wait a short time to ensure the list has rendered
    setTimeout(() => {
      if (listRef.current) {
        const listItems = listRef.current.querySelectorAll(".update-modal");

        listItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("slide-in-visible");
          }, index * 100); // Slightly increased delay for better visibility
        });
      }
    }, 1); // Short delay to ensure DOM updates before effect runs
  }, [targetStudent.violations]);
  // const [selectedCode, setSelectedCode] = React.useState("");
  // const [expandedCategory, setExpandedCategory] = React.useState(null);

  // const handleCategoryClick = (category) => {
  //   console.log(`Toggling category: ${category}`); // Debugging log
  //   setExpandedCategory((prevCategory) =>
  //     prevCategory === category ? null : category
  //   );
  // };
  const [selectedCode, setSelectedCode] = useState("");
  const [isSelectViolationComponentOpen, setIsSelectViolationComponentOpen] =
    useState(false);
  const handleCategoryClick = (event) => {
    setSelectedCode(event.target.value);
  };
  const handleCloseMenu = () => {
    setIsSelectViolationComponentOpen(false);
  };
  const [scroll, setScroll] = React.useState("paper");
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
          <div className="flex flex-row justify-between h-fit rounded-md my-2">
            <h1 className="text-3xl py-3">Student Violations</h1>
            <div className="flex items-center">
              {/* <Button
                className="bg-red-500 p-2 rounded-sm text-red hover:bg-red-100"
                onClick={() => setMessageStudentModal(true)}
                color="error"
              >
                <AddAlertIcon color="error" /> Alert
              </Button> */}
              <Button
                className="bg-red-500 p-2 rounded-sm text-red "
                onClick={() => setCreateStudentViolationModal(true)}
                color="error"
              >
                Add Violation
              </Button>
              <Button
                className=" my-2 p-2 rounded-sm text-red"
                onClick={() => setSearchFilterModal(true)}
                color="error"
              >
                <FilterAltRoundedIcon color="error" /> Filter
              </Button>
            </div>
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
                    <th className="py-5 px-4 border-b text-center ">Actions</th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isFetchingDone || isLoading || isViolationLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} align="center">
                        No student...
                      </TableCell>
                    </TableRow>
                  ) : (
                    (rowsPerPage > 0
                      ? rows.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : rows
                    ).map((student, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 slide-in-down-visible"
                      >
                        <td className="py-5 px-4 border-b">
                          {student.fullname}
                        </td>
                        <td className="py-5 px-4 border-b">
                          {student.violations.slice(0, 2).map((violation) => {
                            return (
                              <Chip
                                key={violation.code}
                                label={violation.code}
                                variant="outlined"
                                color="primary"
                                margin="dense"
                                size="medium"
                                sx={{ mr: 0.5, mb: 0.5, p: 0.5 }}
                              />
                            );
                          })}
                        </td>
                        <td className="py-5 px-4 border-b">
                          {student.year_and_department
                            ? `${student.year_and_department.split(" - ")[1]} -
                              ${student.year_and_department.split(" - ")[0]}`
                            : "No Data"}
                        </td>
                        <td className="py-5 px-4 border-b">
                          {student.violations
                            ? formatDate(
                                student.violations[0].date_committed,
                                "MMMM DD, YYYY - hh:mm A"
                              )
                            : "No Data"}
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
                        </td>
                      </tr>
                    ))
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
          // Optionally, you can still adjust the overall Dialog container
          sx={{
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "90vh",
            height: { xs: "100vh", sm: "90vh" },
            maxWidth: "100vw",
            minWidth: "100vw",
          }}
        >
          <DialogContent
            sx={{
              padding: 2,
              width: "100%",
              // maxHeight: "90vh",
              // height: { xs: "100vh", sm: "90vh" },
              marginX: { md: "10px", lg: "auto" },
            }}
          >
            <div className=" flex flex-col justify-center items-center md:flex-row sm:justify-between sm:items-center sm:w-full gap-x-5">
              <h2 className="py-1 sm:text-2xl sm:font-bold text-center font-semibold slide-in-visible ">
                Student Violation History
              </h2>
              <div className="gap-x-2">
                <Button
                  className=" p-2 rounded-sm hover:bg-red-200 slide-in-from-right"
                  onClick={handleClose}
                  color="error"
                >
                  <CloseIcon /> Close
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-y-2 slide-in-down-visible overflow-hidden">
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
                className="slide-in-down-visible"
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
              {console.log("Course: ", targetStudent.course)}
              <TextField
                id="standard-read-only-input"
                label="Course"
                value={
                  targetStudent.course ? targetStudent.course.name : "No Data"
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
            </div>
            <div
              id="Violation list"
              className="px-2"
              style={{ overflowX: "hidden" }}
            >
              <h2 className="py-3 text-base font-bold text-left slide-in-visible">
                Violation Records
              </h2>
              <StudentViolationList student={targetStudent} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {searchFilterModal && (
        <Dialog
          open={searchFilterModal}
          onClose={handleClose}
          fullWidth={true}
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
          <DialogTitle sx={{ overflowX: "hidden", overflowY: "hidden" }}>
            <label className="slide-in-down-visible">
              Filter Student Violations
            </label>
          </DialogTitle>
          <DialogContent sx={{ overflowX: "hidden", overflowY: "hidden" }}>
            <FormControl fullWidth margin="dense">
              <label className="slide-in-visible mb-1">
                Violation Category
              </label>
              <Select
                className="slide-in-from-right font-medium"
                fullWidth
                color="error"
                value={searchFilter.category}
                onChange={(e) =>
                  setSearchFilter({
                    ...searchFilter,
                    category: e.target.value,
                  })
                }
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value=""> All </MenuItem>
                {searchViolationCategory.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <label className="slide-in-visible mb-1 font-medium">
                User ID
              </label>
              <TextField
                className="slide-in-from-right"
                fullWidth
                color="error"
                value={searchFilter.userid}
                onChange={(e) =>
                  setSearchFilter({
                    ...searchFilter,
                    userid: e.target.value,
                  })
                }
                inputProps={{ "aria-label": "Without label" }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ overflowX: "hidden", overflowY: "hidden" }}>
            <Button
              onClick={handleSearch}
              className="flex w-full sm:w-1/2 justify-center slide-in-visible"
            >
              Search
            </Button>
            <Button
              className="flex w-full sm:w-1/2 justify-center slide-in-from-right"
              onClick={() => setSearchFilterModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {CreateStudentViolationModal && (
        <Dialog
          open={CreateStudentViolationModal}
          // onClose={handleClose}
          fullWidth={true}
          maxWidth="false"
          // fullScreen

          // scroll={scroll}
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
          <DialogTitle sx={{ overflowX: "hidden", overflowY: "hidden" }}>
            <div className="flex justify-start ">
              <h1 className="slide-in-down-visible ">
                Create new Student Violation
              </h1>
            </div>
            <div className="sm:absolute sm:top-5 sm:right-3 w-fit overflow-x-hidden flex">
              <Button
                onClick={handleOpenQRScanner}
                color="error"
                className="slide-in-from-right"
              >
                <QrCode2Icon color="error" fontSize="large" />
                QR Scanner
              </Button>
            </div>
          </DialogTitle>
          <DialogContent
            sx={{
              overflowY: "scroll", // Enable scrolling for long content
              // Enable vertical scrolling when needed
              marginBottom: "20px",
              minWidth: "70vw",
              maxWidth: "90vw",
            }}
          >
            {isQrScannerOpen ? (
              <QRScanner
                fetchQrData={handleDatafromQRScanner}
                onClose={closeQrScanner}
              />
            ) : (
              <>
                <div>
                  <h3 className="slide-in-visible">Current Violations</h3>
                  <ul>
                    {createStudent.violations.map((violation, index) => (
                      <li
                        key={index}
                        className="my-2 rounded-sm flex justify-between text-black border-2 border-solid border-red-500"
                      >
                        <label className="p-2">
                          {truncateText(violation.code, 50)}
                        </label>
                        <Button
                          onClick={() => handleDeleteViolation(index, "create")}
                          className="hover:border-1 hover:border-solid hover:border-red-500 hover:border- hover:text-white rounded-none"
                        >
                          <DeleteOutlineIcon color="error" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 ">
                  <h3 className="mb-3 slide-in-down-visible">Add Violation</h3>
                  <div className="flex ">
                    {/* <select
                      className="w-full rounded border slide-in-visible"
                      value={selectedViolation.code}
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        const foundViolation = violationList
                          .flatMap((violation) => violation.violations)
                          .find((v) => v.code === selectedCode);
                        if (foundViolation) {
                          setSelectedViolation({
                            code: foundViolation.code,
                            description: foundViolation.description,
                          });
                        }
                      }}
                    >
                      <option value="">Pick atleast 1 option...</option>
                      {violationList.flatMap((violation) =>
                        violation.violations.map((v, index) => (
                          <option
                            key={`${violation.id}-${index}`}
                            value={v.code}
                          >
                            {v.code}
                          </option>
                        ))
                      )}
                    </select> */}
                    <Select
                      className="slide-in-visible w-3/4"
                      size="small"
                      value={selectedViolation.code}
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        const foundViolation = violationList
                          .flatMap((category) => category.violations)
                          .find((v) => v.code === selectedCode);

                        if (foundViolation) {
                          console.log("Found violation", foundViolation);
                          setSelectedViolation({
                            code: foundViolation.code,
                            description: foundViolation.description,
                          });
                        }
                      }}
                      open={isSelectViolationComponentOpen}
                      onOpen={() => setIsSelectViolationComponentOpen(true)}
                      onClose={() => setIsSelectViolationComponentOpen(false)}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: "80vh",
                          },
                        },
                      }}
                    >
                      <div
                        style={{
                          position: "sticky",
                          top: 5,
                          zIndex: 1001, // Ensure the button is above other content
                          width: "100%", // Ensure div spans the entire width
                          paddingRight: "10px", // Some padding to avoid the button sticking too close to the edge
                        }}
                      >
                        <MenuItem
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            padding: 0,
                          }}
                        >
                          <Button
                            // fullWidth
                            variant="text"
                            className="bg-red-100 flex self-end "
                            onClick={handleCloseMenu}
                            color="error"
                          >
                            <CloseIcon />
                            <label htmlFor="">close</label>
                          </Button>
                        </MenuItem>
                      </div>

                      {violationList.flatMap((group, groupIdx) => [
                        <ListSubheader
                          key={`category-${groupIdx}`}
                          sx={{ color: "red", fontWeight: "bold" }}
                        >
                          {group.category.toUpperCase()}
                        </ListSubheader>,
                        ...group.violations.map((violation, violationIdx) => (
                          <MenuItem
                            key={`violation-${groupIdx}-${violationIdx}`}
                            value={violation.code}
                            sx={{
                              textTransform: "capitalize",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              mb: 1,
                            }}
                          >
                            {group.set ? (
                              <Button>{group.set.toUpperCase()}</Button>
                            ) : (
                              <Button></Button>
                            )}
                            {violation.code} - {violation.description}
                          </MenuItem>
                        )),
                      ])}
                    </Select>
                    <Button
                      onClick={() => handleAddViolation("create")}
                      color="error"
                      className="w-1/4 slide-in-from-right"
                    >
                      <AddIcon color="error" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-col mt-2">
                    {/* <TextField
                      className="slide-in-visible"
                      margin="dense"
                      variant="outlined"
                      id="outlined-basic"
                      label="Student Id"
                      color="error"
                      fullWidth
                      required={true}
                      value={createStudent.userid}
                      onChange={(e) =>
                        setCreateStudent({
                          ...createStudent,
                          userid: e.target.value,
                        })
                      }
                    /> */}
                    <TextField
                      className="slide-in-visible"
                      margin="dense"
                      id="outlined-basic"
                      label="Student Number"
                      variant="outlined"
                      color="error"
                      fullWidth
                      required={true}
                      value={createStudent.userid}
                      onChange={(e) =>
                        setCreateStudent({
                          ...createStudent,
                          userid: e.target.value,
                        })
                      }
                    />
                    <TextField
                      className="slide-in-visible"
                      margin="dense"
                      id="outlined-basic"
                      label="Full Name"
                      variant="outlined"
                      color="error"
                      fullWidth
                      required={true}
                      value={createStudent.fullname}
                      onChange={(e) =>
                        setCreateStudent({
                          ...createStudent,
                          fullname: e.target.value,
                        })
                      }
                    />
                    <TextField
                      className="slide-in-visible"
                      margin="dense"
                      id="outlined-basic"
                      label="Email Address (School Email Preferred)"
                      variant="outlined"
                      color="error"
                      fullWidth
                      required={true}
                      value={createStudent.email}
                      onChange={(e) =>
                        setCreateStudent({
                          ...createStudent,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="my-2 slide-in-visible">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">
                        Term
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Term"
                        margin="dense"
                        fullWidth
                        value={createStudent.term}
                        onChange={(e) => {
                          setCreateStudent({
                            ...createStudent,
                            term: e.target.value,
                          });
                          console.log("School Term: ", e.target.value);
                        }}
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        {schoolTermList.map((term) => (
                          <MenuItem key={term} value={term}>
                            {term}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="my-2 slide-in-visible">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">
                        Department
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Department"
                        margin="dense"
                        fullWidth
                        value={createStudent.department}
                        onChange={handleDepartmentChangeInCreateStudent}
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        {departments.map((department) => (
                          <MenuItem
                            key={department.name}
                            value={department.name}
                          >
                            {department.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="my-2 slide-in-visible">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">
                        Course
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Course"
                        margin="dense"
                        fullWidth
                        value={createStudent.course}
                        onChange={(e) => {
                          setCreateStudent({
                            ...createStudent,
                            course: e.target.value,
                          });
                          console.log("Course: ", e.target.value);
                        }}
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        {filteredPrograms.map((program) => (
                          <MenuItem key={program.name} value={program.name}>
                            {program.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="my-2 ">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">
                        School Year
                      </InputLabel>
                      <Select
                        className="slide-in-visible"
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="School Year"
                        margin="dense"
                        fullWidth
                        value={createStudent.year}
                        onChange={(e) => {
                          setCreateStudent({
                            ...createStudent,
                            year: e.target.value,
                          });
                          console.log("Year: ", e.target.value);
                        }}
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        {yearList.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              position: "absolute", // Make actions always visible at the bottom
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "white", // Ensure the buttons are clearly visible
              zIndex: 10,
              borderTop: "1px solid #ccc", // Optional visual separation
            }}
            dividers={scroll === "paper"}
          >
            {isQrScannerOpen ? (
              <Button
                className="text-center slide-in-from-bottom"
                onClick={closeQrScanner}
                color="error"
              >
                Close Scanner
              </Button>
            ) : (
              <>
                <Button
                  className="bg-red-500 slide-in-from-bottom"
                  onClick={handeSaveStudent}
                  disabled={isLoading}
                  color="error"
                >
                  {isLoading ? "Saving Student Violation" : "Save violation"}
                </Button>
                <Button
                  onClick={handleClose}
                  color="error"
                  className="slide-in-from-bottom"
                >
                  Cancel
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
        //         <Dialog
        //           open={open}
        //           onClose={handleClose}
        //           scroll={scroll}
        //           aria-labelledby="scroll-dialog-title"
        //           aria-describedby="scroll-dialog-description"
        //         >
        //           <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        //           <DialogContent dividers={scroll === "paper"}>
        //             <DialogContentText
        //               id="scroll-dialog-description"
        //               // ref={descriptionElementRef}
        //               tabIndex={-1}
        //             >
        //               {[...new Array(50)]
        //                 .map(
        //                   () => `Cras mattis consectetur purus sit amet fermentum.
        // Cras justo odio, dapibus ac facilisis in, egestas eget quam.
        // Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        // Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
        //                 )
        //                 .join("\n")}
        //             </DialogContentText>
        //           </DialogContent>
        //           <DialogActions>
        //             <Button onClick={handleClose}>Cancel</Button>
        //             <Button onClick={handleClose}>Subscribe</Button>
        //           </DialogActions>
        //         </Dialog>
      )}
      {updateStudentViolationModal && (
        <Dialog
          open={updateStudentViolationModal}
          onClose={handleClose}
          fullWidth
          maxWidth="false"
          sx={{
            // maxWidth: "100vw",
            maxHeight: "90vh",
            // width: "100vw",
            height: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginX: { md: "10px", lg: "auto" },
          }}
        >
          <DialogTitle sx={{ overflowX: "hidden", overflowY: "hidden" }}>
            <h1 className="slide-in-down-visible">Edit Violation</h1>
          </DialogTitle>
          <DialogContent
            sx={{
              overflowY: "scroll",
              marginBottom: "60px",
              minWidth: "70vw",
              maxWidth: "95vw",
            }}
          >
            {/* {isDepartmentLoading || isProgramLoading || isViolationLoading ? ( */}
            {isUpdateModalLoading ? (
              <>Loading...</>
            ) : (
              <>
                <div>
                  <h3 className="slide-in-visible">Current Violations</h3>
                  <ul ref={listRef} key={targetStudent.id}>
                    {targetStudent.violations.map((violation, index) => (
                      <li
                        key={targetStudent.id + index}
                        className="update-modal my-2 rounded-sm flex justify-between text-black border-2 border-solid border-red-500 "
                      >
                        <label className="p-2">
                          {truncateText(violation.code, 50)}
                        </label>
                        <Button
                          onClick={() => handleDeleteViolation(index, "update")}
                          className="hover:border-1 hover:border-solid hover:border-red-500 hover:border- hover:text-white rounded-none"
                        >
                          <DeleteOutlineIcon color="error" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="my-5 w-full slide-in-visible">
                  <h3 className="mb-3">Add Violation</h3>
                  <div className="flex ">
                    {/* <select
                      className="w-full border rounded  flex-1 slide-in-down-visible"
                      value={selectedViolation.code}
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        const foundViolation = violationList
                          .flatMap((violation) => violation.violations)
                          .find((v) => v.code === selectedCode);
                        console.log(
                          "Selected Violation in select: ",
                          foundViolation
                        );
                        if (foundViolation) {
                          setSelectedViolation({
                            code: foundViolation.code,
                            description: foundViolation.description,
                          });
                        }
                      }}
                    >
                      <option value="">Select Violation</option>
                      {violationList.flatMap((violation) =>
                        violation.violations.map((v, index) => (
                          <option
                            key={`${violation.id}-${index}`}
                            value={v.code}
                          >
                            {v.code}
                          </option>
                        ))
                      )}
                    </select> */}
                    <Select
                      className="slide-in-visible w-3/4"
                      size="small"
                      value={selectedViolation.code}
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        const foundViolation = violationList
                          .flatMap((category) => category.violations)
                          .find((v) => v.code === selectedCode);

                        if (foundViolation) {
                          console.log("Found violation", foundViolation);
                          setSelectedViolation({
                            code: foundViolation.code,
                            description: foundViolation.description,
                          });
                        }
                      }}
                      open={isSelectViolationComponentOpen}
                      onOpen={() => setIsSelectViolationComponentOpen(true)}
                      onClose={() => setIsSelectViolationComponentOpen(false)}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: "95vh", // You can adjust this height for scrollable behavior
                          },
                        },
                      }}
                    >
                      <div
                        style={{
                          position: "sticky",
                          top: 5,
                          zIndex: 1001, // Ensure the button is above other content
                          width: "100%", // Ensure div spans the entire width
                          paddingRight: "10px", // Some padding to avoid the button sticking too close to the edge
                        }}
                      >
                        <MenuItem
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            padding: 0,
                          }}
                        >
                          <Button
                            // fullWidth
                            variant="text"
                            className="bg-red-100 flex self-end "
                            onClick={handleCloseMenu}
                            color="error"
                          >
                            <CloseIcon />
                            <label htmlFor="">close</label>
                          </Button>
                        </MenuItem>
                      </div>

                      {violationList.flatMap((group, groupIdx) => [
                        <ListSubheader
                          key={`category-${groupIdx}`}
                          sx={{ color: "red", fontWeight: "bold" }}
                        >
                          {group.category.toUpperCase()}
                        </ListSubheader>,
                        ...group.violations.map((violation, violationIdx) => (
                          <MenuItem
                            key={`violation-${groupIdx}-${violationIdx}`}
                            value={violation.code}
                            sx={{
                              textTransform: "capitalize",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              mb: 1,
                            }}
                          >
                            {group.set ? (
                              <Button>{group.set.toUpperCase()}</Button>
                            ) : (
                              <Button></Button>
                            )}
                            {violation.code} - {violation.description}
                          </MenuItem>
                        )),
                      ])}
                    </Select>
                    <Button
                      onClick={() => handleAddViolation("update")}
                      color="error"
                      className="slide-in-from-right w-1/4"
                    >
                      <AddIcon color="error" /> Add
                    </Button>
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
                      onChange={handleDepartmentChange}
                    >
                      {departments.map((department) => (
                        <option key={department.name} value={department.name}>
                          {department.name}
                        </option>
                      ))}
                    </select>
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
                      {filteredPrograms.map((program) => (
                        <option key={program.name} value={program.name}>
                          {program.name}
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
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              position: "absolute", // Make actions always visible at the bottom
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "white", // Ensure the buttons are clearly visible
              zIndex: 10,
              borderTop: "1px solid #ccc", // Optional visual separation
            }}
            dividers={scroll === "paper"}
          >
            <Button
              className="slide-in-from-bottom"
              onClick={handleUpdateViolation}
              disabled={isLoading}
              color="error"
            >
              {isLoading ? "Updating Student" : "Update Student"}
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
