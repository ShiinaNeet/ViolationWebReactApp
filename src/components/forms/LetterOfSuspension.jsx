/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import axios from "axios";

const LetterOfSuspension = ({
  studentDataToPass,
  violationData,
  alertMessageFunction,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    violation_code: "",
    violation_description: "",
    sanction: "",
    day_of_suspension: "",
    prepared_by: "",
    checked_by: "",
    verified_by: "",
    recomending_approval: "",
    approved_by: "",
    conformed: {
      date: "",
      parent_guardian: "",
    },
  });
  const [selectedViolation, setSelectedViolation] = useState("");

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
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    console.warn("Student Data to Pass:", studentDataToPass);
    console.warn("Violation Data:", violationData);

    setStudentData([
      {
        id: "67a1b2c3780b24d06f628590",
        srcode: "21-12345",
        userid: "21-12345",
        email: "student1@email.com",
        fullname: "GARCIA, JOHN D.",
        course: "Information Technology",
        term: "First Semester",
        year_and_department: "2nd year - CICS",
        type: "STUDENT",
        violations: [
          {
            code: "12.1.2",
            date_committed: "2025-02-06T10:00:00.000Z",
            sem_committed: "652a1b9f1c4a1a001c4a1ba0",
            reported_by: "6728b20d48c4d4c422da5c59",
            description: "Unknown Violation",
          },
          {
            code: "12.1.7",
            date_committed: "2025-02-08T12:30:00.000Z",
            sem_committed: "652a1b9f1c4a1a001c4a1ba0",
            reported_by: "6728b20d48c4d4c422da5c59",
            description: "Unknown Violation",
          },
          {
            code: "12.1.13",
            date_committed: "2025-02-10T14:15:00.000Z",
            sem_committed: "652a1b9f1c4a1a001c4a1ba0",
            reported_by: "6728b20d48c4d4c422da5c59",
            description: "Unknown Violation",
          },
        ],
        violation_summary: {
          categories: [
            {
              category: "minor",
              count: 3,
            },
          ],
          total_violations: 3,
        },
      },
    ]);

    // if (studentDataToPass && studentDataToPass.violations.length > 0) {
    //     const defaultViolationCode = studentDataToPass.violations[0].code;
    //     setSelectedViolation(defaultViolationCode);

    //     const sanctionDetails = getSanctionByViolation(studentDataToPass, violationData, defaultViolationCode);

    //     setFormData((prev) => ({
    //         ...prev,
    //         name: studentDataToPass.fullname || "",
    //         violation_code: defaultViolationCode,
    //         violation_description: sanctionDetails.description || "",
    //         sanction: sanctionDetails.sanction || "",
    //         program: studentDataToPass.course || "",
    //         college: "Batangas State University",
    //         year: studentDataToPass.year_and_department ? studentDataToPass.year_and_department.split(" - ")[0] : "",
    //         campus: "Batangas State University - Nasugbu Campus",
    //         report_date: new Date().toISOString().slice(0, 10),
    //         report_time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    //     }));
    // }
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
        sanction: sanctionDetails.sanction || "",
        program: firstStudent.course || "",
        college: "Batangas State University",
        year: firstStudent.year_and_department
          ? firstStudent.year_and_department.split(" - ")[0]
          : "",
        campus: "Batangas State University - Nasugbu Campus",
        report_date: new Date().toISOString().slice(0, 10),
        report_time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    }
  }, [studentData, violationData]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("conformed.")) {
      setFormData((prev) => ({
        ...prev,
        conformed: { ...prev.conformed, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (Object.values(formData).some((value) => value === "")) {
      alertMessageFunction(true, "Please fill out all fields.", "Error");
      setIsLoading(false);
      return;
    }
    axios
      .post("form/letter_of_suspension", formData)
      .then((response) => {
        if (response.data.status === "success") {
          console.log(response.data);
          alertMessageFunction(true, "Successfully submitted form.", "Success");
        } else {
          console.error("Failed to submit form.", response.data);
          alertMessageFunction(true, "Failed to submit form.", "Error");
        }
      })
      .catch((error) => {
        console.error("An error occurred while submitting the form.", error);
        alertMessageFunction(
          true,
          "An error occurred while submitting the form.",
          "Error"
        );
      })
      .finally(() => {
        setIsLoading(false);
        alertMessageFunction("success", "Successfully submitted form.");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:w-[500px] w-full mx-auto "
    >
      <form onSubmit={handleSubmit} className="space-y-4 w-full mt-4">
        {/* Violation Code Select Input */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            Violation Code
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            label="Violation Code"
            id="demo-simple-select-helper"
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
        {Object.keys(formData).map((key, index) =>
          typeof formData[key] === "object" ? (
            Object.keys(formData[key]).map((subKey, subIndex) => {
              const isDateField =
                subKey.includes("date") || subKey.includes("suspension");
              const dateValue = formData[key][subKey]
                ? new Date(formData[key][subKey])
                : null;

              return (
                <motion.div
                  key={`${key}.${subKey}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: (index + subIndex) * 0.1,
                  }}
                >
                  <TextField
                    fullWidth
                    label={subKey
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    name={`${key}.${subKey}`}
                    type={isDateField ? "datetime-local" : "text"}
                    value={
                      isDateField &&
                      dateValue instanceof Date &&
                      !isNaN(dateValue)
                        ? dateValue.toISOString().slice(0, 16)
                        : formData[key][subKey] || ""
                    }
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </motion.div>
              );
            })
          ) : key !== "violation_code" ? (
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
                type={
                  key.includes("date") || key.includes("suspension")
                    ? "datetime-local"
                    : "text"
                }
                value={
                  (key.includes("date") || key.includes("suspension")) &&
                  formData[key] &&
                  !isNaN(new Date(formData[key]))
                    ? new Date(formData[key]).toISOString().slice(0, 16)
                    : formData[key] || ""
                }
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </motion.div>
          ) : null
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: Object.keys(formData).length * 0.1,
          }}
        >
          <FormControl fullWidth>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </FormControl>
        </motion.div>
      </form>
    </motion.div>
  );
};
LetterOfSuspension.propTypes = {
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
  violationData: PropTypes.arrayOf(PropTypes.object),
};
export default LetterOfSuspension;
