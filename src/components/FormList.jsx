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
  Snackbar,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

export default function FormList() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
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
  }, [filter]);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("forms", {
        headers: { "Content-Type": "application/json" },
        params: {
          form_type: filter,
        },
      });

      if (response.data.status === "success") {
        setForms(response.data.data);
        setFilteredForms(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Forms:", error);
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

  return (
    <div>
      <h1 className="text-2xl text-red-600 py-3">Sent Forms</h1>
      <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
        <InputLabel color="error">Form Type</InputLabel>
        <Select
          color="error"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {formTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace(/_/g, " ").toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Form Type</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredForms.map((form, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{form.form_type || "Unknown"}</TableCell>
                  <TableCell align="center">
                    <Button
                      color="error"
                      variant="text"
                      onClick={() => handleView(form)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredForms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No sent forms.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={isViewModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>View Form Details</DialogTitle>
        <DialogContent>
          {selectedForm ? (
            <div>
              <p>
                <strong>Form Type:</strong> {selectedForm.form_type}
              </p>

              {selectedForm.form_type === "call_slip" && (
                <div>
                  <p>
                    <strong>Name:</strong> {selectedForm.name}
                  </p>
                  <p>
                    <strong>Effectivity Date:</strong>{" "}
                    {moment(selectedForm.effectivity_date).format(
                      "MMMM DD, YYYY"
                    )}
                  </p>
                  <p>
                    <strong>College:</strong> {selectedForm.college}
                  </p>
                  <p>
                    <strong>Program:</strong> {selectedForm.program}
                  </p>
                  <p>
                    <strong>Report Date:</strong>{" "}
                    {moment(selectedForm.report_date).format("MMMM DD, YYYY")}
                  </p>
                </div>
              )}

              {selectedForm.form_type === "reprimand" && (
                <div>
                  <p>
                    <strong>Name:</strong> {selectedForm.name}
                  </p>
                  <p>
                    <strong>Violation Code:</strong>{" "}
                    {selectedForm.violation_code}
                  </p>
                  <p>
                    <strong>Violation:</strong> {selectedForm.violation}
                  </p>
                </div>
              )}

              {selectedForm.form_type === "temporary_gatepass" && (
                <div>
                  <p>
                    <strong>Name:</strong> {selectedForm.name}
                  </p>
                  <p>
                    <strong>SR Code:</strong> {selectedForm.sr_code}
                  </p>
                  <p>
                    <strong>Valid Until:</strong>{" "}
                    {moment(selectedForm.valid_until).format("MMMM DD, YYYY")}
                  </p>
                  <p>
                    <strong>Issued By:</strong> {selectedForm.issued_by.name}
                  </p>
                </div>
              )}

              {selectedForm.form_type === "case_dismissals" && (
                <div>
                  <p>
                    <strong>Name:</strong> {selectedForm.name}
                  </p>
                  <p>
                    <strong>Effectivity Date:</strong>{" "}
                    {moment(selectedForm.effectivity_date).format(
                      "MMMM DD, YYYY"
                    )}
                  </p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {selectedForm.reason_for_dismissal.others}
                  </p>
                </div>
              )}

              {selectedForm.form_type === "formal_complaint_letter" && (
                <div>
                  <p>
                    <strong>Name of Complainant:</strong>{" "}
                    {selectedForm.name_of_complainant}
                  </p>
                  <p>
                    <strong>Contact No:</strong>{" "}
                    {selectedForm.contact_no_of_complainant}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedForm.email_address_of_complainant}
                  </p>
                  <p>
                    <strong>Final Word:</strong> {selectedForm.final_word}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p>No form selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
