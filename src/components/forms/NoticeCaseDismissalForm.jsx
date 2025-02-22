import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

const NoticeCaseDismissal = ({ studentDataToPass, alertMessageFunction}) => {
    const [formData, setFormData] = useState({
        name: studentDataToPass.fullname || "",
        effectivity_date: "",
        college:  "",
        program: studentDataToPass.course || "",
        campus: "",
        section: "",
        sr_code: studentDataToPass.srcode || "",
        year: studentDataToPass.year_and_department ? studentDataToPass.year_and_department.split(" - ")[0] : "",
        sex:  "",
        indicate_offense: "",
        reason_for_dismissal: { is_without_merit: false, others: "" },
        report_date: "",
        report_time: "",
        coordinator_discipline_head: "",
        date_signed: "",
    });
    const [coordinatorUsers, setCoordinatorUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "is_without_merit") {
        setFormData((prev) => ({
            ...prev,
            reason_for_dismissal: { ...prev.reason_for_dismissal, is_without_merit: checked },
        }));
        } else if (name === "others") {
        setFormData((prev) => ({
            ...prev,
            reason_for_dismissal: { ...prev.reason_for_dismissal, others: value },
        }));
        } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
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
        }
        finally {
        setIsLoading(false);
        }
    };
    useEffect(() => {
        console.log(studentDataToPass);
        fetchCoordinator();
        setFormData((prev) => ({
        ...prev,
        name: studentDataToPass.fullname || "",
        program: studentDataToPass.course || "",
        year: studentDataToPass.year_and_department ? studentDataToPass.year_and_department.split(" - ")[0] : "",
        sr_code: studentDataToPass.srcode || "",
        campus: "Nasugbu Campus",
        college: "Batangas State University",
        effectivity_date: new Date().toISOString().slice(0, 10),
        report_date: new Date().toISOString().slice(0, 10),
        report_time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        }));
    }, [studentDataToPass]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.name.length === 0 
            || formData.effectivity_date === "" 
            || formData.college === "" 
            || formData.program === "" 
            || formData.campus === "" 
            || formData.year === "" 
            || formData.section === "" 
            || formData.report_date === "" 
            || formData.report_time === "" 
            || formData.coordinator_discipline_head === "" 
            || formData.date_signed === "") {
            alertMessageFunction(true, "Please fill out all fields before submitting the form.", "Error");
            return;
        }
        axios.post("/form/notice_case_dismissal", formData)
        .then((response) => {
            if(response.data.status === "success"){
                alertMessageFunction(true, "Notice of Case Dismissal form submitted successfully.", "Success");
            }
            else{
                alertMessageFunction(true, "Notice of Case Dismissal form failed to submit.", "Error");
            }
        })
        .catch((error) => {
            console.error(error);
            alertMessageFunction(true, "Notice of Case Dismissal form failed to submit.", "Error");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 my-4">
      {Object.keys(formData).filter(key => key !== "coordinator_discipline_head").map((key, index) => {
          if (typeof formData[key] === "object") {
            return (
              <motion.div key={key} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
                <FormControlLabel
                  control={<Checkbox name="is_without_merit" checked={formData.reason_for_dismissal.is_without_merit} onChange={handleChange} />}
                  label="Without Merit"
                />
                <TextField
                  fullWidth
                  label="Other Reasons"
                  name="others"
                  value={formData.reason_for_dismissal.others}
                  onChange={handleChange}
                  variant="outlined"
                  className="bg-white"
                />
              </motion.div>
            );
          }
          return (
            <motion.div key={key} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
              <TextField
                fullWidth
                label={key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                name={key}
                type={key.includes("date") ? "date" : key === "report_time" ? "time" : "text"}
                value={formData[key]}
                onChange={handleChange}
                variant="outlined"
                className="bg-white"
              />
            </motion.div>
          );
        })}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: Object.keys(formData).length * 0.05 }}>
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-helper-label">Coordinator Discipline Head</InputLabel>
            <Select
            labelId="demo-simple-select-helper-label"
            label="Coordinator Discipline Head"
            id="demo-simple-select-helper"
            name="coordinator_discipline_head"
            value={formData.coordinator_discipline_head}
            onChange={handleChange}
            >
              {coordinatorUsers.filter(user => user.type === "OSD_COORDINATOR").map((coordinator) => (
                <MenuItem key={coordinator.id} value={coordinator.id}>
                  {coordinator.first_name + " " + coordinator.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </motion.div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Button type="submit" variant="outlined" color="error" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
NoticeCaseDismissal.propTypes = {
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

export default NoticeCaseDismissal;
