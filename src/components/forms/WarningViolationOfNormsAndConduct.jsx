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

const WarningViolationOfNormsAndConduct = ({
  studentDataToPass,
  alertMessageFunction,
  violationData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().slice(0, 16),
    recieved_letter_date: new Date().toISOString().slice(0, 16),
    violation_code: "",
    violation_description: "",
    addressed_to: "",
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
    console.log(studentDataToPass);
    fetchCoordinator();
    setFormData((prev) => ({
      ...prev,
      name: studentDataToPass.fullname || "",
      date: new Date().toISOString().slice(0, 10),
    }));
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

      setFormData((prev) => ({
        ...prev,
        name: firstStudent.fullname || "",
        violation_code: defaultViolationCode,
        violation_description: sanctionDetails.description || "",
      }));
    }
  }, [studentData, violationData]);

  function getSanctionByViolation(student, rules, selectedCode) {
    if (!student || !student.violations || student.violations.length === 0) {
      console.error("No violations found for student.");
      return { sanction: "No violations available.", description: "" };
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
      return { sanction: "Unknown violation.", description: "" };
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
        description: selectedViolation.description,
      };
    }

    console.log("Selected Rule:", selectedRule);

    // Get the correct description from the rules
    let correctViolation = selectedRule.violations.find(
      (v) => v.code.trim() === selectedCode.trim()
    );
    if (correctViolation) {
      selectedViolation.description = correctViolation.description; // Fix the description
    }

    console.log(
      "Updated Violation Description:",
      selectedViolation.description
    );

    // Determine the number of offenses
    let minorCount = 0;
    let majorCount = 0;

    student.violations.forEach((v) => {
      let rule = rules.find((r) =>
        r.violations.some((vr) => vr.code.trim() === v.code.trim())
      );
      if (rule) {
        if (rule.category === "minor") {
          minorCount++;
        } else if (rule.category === "major") {
          majorCount++;
        }
      }
    });

    let majorEquivalent = Math.floor(minorCount / 3);
    majorCount += majorEquivalent;

    let offenseCount =
      selectedRule.category === "minor" ? minorCount : majorCount;

    let offenseLevel;
    if (offenseCount >= 3) {
      offenseLevel = "third_offense";
    } else if (offenseCount === 2) {
      offenseLevel = "second_offense";
    } else {
      offenseLevel = "first_offense";
    }

    let sanction =
      selectedRule.sanctions[offenseLevel] || "No specific sanction found";

    console.log(`Sanction determined: ${sanction}`);

    return { sanction, description: selectedViolation.description };
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
      const response = await axios.post(
        "/form/warning_violation_of_norms_and_conduct",
        formData
      );
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
                violation_description: sanctionDetails.description || "",
                sanction: sanctionDetails.sanction || "",
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
            label="Violation Description"
            id="violation-description"
            color="error"
            value={formData.violation_description}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                violation_description: e.target.value,
              }));
            }}
          />
        </FormControl>
        {Object.keys(formData)
          .filter(
            (key) =>
              key !== "coordinator_discipline_head" &&
              key !== "violation_code" &&
              key !== "violation_description"
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

WarningViolationOfNormsAndConduct.propTypes = {
  studentDataToPass: PropTypes.shape({
    fullname: PropTypes.string,
    program: PropTypes.string,
    year: PropTypes.string,
    srcode: PropTypes.string,
    year_and_department: PropTypes.string,
    course: PropTypes.string,
    term: PropTypes.string,
    email: PropTypes.string,
    userid: PropTypes.string,
  }).isRequired,
  alertMessageFunction: PropTypes.func.isRequired,
  violationData: PropTypes.array.isRequired,
};

export default WarningViolationOfNormsAndConduct;
