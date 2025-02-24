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

const CallSlipForm = ({ studentDataToPass, alertMessageFunction }) => {
  const [formData, setFormData] = useState({
    name: "",
    effectivity_date: "",
    college: "",
    program: "",
    date: "",
    campus: "",
    year: "",
    section: "",
    report_date: "",
    report_time: "",
    coordinator_discipline_head: "",
    date_signed: "",
  });
  const [coordinatorUsers, setCoordinatorUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchCoordinator();
    setFormData((prev) => ({
      ...prev,
      name: studentDataToPass.fullname || "",
      program: studentDataToPass.course || "",
      college: "Batangas State University",
      year: studentDataToPass.year_and_department
        ? studentDataToPass.year_and_department.split(" - ")[0]
        : "",
      campus: "Batangas State University - Nasugbu Campus",
      report_date: new Date().toISOString().slice(0, 16),
      report_time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      effectivity_date: new Date().toISOString().slice(0, 16),
      date_signed: new Date().toISOString().slice(0, 16),
    }));
  }, [studentDataToPass]);

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
  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log(formData);
    if (Object.values(formData).some((value) => value === "")) {
      alertMessageFunction(true, "Error", "Please fill out all fields.");
      return;
    }
    axios
      .post("/form/callslip", formData)
      .then((response) => {
        if (response.data.status === "success") {
          alertMessageFunction(
            true,
            "Call Slip Form submitted successfully.",
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
            key !== "coordinator_discipline_head" && (
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
                    key.includes("date")
                      ? "date"
                      : key === "report_time"
                      ? "time"
                      : "text"
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
              Coordinator Discipline Head
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              label="Coordinator Discipline Head"
              id="demo-simple-select-helper"
              name="coordinator_discipline_head"
              value={formData.coordinator_discipline_head}
              onChange={handleChange}
              inputProps={{ "aria-label": "Without label" }}
              required
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
            delay: (Object.keys(formData).length + 1) * 0.1,
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
CallSlipForm.propTypes = {
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
};

export default CallSlipForm;
