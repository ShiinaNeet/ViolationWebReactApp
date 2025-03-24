import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

export default function FormList() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filteredForms, setFilteredForms] = useState([]);
  const [coordinatorUsers, setCoordinatorUsers] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [filter, setFilter] = useState("call_slip");
  const [selectedForm, setSelectedForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formTypes = [
    "call_slip",
    "reprimand",
    "temporary_gatepass",
    "case_dismissals",
    "formal_complaint_letter",
    "student_incident_report",
    "warning_violations_of_norms_of_conduct",
    "non_wearing_uniform",
  ];

  // Fetch Forms from API
  useEffect(() => {
    fetchForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
  // Fetch Coordinator from API
  useEffect(() => {
    fetchCoordinator();
    fetchPrograms();
    fetchDepartments();
  }, []);
  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("form", {
        headers: { "Content-Type": "application/json" },
        params: {
          form_type: filter,
        },
      });
      if (response.status === 200) {
        // const sec = {
        //   form_type: "case_dismissals",
        //   name: "John Doe",
        //   effectivity_date: "2025-03-01T12:16:47.962Z",
        //   college: "College of Engineering",
        //   program: "Computer Engineering",
        //   campus: "Main Campus",
        //   year: "4th Year",
        //   section: "A",
        //   sr_code: "123456",
        //   sex: "Male",
        //   indicate_offense: "Cheating",
        //   reason_for_dismissal: {
        //     is_without_merit: true,
        //     others: "Lack of evidence",
        //   },
        //   report_date: "2025-03-01T12:16:47.962Z",
        //   report_time: "10:00 AM",
        //   coordinator_discipline_head: "67b5ce20338e7035a73bce5e",
        //   date_signed: "2025-03-01T12:16:47.962Z",
        // };
        // const selectedForm = {
        //   form_type: "student_incident_report",
        //   name: "Jane Doe",
        //   date: "2025-03-01T12:16:47.962Z",
        //   time: "10:30 AM",
        //   college: "College of Arts and Sciences",
        //   campus: "North Campus",
        //   sr_code: "654321",
        //   program: "5eb7cf5a86d9755df3a6c593",
        //   year_section: "2nd Year - B",
        //   incident: "Disruptive behavior in class",
        //   remarks: "Handled by the class advisor",
        //   reported_by: "Mr. Smith",
        //   designation: "Class Advisor",
        // };
        // const selectedForm = {
        //   form_type: "warning_violations_of_norms_of_conduct",
        //   name: "John Doe",
        //   date: "2025-03-01T12:16:47.962Z",
        //   recieved_letter_date: "2025-03-01T12:16:47.962Z",
        //   violation_code: "V001",
        //   violation_description: "Violation of conduct norms",
        //   addressed_to: "Jane Smith",
        //   coordinator_discipline_head: "678ed1684f25f7a412bd2efe",
        // };
        // const selectedForm = {
        //   form_type: "non_wearing_uniform",
        //   name: "John Doe",
        //   college: "College of Engineering",
        //   program: "5eb7cf5a86d9755df3a6c593",
        //   sr_code: "123456",
        //   campus: "Main Campus",
        //   year_section: "2nd Year - A",
        //   check: {
        //     fieldwork_workshop: false,
        //     prolonged_standing: true,
        //     foreign_student_on_short_special_course: false,
        //     pregnant: true,
        //     special_cases: true,
        //     force_majeure: false,
        //     intern: false,
        //     others: "qweqweqwe",
        //   },
        //   requested_by: {
        //     name: "Jane Smith",
        //     date: "2025-03-01T12:58:49.211Z",
        //   },
        //   reviewed_by: {
        //     name: "Robert Brown",
        //     date: "2025-03-01T12:58:49.211Z",
        //   },
        //   approved_by: {
        //     name: "Alice Johnson",
        //     date: "2025-03-01T12:58:49.211Z",
        //   },
        // };
        // const dummyData = [
        //   {
        //     form_type: "call_slip",
        //     name: "John Doe",
        //     effectivity_date: "2025-03-01T12:58:49.211Z",
        //     college: "College of Engineering",
        //     program: "65a9f2c8b432e1f89d7c3a01",
        //     date: "2025-03-01T12:58:49.211Z",
        //     campus: "Main Campus",
        //     year: "4th Year",
        //     section: "A",
        //     report_date: "2025-03-01T12:58:49.211Z",
        //     report_time: "10:00 AM",
        //     coordinator_discipline_head: "67b5b81c246f98af202c41eb",
        //     date_signed: "2025-03-01T12:58:49.211Z",
        //   },
        //   {
        //     form_type: "reprimand",
        //     name: "Jane Doe",
        //     date: "2025-03-01T12:58:49.211Z",
        //     violation_code: "V001",
        //     violation: "Minor Violation",
        //     coordinator_discipline_head: "67b5b81c246f98af202c41eb",
        //   },
        //   {
        //     form_type: "temporary_gatepass",
        //     name: "Alice Johnson",
        //     college: "College of Arts and Sciences",
        //     program: "5eb7cf5a86d9755df3a6c593",
        //     date: "2025-03-01T12:58:49.211Z",
        //     sr_code: "654321",
        //     year_section: "2nd Year - B",
        //     remarks: "Temporary gatepass issued",
        //     valid_until: "2025-03-01T12:58:49.211Z",
        //     issued_by: {
        //       name: "Mr. Brown",
        //       date: "2025-03-01T12:58:49.211Z",
        //     },
        //   },
        //   {
        //     form_type: "case_dismissals",
        //     name: "Robert Brown",
        //     effectivity_date: "2025-03-01T12:58:49.211Z",
        //     college: "College of Business",
        //     program: "Business Administration",
        //     campus: "South Campus",
        //     year: "3rd Year",
        //     section: "C",
        //     sr_code: "789012",
        //     sex: "Male",
        //     indicate_offense: "Plagiarism",
        //     reason_for_dismissal: {
        //       is_without_merit: false,
        //       others: "Lack of evidence",
        //     },
        //     report_date: "2025-03-01T12:58:49.211Z",
        //     report_time: "11:00 AM",
        //     coordinator_discipline_head: "67b5b81c246f98af202c41eb",
        //     date_signed: "2025-03-01T12:58:49.211Z",
        //   },
        //   {
        //     form_type: "formal_complaint_letter",
        //     date: "2025-03-01T12:58:49.211Z",
        //     coordinator_discipline_head: "67b5b81c246f98af202c41eb",
        //     subject_of_complaint: {
        //       name: "John Smith",
        //       college: "College of Law",
        //       year_section: "1st Year - A",
        //     },
        //     norms_of_conduct_violated_by_the_student: "Cheating",
        //     narration_of_facts_and_circumstances:
        //       "Detailed narration of the incident",
        //     final_word: "Final remarks",
        //     name_of_complainant: "Jane Doe",
        //     contact_no_of_complainant: "123-456-7890",
        //     email_address_of_complainant: "jane.doe@example.com",
        //     witnesses: ["Witness 1", "Witness 2"],
        //     enclosed_evidences: ["Evidence 1", "Evidence 2"],
        //   },
        //   {
        //     form_type: "student_incident_report",
        //     name: "Emily Davis",
        //     date: "2025-03-01T12:58:49.211Z",
        //     time: "09:30 AM",
        //     college: "College of Medicine",
        //     campus: "West Campus",
        //     sr_code: "321654",
        //     program: "65a9f2c8b432e1f89d7c3a02",
        //     year_section: "1st Year - B",
        //     incident: "Disruptive behavior in class",
        //     remarks: "Handled by the class advisor",
        //     reported_by: "Mr. Smith",
        //     designation: "Class Advisor",
        //   },
        //   {
        //     form_type: "warning_violations_of_norms_of_conduct",
        //     name: "David Wilson",
        //     date: "2025-03-01T12:58:49.211Z",
        //     recieved_letter_date: "2025-03-01T12:58:49.211Z",
        //     violation_code: "V003",
        //     violation_description: "Violation of conduct norms",
        //     addressed_to: "Jane Smith",
        //     department: "60d5f8f8d3b7f1c1a3b8c8d4",
        //   },
        //   {
        //     form_type: "non_wearing_uniform",
        //     name: "Sophia Martinez",
        //     college: "College of Engineering",
        //     program: "5eb7cf5a86d9755df3a6c593",
        //     sr_code: "987654",
        //     campus: "Main Campus",
        //     year_section: "2nd Year - A",
        //     check: {
        //       fieldwork_workshop: false,
        //       prolonged_standing: false,
        //       foreign_student_on_short_special_course: false,
        //       pregnant: false,
        //       special_cases: false,
        //       force_majeure: false,
        //       intern: false,
        //       others: "None",
        //     },
        //     requested_by: {
        //       name: "Jane Smith",
        //       date: "2025-03-01T12:58:49.211Z",
        //     },
        //     reviewed_by: {
        //       name: "Robert Brown",
        //       date: "2025-03-01T12:58:49.211Z",
        //     },
        //     approved_by: {
        //       name: "Alice Johnson",
        //       date: "2025-03-01T12:58:49.211Z",
        //     },
        //   },
        // ];
        // setFilteredForms(dummyData);
        // setForms(dummyData);

        setFilteredForms(response.data);
        console.log("Forms fetched:", response.data);
      }
    } catch (error) {
      console.error("Error fetching Forms:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPrograms = async () => {
    try {
      const response = await axios.get("/progams", {
        params: { skip: 0, limit: 100 },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        console.log("Program List fetched successfully");
        setProgramList(response.data.data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/department", {
        params: { skip: 0, limit: 100 },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        console.log("Department List fetched successfully");
        setDepartmentList(response.data.data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };
  const fetchCoordinator = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/admin", {
        params: { skip: 0, limit: 100, sort_order: "asc" },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        setCoordinatorUsers(response.data.data);
        console.log("Coordinator Users", response.data.data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleView = (form) => {
    setSelectedForm(form);

    setIsViewModalOpen(true);
  };
  const handleClose = () => {
    setIsViewModalOpen(false);
    setSelectedForm(null);
  };
  const getDepartmentName = (departmentId) => {
    let departmentName = departmentList.find(
      (dept) => dept._id === departmentId
    );
    return departmentName ? departmentName.name : "Unknown";
  };
  const getCoordinatorFullName = (userid) => {
    let fullname = coordinatorUsers.find((user) => user.id === userid);
    return fullname
      ? fullname.first_name + " " + fullname.last_name
      : "Unknown";
  };
  const getProgramName = (programId) => {
    console.log("Program ID", programId);
    let programName = programList.find((program) => program.id === programId);
    console.log("Program Name", programName);
    return programName ? programName.name : "Unknown";
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const getName = (form) => {
    if (form.name) return form.name;
    if (form.subject_of_complaint && form.subject_of_complaint.name)
      return form.subject_of_complaint.name;
    if (form.issued_by && form.issued_by.name) return form.issued_by.name;
    if (form.requested_by && form.requested_by.name)
      return form.requested_by.name;
    if (form.reviewed_by && form.reviewed_by.name) return form.reviewed_by.name;
    if (form.approved_by && form.approved_by.name) return form.approved_by.name;
    return "N/A";
  };
  const GetTableData = () => {
    return filteredForms.map((form, idx) => (
      <TableRow key={idx} className="hover:bg-gray-100">
        <TableCell>{idx + 1}</TableCell>
        <TableCell>{getName(form)}</TableCell>
        <TableCell>{capitalizeFirstLetter(form.form_type)}</TableCell>
        <TableCell align="center">
          <Button color="error" variant="text" onClick={() => handleView(form)}>
            View
          </Button>
        </TableCell>
      </TableRow>
    ));
  };
  const GetEmptyTableRowData = () => {
    return (
      <TableRow>
        <TableCell colSpan={4} align="center">
          No sent forms.
        </TableCell>
      </TableRow>
    );
  };
  const GetTableLoadingRow = () => {
    return (
      <TableRow>
        <TableCell colSpan={4} align="center">
          Loading...
        </TableCell>
      </TableRow>
    );
  };
  const GetTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }}>
          <GetTableHeader />
          <TableBody>
            {isLoading ? <GetTableLoadingRow /> : <GetTableData />}
            {filteredForms.length === 0 && isLoading === false && (
              <GetEmptyTableRowData />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  const GetTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
          <TableCell sx={{ fontWeight: "bold" }} align="center">
            Action
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };
  const GetDialogContent = () => {
    return (
      <div>
        <p className="my-2">
          <strong>
            Form Type: {capitalizeFirstLetter(selectedForm.form_type)}
          </strong>
        </p>

        {selectedForm.form_type === "call_slip" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Name"
              value={selectedForm.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Effectivity Date"
              value={moment(selectedForm.effectivity_date).format(
                "MMMM DD, YYYY"
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="College"
              value={selectedForm.college}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Program"
              value={getProgramName(selectedForm.program)}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date"
              value={moment(selectedForm.date).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Campus"
              value={selectedForm.campus}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Year"
              value={selectedForm.year}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Section"
              value={selectedForm.section}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Report Date"
              value={moment(selectedForm.report_date).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Report Time"
              value={selectedForm.report_time}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Coordinator Discipline Head"
              value={
                selectedForm.coordinator_discipline_head &&
                getCoordinatorFullName(selectedForm.coordinator_discipline_head)
              }
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              color="error"
              label="Date Signed"
              value={moment(selectedForm.date_signed).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </div>
        )}

        {selectedForm.form_type === "reprimand" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Name"
              value={selectedForm.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date"
              value={moment(selectedForm.date).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Violation Code"
              value={selectedForm.violation_code}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Violation"
              value={selectedForm.violation}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Coordinator Discipline Head"
              value={
                selectedForm.coordinator_discipline_head &&
                getCoordinatorFullName(selectedForm.coordinator_discipline_head)
              }
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
          </div>
        )}

        {selectedForm.form_type === "temporary_gatepass" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Name"
              value={selectedForm.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="College"
              value={selectedForm.college}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Program"
              value={getProgramName(selectedForm.program)}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date"
              value={moment(selectedForm.valid_until).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="SR Code"
              value={selectedForm.sr_code}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Year Section"
              value={selectedForm.year_section || "N/A"}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Remarks"
              value={selectedForm.remarks}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Valid Until"
              value={moment(selectedForm.valid_until).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Issued By"
              value={selectedForm.issued_by.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Issued Date"
              value={moment(selectedForm.issued_by.date).format(
                "MMMM DD, YYYY"
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
          </div>
        )}

        {selectedForm.form_type === "case_dismissals" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Name"
              value={selectedForm.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Effectivity Date"
              value={moment(selectedForm.effectivity_date).format(
                "MMMM DD, YYYY"
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="College"
              value={selectedForm.college}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Program"
              value={selectedForm.program}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Campus"
              value={selectedForm.campus}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Year"
              value={selectedForm.year}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Section"
              value={selectedForm.section}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="SR Code"
              value={selectedForm.sr_code}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Sex"
              value={selectedForm.sex}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Indicate Offense"
              value={selectedForm.indicate_offense}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedForm.reason_for_dismissal.is_without_merit}
                  color="error"
                  readOnly
                />
              }
              label="Without Merit"
            />
            <TextField
              fullWidth
              label="Other Reasons"
              value={selectedForm.reason_for_dismissal.others}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Report Date"
              value={moment(selectedForm.report_date).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Report Time"
              value={selectedForm.report_time}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Coordinator Discipline Head"
              value={getCoordinatorFullName(
                selectedForm.coordinator_discipline_head
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date Signed"
              value={moment(selectedForm.date_signed).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
          </div>
        )}

        {selectedForm.form_type === "formal_complaint_letter" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Date"
              value={moment(selectedForm.date).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Coordinator Discipline Head"
              value={getCoordinatorFullName(
                selectedForm.coordinator_discipline_head
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subject of Complaint - Name"
              value={selectedForm.subject_of_complaint.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subject of Complaint - College"
              value={selectedForm.subject_of_complaint.college}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subject of Complaint - Year Section"
              value={selectedForm.subject_of_complaint.year_section}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Norms of Conduct Violated by the Student"
              value={selectedForm.norms_of_conduct_violated_by_the_student}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Narration of Facts and Circumstances"
              value={selectedForm.narration_of_facts_and_circumstances}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Final Word"
              value={selectedForm.final_word}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Name of Complainant"
              value={selectedForm.name_of_complainant}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact No of Complainant"
              value={selectedForm.contact_no_of_complainant}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email Address of Complainant"
              value={selectedForm.email_address_of_complainant}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Witnesses"
              value={selectedForm.witnesses.join(", ")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Enclosed Evidences"
              value={selectedForm.enclosed_evidences.join(", ")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
          </div>
        )}

        {selectedForm.form_type === "student_incident_report" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Name"
              value={selectedForm.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date"
              value={moment(selectedForm.date).format("MMMM DD, YYYY hh:mm A")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Time"
              value={selectedForm.time}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="College"
              value={selectedForm.college}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Campus"
              value={selectedForm.campus}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="SR Code"
              value={selectedForm.sr_code}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Program"
              value={getProgramName(selectedForm.program)}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Year Section"
              value={selectedForm.year_section}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Incident"
              value={selectedForm.incident}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Remarks"
              value={selectedForm.remarks}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reported By"
              value={selectedForm.reported_by}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Designation"
              value={selectedForm.designation}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
          </div>
        )}

        {selectedForm.form_type ===
          "warning_violations_of_norms_of_conduct" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Name"
              value={selectedForm.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date"
              value={moment(selectedForm.date).format("MMMM DD, YYYY")}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Received Letter Date"
              value={moment(selectedForm.recieved_letter_date).format(
                "MMMM DD, YYYY"
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Violation Code"
              value={selectedForm.violation_code}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Violation Description"
              value={selectedForm.violation_description}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Addressed To"
              value={selectedForm.addressed_to}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Department"
              value={
                // getCoordinatorFullName(selectedForm.coordinator_discipline_head)
                //   .charAt(0)
                //   .toUpperCase() +
                // getCoordinatorFullName(
                //   selectedForm.coordinator_discipline_head
                // ).slice(1)
                getDepartmentName(selectedForm.department)
                  .charAt(0)
                  .toUpperCase() +
                getDepartmentName(selectedForm.department).slice(1)
              }
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
          </div>
        )}

        {selectedForm.form_type === "non_wearing_uniform" && (
          <div className="my-2">
            <TextField
              fullWidth
              label="Name"
              value={selectedForm.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="College"
              value={selectedForm.college}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Program"
              value={getProgramName(selectedForm.program)}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="SR Code"
              value={selectedForm.sr_code}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Campus"
              value={selectedForm.campus}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Year Section"
              value={selectedForm.year_section}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedForm.check.fieldwork_workshop}
                  color="error"
                  readOnly
                />
              }
              label="Fieldwork/Workshop"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedForm.check.prolonged_standing}
                  color="error"
                  readOnly
                />
              }
              label="Prolonged Standing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    selectedForm.check.foreign_student_on_short_special_course
                  }
                  color="error"
                  readOnly
                />
              }
              label="Foreign Student on Short Special Course"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedForm.check.pregnant}
                  color="error"
                  readOnly
                />
              }
              label="Pregnant"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedForm.check.special_cases}
                  color="error"
                  readOnly
                />
              }
              label="Special Cases"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedForm.check.force_majeure}
                  color="error"
                  readOnly
                />
              }
              label="Force Majeure"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedForm.check.intern}
                  color="error"
                  readOnly
                />
              }
              label="Intern"
            />
            <TextField
              fullWidth
              label="Others"
              value={selectedForm.check.others}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Requested By"
              value={selectedForm.requested_by.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Requested Date"
              value={moment(selectedForm.requested_by.date).format(
                "MMMM DD, YYYY"
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reviewed By"
              value={selectedForm.reviewed_by.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reviewed Date"
              value={moment(selectedForm.reviewed_by.date).format(
                "MMMM DD, YYYY"
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Approved By"
              value={selectedForm.approved_by.name}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Approved Date"
              value={moment(selectedForm.approved_by.date).format(
                "MMMM DD, YYYY"
              )}
              InputProps={{
                readOnly: true,
              }}
              color="error"
              variant="outlined"
              margin="normal"
            />
          </div>
        )}
      </div>
    );
  };
  const GetSelectFormTypes = () => {
    return (
      <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
        <InputLabel color="error">Form Type</InputLabel>
        <Select
          label="Form Type"
          color="error"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {formTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {capitalizeFirstLetter(type)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  const GetViewDialog = () => {
    return (
      <Dialog
        open={isViewModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>View Form Details</DialogTitle>
        <DialogContent>
          {selectedForm ? <GetDialogContent /> : <p>No form selected.</p>}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  return (
    <div>
      <h1 className="text-2xl text-red-600 py-3">Sent Forms</h1>
      <GetSelectFormTypes />
      <GetTable />
      <GetViewDialog />
    </div>
  );
}
