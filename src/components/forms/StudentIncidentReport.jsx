import { useState, useEffect } from "react";
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

const StudentIncidentReport = ({
  studentDataToPass,
  alertMessageFunction,
  programData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    college: "",
    campus: "",
    sr_code: "",
    program: "",
    year_section: "",
    incident: "",
    remarks: "",
    reported_by: "",
    designation: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: studentDataToPass.fullname || "",
      program: studentDataToPass.course || "",
      sr_code: studentDataToPass.srcode || "",
      college: "Batangas State University",
      campus: "Nasugbu Campus",
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    console.log(studentDataToPass);
  }, [studentDataToPass]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value === "")) {
      alertMessageFunction(true, "Error", "Please fill out all fields.");
      return;
    }
    const ProgramIdToSubmit = programData.find(
      (program) => program.name === formData.program
    );
    if (!ProgramIdToSubmit) {
      alertMessageFunction(true, "Error", "Invalid program.");
      return;
    }
    const updatedFormData = {
      ...formData,
      program: ProgramIdToSubmit.id,
    };
    try {
      const response = await axios.post(
        "/form/student_incident_report",
        updatedFormData
      );
      if (response.data.status === "success") {
        alertMessageFunction(
          true,
          "Incident Report submitted successfully.",
          "Success"
        );
      } else {
        alertMessageFunction(
          true,
          "An error occurred while submitting the form.",
          "Error"
        );
      }
    } catch (error) {
      console.error(error);
      alertMessageFunction(
        true,
        "An error occurred while submitting the form.",
        "Error"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:w-[500px] w-full mx-auto bg-white"
    >
      <form onSubmit={handleSubmit} className="space-y-4 w-full mt-4">
        {Object.keys(formData).map(
          (key, index) =>
            key !== "program" && (
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
                    key === "date" ? "date" : key === "time" ? "time" : "text"
                  }
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  color="error"
                />
              </motion.div>
            )
        )}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: Object.keys(formData).length * 0.1,
          }}
        >
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-helper-label" color="error">
              Program
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              label="Program"
              id="demo-simple-select-helper"
              value={formData.program}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  program: e.target.value,
                })
              }
              inputProps={{ "aria-label": "Without label" }}
              required
              color="error"
            >
              {programData.map((program) => (
                <MenuItem key={program.id} value={program.name}>
                  {program.name}
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
          <Button type="submit" variant="outlined" color="error" fullWidth>
            Submit
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

StudentIncidentReport.propTypes = {
  studentDataToPass: PropTypes.shape({
    fullname: PropTypes.string,
    course: PropTypes.string,
    year_and_department: PropTypes.string,
    srcode: PropTypes.string,
  }).isRequired,
  alertMessageFunction: PropTypes.func.isRequired,
  programData: PropTypes.array.isRequired,
};

export default StudentIncidentReport;
