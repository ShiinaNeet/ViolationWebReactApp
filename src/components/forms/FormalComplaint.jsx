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

const FormalComplaint = ({ studentDataToPass, alertMessageFunction }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    coordinator_discipline_head: "",
    subject_of_complaint: {
      name: "",
      college: "",
      year_section: "",
    },
    norms_of_conduct_violated_by_the_student: "",
    narration_of_facts_and_circumstances: "",
    final_word: "",
    name_of_complainant: "",
    contact_no_of_complainant: "",
    email_address_of_complainant: "",
    witnesses: [],
    enclosed_evidences: [],
  });
  const [coordinatorUsers, setCoordinatorUsers] = useState([]);
  const [witnessInput, setWitnessInput] = useState("");
  const [evidenceInput, setEvidenceInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchCoordinator();
    setFormData((prev) => ({
      ...prev,
      subject_of_complaint: {
        name: studentDataToPass.fullname || "wwww",
        college: "Batangas State University",
        year_section: studentDataToPass.year_and_department || "",
      },
    }));
    console.log("Student Form", formData);
  }, [studentDataToPass, formData]);

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
    console.log("Form Data", formData);
    axios
      .post("/form/formal_complaint", formData)
      .then((response) => {
        if (response.data.status === "success") {
          alertMessageFunction(
            true,
            "Formal Complaint Form submitted successfully.",
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
  const handleAddWitness = () => {
    if (witnessInput) {
      setFormData({
        ...formData,
        witnesses: [...formData.witnesses, witnessInput],
      });
      setWitnessInput("");
    }
  };
  const handleRemoveWitness = (index) => {
    setFormData({
      ...formData,
      witnesses: formData.witnesses.filter((_, i) => i !== index),
    });
  };
  const handleAddEvidence = () => {
    if (evidenceInput) {
      setFormData({
        ...formData,
        enclosed_evidences: [...formData.enclosed_evidences, evidenceInput],
      });
      setEvidenceInput("");
    }
  };
  const handleRemoveEvidence = (index) => {
    setFormData({
      ...formData,
      enclosed_evidences: formData.enclosed_evidences.filter(
        (_, i) => i !== index
      ),
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:w-[500px] w-full mx-auto "
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        {Object.keys(formData).map(
          (key, index) =>
            key !== "witnesses" &&
            key !== "enclosed_evidences" &&
            key !== "subject_of_complaint" &&
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
                  type={key.includes("date") ? "datetime-local" : "text"}
                  value={typeof formData[key] === "string" ? formData[key] : ""}
                  onChange={handleChange}
                  required
                  color="error"
                />
              </motion.div>
            )
        )}
        {Object.keys(formData.subject_of_complaint).map((field, index) => (
          <motion.div
            key={field}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TextField
              fullWidth
              label={field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              name={field}
              type="text"
              value={formData.subject_of_complaint[field]}
              onChange={handleChange}
              required
              color="error"
            />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
        >
          <div className="flex">
            <TextField
              fullWidth
              label="Witness"
              value={witnessInput}
              onChange={(e) => setWitnessInput(e.target.value)}
              color="error"
            />
            <Button onClick={handleAddWitness} color="error">
              Add
            </Button>
          </div>

          <ul className="space-y-2 my-2 p-1">
            <label style={{ fontSize: "16px" }}>
              {formData.witnesses.length > 0 ? "Click the Item to Remove" : ""}
            </label>
            {formData.witnesses.map((witness, index) => (
              <li
                key={index}
                className="cursor-pointer border border-solid p-2 border-red-400"
                onClick={() => handleRemoveWitness(index)}
              >
                {`${index + 1}. ${witness}`}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
        >
          <div className="flex">
            <TextField
              fullWidth
              label="Enclosed Evidence"
              value={evidenceInput}
              onChange={(e) => setEvidenceInput(e.target.value)}
              color="error"
            />
            <Button onClick={handleAddEvidence} color="error">
              Add
            </Button>
          </div>
          <ul className="space-y-2 my-2 p-1">
            <label style={{ fontSize: "16px" }}>
              {formData.enclosed_evidences.length > 0
                ? "Click the Item to Remove"
                : ""}
            </label>
            {formData.enclosed_evidences.map((evidence, index) => (
              <li
                key={index}
                className="cursor-pointer border border-solid p-2 border-red-400"
                onClick={() => handleRemoveEvidence(index)}
              >
                {`${index + 1}. ${evidence}`}
              </li>
            ))}
          </ul>
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

FormalComplaint.propTypes = {
  studentDataToPass: PropTypes.shape({
    fullname: PropTypes.string,
    year_and_department: PropTypes.string,
  }).isRequired,
  alertMessageFunction: PropTypes.func.isRequired,
};

export default FormalComplaint;
