import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

export default function FormList() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filteredForms, setFilteredForms] = useState([]);
  const [coordinatorUsers, setCoordinatorUsers] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [filter, setFilter] = useState("call_slip");
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedEditForm, setSelectedEditForm] = useState({
    status: 0,
    reason: "",
  });
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
      if (response.status === 200 && response.data.status === "success") {
        setFilteredForms(response.data.data);
        console.log("Forms fetched:", response.data.data);
      } else {
        // Handle cases where status is not success or data is not as expected
        setFilteredForms([]);
        console.log("Failed to fetch forms or no forms found:", response.data);
      }
    } catch (error) {
      console.error("Error fetching Forms:", error);
      setFilteredForms([]); // Ensure filteredForms is an array on error
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
  const handleEdit = (form) => {
    console.log("Editing form:", form.id);
    setSelectedEditForm(form);
    setIsEditModalOpen(true);
  };
  const handleClose = () => {
    setIsViewModalOpen(false);
    setSelectedForm(null);
    setIsEditModalOpen(false);
  };
  const saveFormStatus = async (formId, status) => {
    console.log("Saving form status:", selectedEditForm);
    try {
      const response = await axios.patch(`form/${formId}/status`, {
        status: status, // status is now a string, e.g., "pending"
        reason: selectedEditForm.reason || "Form status updated",
      });
      if (response.status === 200) {
        console.log("Form status updated successfully");
        // Refetch forms to update the list with the new status
        fetchForms();
      }
    } catch (error) {
      console.error("Error updating form status:", error);
    }
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
        <TableCell style={{ textTransform: "capitalize" }}>
          {form.status}
        </TableCell>
        <TableCell align="center">
          <Button color="error" variant="text" onClick={() => handleView(form)}>
            View
          </Button>
          <Button color="error" variant="text" onClick={() => handleEdit(form)}>
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ));
  };
  const GetEmptyTableRowData = () => {
    return (
      <TableRow>
        <TableCell colSpan={5} align="center">
          No sent forms.
        </TableCell>
      </TableRow>
    );
  };
  const GetTableLoadingRow = () => {
    return (
      <TableRow>
        <TableCell colSpan={5} align="center">
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
          <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
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
        <TextField
          fullWidth
          label="Status"
          value={capitalizeFirstLetter(selectedForm.status)}
          InputProps={{
            readOnly: true,
          }}
          color="error"
          variant="outlined"
          margin="normal"
        />

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
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel color="error">Form Type</InputLabel>
        <Select
          size="small"
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
      <div className="flex items-end justify-between py-3">
        <h1 className="text-red-600" style={{ fontSize: "16px" }}>
          Sent Forms
        </h1>
        <GetSelectFormTypes />
      </div>
      <GetTable />
      <GetViewDialog />
      <EditFormDialog
        open={isEditModalOpen}
        onClose={handleClose}
        form={selectedEditForm}
        onChange={setSelectedEditForm}
        onSave={saveFormStatus}
        capitalizeFirstLetter={capitalizeFirstLetter}
      />
    </div>
  );
}

function EditFormDialog({
  open,
  onClose,
  form,
  onChange,
  onSave,
  capitalizeFirstLetter,
}) {
  // Default status to "pending" if undefined/null to prevent MUI Select warning
  const selectStatus = form?.status || "pending";
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          Form Details{" - "}
          <span style={{ color: "red" }}>{form ? form.violation : ""}</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          color="error"
          label="Name"
          value={form ? form.name : ""}
          InputProps={{ readOnly: true }}
          variant="outlined"
          margin="normal"
          disabled
        />
        <TextField
          fullWidth
          color="error"
          label="Violation Code"
          value={form ? form.violation_code : ""}
          InputProps={{ readOnly: true }}
          variant="outlined"
          disabled
          margin="normal"
        />
        <TextField
          fullWidth
          color="error"
          label="Form Type"
          value={form ? capitalizeFirstLetter(form.form_type) : ""}
          InputProps={{ readOnly: true }}
          disabled
          variant="outlined"
          margin="normal"
          sx={{ textTransform: "uppercase" }}
        />
        <Typography variant="body2" color="textSecondary" className="pt-5">
          Change the status of the form
        </Typography>
        <Select
          fullWidth
          value={selectStatus}
          onChange={(e) => {
            e.preventDefault();
            onChange({ ...form, status: e.target.value });
          }}
          color="error"
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="under_review">Under Review</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </Select>
        <TextField
          fullWidth
          color="error"
          label="Reason"
          value={typeof form?.reason === "string" ? form.reason : ""}
          onChange={(e) => onChange({ ...form, reason: e.target.value })}
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            onSave(form.id, selectStatus);
            onClose();
          }}
        >
          Update Status
        </Button>
        <Button color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  capitalizeFirstLetter: PropTypes.func.isRequired,
};
