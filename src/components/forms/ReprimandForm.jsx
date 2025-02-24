import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";

const ReprimandForm = ({
  studentDataToPass,
  alertMessageFunction,
  violationData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().slice(0, 16),
    violation_code: "",
    violation: "", // Minor, major set a or set b, etc...
    coordinator_discipline_head: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [coordinatorUsers, setCoordinatorUsers] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState("");

  const fetchCoordinator = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/admin", {
        params: { skip: 0, limit: 10 },
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
  useEffect(() => {
    console.log("Student To Pass:", studentDataToPass);
    fetchCoordinator();
    setFormData((prev) => ({
      ...prev,
      name: studentDataToPass.fullname || "",
      date: new Date().toISOString().slice(0, 10),
    }));
    //dummy data
    //   const student = {
    //     id: "679ea21f780b24d06f62858e",
    //     srcode: "21-74569",
    //     userid: "21-74569",
    //     email: "test@email.com",
    //     fullname: "COSTODIO, CEEJAY P.",
    //     course: "Criminology",
    //     term: "Fourth Semester",
    //     year_and_department: "3rd year - CCJE",
    //     type: "STUDENT",
    //     violations: [
    //       {
    //         code: "12.1.2",
    //         date_committed: "2025-02-06T15:55:34.218Z",
    //         sem_committed: "652a1b9f1c4a1a001c4a1ba0",
    //         reported_by: "6728b20d48c4d4c422da5c59",
    //         description: "Unknown Violation",
    //       },
    //       {
    //         code: "13.1",
    //         date_committed: "2025-02-07T10:30:00.000Z",
    //         sem_committed: "652a1b9f1c4a1a001c4a1ba1",
    //         reported_by: "6728b20d48c4d4c422da5c60",
    //         description: "Major - Set A",
    //       },
    //       {
    //         code: "13.3",
    //         date_committed: "2025-02-08T12:45:00.000Z",
    //         sem_committed: "652a1b9f1c4a1a001c4a1ba2",
    //         reported_by: "6728b20d48c4d4c422da5c61",
    //         description: "Major - Set B",
    //       },
    //       {
    //         code: "14.1",
    //         date_committed: "2025-02-09T14:15:00.000Z",
    //         sem_committed: "652a1b9f1c4a1a001c4a1ba3",
    //         reported_by: "6728b20d48c4d4c422da5c62",
    //         description: "Academic Dishonesty",
    //       },
    //     ],
    //     violation_summary: {
    //       categories: [
    //         { category: "minor", count: 1 },
    //         { category: "major - Set A", count: 1 },
    //         { category: "major - Set B", count: 1 },
    //         { category: "academic", count: 1 },
    //       ],
    //       total_violations: 4,
    //     },
    //   };
    // setStudentData([student]);
    setStudentData([studentDataToPass]);
  }, [studentDataToPass]);
  useEffect(() => {
    if (studentData.length > 0 && studentData[0].violations.length > 0) {
      const firstStudent = studentData[0]; // Get first student object
      const defaultViolationCode = firstStudent.violations[0].code;

      setSelectedViolation(defaultViolationCode);

      const sanctionDetails = getSanctionByViolation(
        firstStudent,
        violationData,
        defaultViolationCode
      );
      console.log("Sanction Details:", sanctionDetails);
      setFormData((prev) => ({
        ...prev,
        name: firstStudent.fullname || "",
        violation_code: defaultViolationCode,
        violation: sanctionDetails.category || "",
      }));
    }
  }, [studentData, violationData]);

  function getSanctionByViolation(student, rules, selectedCode) {
    if (!student || !student.violations || student.violations.length === 0) {
      console.error("No violations found for student.");
      return { sanction: "No violations available.", category: "" };
    }

    console.log("Student Violations:", student.violations);
    console.log("Selected Violation Code:", selectedCode);

    // Find the violation in student data
    let selectedViolation = student.violations.find(
      (v) => v.code.trim() === selectedCode.trim()
    );
    if (!selectedViolation) {
      console.error(
        `Violation with code ${selectedCode} not found in student data.`
      );
      return { sanction: "Unknown violation.", category: "" };
    }

    console.log("Selected Violation:", selectedViolation);

    // Find the rule that contains this violation
    let selectedRule = rules.find((r) =>
      r.violations.some((vr) => vr.code.trim() === selectedCode.trim())
    );
    if (!selectedRule) {
      console.error(`No rule found for violation code ${selectedCode}.`);
      return {
        sanction: "No rule found for this violation.",
        category: selectedViolation.description,
      };
    }

    console.log("Selected Rule:", selectedRule);

    // Determine category, appending set value if it's a major violation
    let category =
      selectedRule.category === "major" && selectedRule.set
        ? `Major - Set ${selectedRule.set}`
        : selectedRule.category.charAt(0).toUpperCase() +
          selectedRule.category.slice(1); // Capitalize first letter

    console.log("Violation Category:", category);

    return { sanction: "Sanction not required in this update.", category };
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (Object.values(formData).some((value) => value.trim() === "")) {
      alertMessageFunction(true, "Error", "Please fill out all fields.");
      setIsLoading(false);
      return;
    }
    console.log(formData);
    try {
      const response = await axios.post("/form/create_reprimand", formData);
      if (response.data.status === "success") {
        alertMessageFunction(true, "Form submitted successfully.", "Success");
      } else {
        alertMessageFunction(
          true,
          "An error occurred while submitting.",
          "Error"
        );
      }
    } catch (error) {
      alertMessageFunction(
        true,
        "An error occurred while submitting.",
        "Error"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:w-[500px] w-full mx-auto bg-white"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label" color="error">
            Violation Code
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            label="Violation Code"
            id="demo-simple-select-helper"
            color="error"
            name="violation_code"
            value={selectedViolation}
            onChange={(e) => {
              setSelectedViolation(e.target.value);
              const sanctionDetails = getSanctionByViolation(
                studentData[0],
                violationData,
                e.target.value
              );
              setFormData((prev) => ({
                ...prev,
                violation_code: e.target.value,
                violation: sanctionDetails.category || "",
              }));
            }}
          >
            {studentData.length > 0 &&
              studentData[0].violations.map((violation, index) => (
                <MenuItem key={index} value={violation.code}>
                  {violation.code}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            fullWidth
            label="Violation"
            id="violation"
            color="error"
            value={formData.violation}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                violation: e.target.value,
              }));
            }}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        {Object.keys(formData)
          .filter(
            (key) =>
              key !== "coordinator_discipline_head" &&
              key !== "violation_code" &&
              key !== "violation_description" &&
              key !== "violation"
          )
          .map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TextField
                fullWidth
                label={key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                name={key}
                color="error"
                type={key.includes("date") ? "datetime-local" : "text"}
                value={formData[key]}
                onChange={handleChange}
                required
                InputLabelProps={key.includes("date") ? { shrink: true } : {}}
              />
            </motion.div>
          ))}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: Object.keys(formData).length * 0.05 }}
        >
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-helper-label" color="error">
              Coordinator Discipline Head
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              label="Coordinator Discipline Head"
              id="demo-simple-select-helper"
              name="coordinator_discipline_head"
              value={formData.coordinator_discipline_head}
              onChange={handleChange}
              color="error"
            >
              {coordinatorUsers
                .filter((user) => user.type === "OSD_COORDINATOR")
                .map((coordinator) => (
                  <MenuItem key={coordinator.id} value={coordinator.id}>
                    {coordinator.first_name + " " + coordinator.last_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: Object.keys(formData).length * 0.1,
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            color="error"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

ReprimandForm.propTypes = {
  studentDataToPass: PropTypes.shape({
    fullname: PropTypes.string,
  }).isRequired,
  alertMessageFunction: PropTypes.func.isRequired,
  violationData: PropTypes.array.isRequired,
};

export default ReprimandForm;
