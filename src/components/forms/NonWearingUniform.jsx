import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import PropTypes from "prop-types";

const NonWearingUniformForm = ({
  studentDataToPass,
  alertMessageFunction,
  programData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    program: "",
    sr_code: "",
    campus: "",
    year_section: "",
    check: {
      fieldwork_workshop: false,
      prolonged_standing: false,
      foreign_student_on_short_special_course: false,
      pregnant: false,
      special_cases: false,
      force_majeure: false,
      intern: false,
      others: "",
    },
    requested_by: { name: "", date: new Date().toISOString().slice(0, 16) },
    reviewed_by: { name: "", date: new Date().toISOString().slice(0, 16) },
    approved_by: { name: "", date: new Date().toISOString().slice(0, 16) },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      check: { ...prev.check, [name]: checked },
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: studentDataToPass.fullname || "",
      college: "Batangas State University",
      program: studentDataToPass.course || "",
      sr_code: studentDataToPass.srcode || "",
      campus: "Nasugbu Campus",
      year_section: studentDataToPass.year_and_department
        ? studentDataToPass.year_and_department.split(" - ")[0]
        : "",
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
      .post("/form/non_wearing_uniform", updatedFormData)
      .then((response) => {
        if (response.data.status === "success") {
          alertMessageFunction(
            true,
            "Non Wearing Uniform Form submitted successfully.",
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

  const handleNestedChange = (e, field) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [name]: value },
    }));
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" max-w-lg mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {Object.keys(formData).map(
          (key, index) =>
            key !== "check" &&
            key !== "requested_by" &&
            key !== "reviewed_by" &&
            key !== "approved_by" && (
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
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  color="error"
                />
              </motion.div>
            )
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Object.keys(formData.check).map((key) =>
            key !== "others" ? (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={formData.check[key]}
                    onChange={handleCheckboxChange}
                    name={key}
                    color="error"
                  />
                }
                label={key.replace(/_/g, " ").toUpperCase()}
              />
            ) : (
              <TextField
                key={key}
                fullWidth
                label="Others"
                name={key}
                value={formData.check[key]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    check: { ...prev.check, [key]: e.target.value },
                  }))
                }
                color="error"
              />
            )
          )}
        </Box>
        {["requested_by", "reviewed_by", "approved_by"].map((field, index) => (
          <div key={field} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TextField
                fullWidth
                label={`${field
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())} Name`}
                name="name"
                value={formData[field].name}
                onChange={(e) => handleNestedChange(e, field)}
                required
                color="error"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
            >
              <TextField
                fullWidth
                label={`${field
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())} Date`}
                name="date"
                type="datetime-local"
                value={formData[field].date}
                onChange={(e) => handleNestedChange(e, field)}
                required
                color="error"
              />
            </motion.div>
          </div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
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

NonWearingUniformForm.propTypes = {
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

export default NonWearingUniformForm;
