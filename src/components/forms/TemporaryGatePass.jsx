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
import axios from "axios";
import PropTypes from "prop-types";

const TemporaryGatePass = ({
  studentDataToPass,
  alertMessageFunction,
  programData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    program: "",
    date: "",
    sr_code: "",
    year_section: "",
    remarks: "",
    valid_until: "",
    issued_by: {
      name: "",
      date: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: studentDataToPass.fullname || "",
      date: new Date().toISOString().slice(0, 16),
      sr_code: studentDataToPass.srcode || "",
      college: "Batangas State University",
      program: studentDataToPass.course || "",
      year_section: studentDataToPass.year_and_department
        ? studentDataToPass.year_and_department.split(" - ")[0]
        : "",
      valid_until: new Date().toISOString().slice(0, 16),
      report_date: new Date().toISOString().slice(0, 16),
      issued_by: {
        name: "",
        date: new Date().toISOString().slice(0, 16),
      },
    }));
  }, [studentDataToPass]);

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log(formData);
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

    axios
      .post("/form/temporary_gatepass", updatedFormData)
      .then((response) => {
        if (response.data.status === "success") {
          alertMessageFunction(
            true,
            "Temporary Gate Pass Form submitted successfully.",
            "Success"
          );
        } else {
          alertMessageFunction(
            true,
            "An error occurred while submitting the form.",
            "Error"
          );
        }
      })
      .catch((error) => {
        console.error(error);
        alertMessageFunction(
          true,
          "An error occurred while submitting the form.",
          "Error"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
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
            key !== "program" &&
            key !== "issued_by" &&
            key !== "coordinator_discipline_head" && (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TextField
                  fullWidth
                  color="primary"
                  label={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  name={key}
                  type={
                    key.includes("date")
                      ? "datetime-local"
                      : key === "report_time"
                      ? "time"
                      : "text"
                  }
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            )
        )}
        {/* Manually add fields for issued_by.name and issued_by.date */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: Object.keys(formData).length * 0.1,
          }}
        >
          <TextField
            fullWidth
            color="primary"
            label="Issued By (Name)"
            name="issued_by_name"
            value={formData.issued_by.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                issued_by: { ...prev.issued_by, name: e.target.value },
              }))
            }
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: (Object.keys(formData).length + 1) * 0.1,
          }}
        >
          <TextField
            fullWidth
            color="primary"
            label="Issued By (Date)"
            name="issued_by_date"
            type="datetime-local"
            value={formData.issued_by.date}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                issued_by: { ...prev.issued_by, date: e.target.value },
              }))
            }
            required
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: Object.keys(formData).length * 0.1,
          }}
        >
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-helper-label" color="primary">
              Program
            </InputLabel>
            <Select
              color="primary"
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
            delay: (Object.keys(formData).length + 1) * 0.1,
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            color="primary"
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
TemporaryGatePass.propTypes = {
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
  programData: PropTypes.array.isRequired,
};

export default TemporaryGatePass;
