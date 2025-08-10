import {
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React from "react";
import PropTypes from "prop-types";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function CreateNotificationModal({ closeModal, sendAlert }) {
  // State for departments and programs
  const [departments, setDepartments] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);

  const [Notification, setNotification] = React.useState({
    error: false,
    body: "",
    subject: "",
    category: "",
    set_when: new Date().toISOString().slice(0, 16),
    target_config: {
      user_types: [], // e.g., ["STUDENT", "ADMIN"]
      departments: [], // ids of departments
      programs: [], // ids of programs
      exclude_departments: [], // ids of departments to exclude
      include_all_students: false, // whether to include all students
      include_all_admins: false, // whether to include all admins
    },
  });
  React.useEffect(() => {
    axios
      .get("/department", {
        params: { skip: 0, limit: 100 },
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => setDepartments(res.data.data))
      .catch(() => setDepartments([]));
    axios
      .get("/progams", {
        params: { skip: 0, limit: 100 },
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => setPrograms(res.data.data))
      .catch(() => setPrograms([]));
  }, []);
  const formatToMicroseconds = (dateTime) => {
    const [date, time] = dateTime.split("T");
    return `${date}T${time}:00.000000`;
  };
  const handleDateTimeChange = (e) => {
    setNotification({ ...Notification, set_when: e.target.value });
    console.log("Formatted value: ", e.target.value);
  };
  const sendNotification = () => {
    console.log("Notification: ", Notification);
    if (
      Notification.subject === "" ||
      Notification.body === "" ||
      Notification.category === "" ||
      Notification.set_when === ""
    ) {
      setNotification({ ...Notification, error: true });
      return;
    }
    const formattedValue = formatToMicroseconds(Notification.set_when);
    axios
      .post(
        "/notification",
        {
          subject: Notification.subject,
          body: Notification.body,
          category: Notification.category,
          recipients: Notification.target_config.user_types, // or another array for recipients
          target_config: Notification.target_config,
          send_at: formattedValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data.status === "success") {
          console.log("Notification sent successfully");
          sendAlert("Success", "Notification sent successfully");
        }
        console.log(response);
      })
      .catch((error) => {
        console.error("There was an error sending the notification!", error);
        sendAlert(
          "Error occurred!",
          "Something went wrong while sending the notification"
        );
      })
      .finally(() => {
        closeModal();
      });
  };
  return (
    <div>
      <TextField
        margin="dense"
        id="standard-multiline-static"
        label="Subject"
        color="error"
        multiline
        rows={2}
        fullWidth
        required={true}
        error={Notification.error}
        helperText={Notification.error ? "Subject is required" : ""}
        value={Notification.subject}
        onChange={(e) =>
          setNotification({ ...Notification, subject: e.target.value })
        }
      />
      <TextField
        margin="dense"
        id="standard-multiline-static"
        label="Message"
        color="error"
        multiline
        rows={6}
        fullWidth
        required={true}
        error={Notification.error}
        helperText={Notification.error ? "Notification body is required" : ""}
        value={Notification.body}
        onChange={(e) =>
          setNotification({ ...Notification, body: e.target.value })
        }
      />
      <TextField
        margin="dense"
        id="standard-multiline-static"
        label="Category"
        color="error"
        fullWidth
        required={true}
        error={Notification.error}
        helperText={Notification.error ? "Category is required" : ""}
        value={Notification.category}
        onChange={(e) =>
          setNotification({ ...Notification, category: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Send Notification At"
        type="datetime-local"
        color="error"
        fullWidth
        required={true}
        error={Notification.error}
        helperText={Notification.error ? "Notification is required" : ""}
        value={Notification.set_when} // Display in a valid format for datetime-local
        onChange={handleDateTimeChange}
      />
      {/* Arrange Target Config Inputs in 2 Columns */}
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <FormControl fullWidth margin="dense">
            <InputLabel>User Types</InputLabel>
            <Select
              multiple
              value={Notification.target_config.user_types}
              onChange={(e) =>
                setNotification({
                  ...Notification,
                  target_config: {
                    ...Notification.target_config,
                    user_types: e.target.value,
                  },
                })
              }
              input={<OutlinedInput label="User Types" />}
              MenuProps={MenuProps}
            >
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="SECURITY">Security Guard</MenuItem>
              <MenuItem value="PROGRAM HEAD">Program Head</MenuItem>
              <MenuItem value="DEAN">Dean</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Departments</InputLabel>
            <Select
              multiple
              value={Notification.target_config.departments}
              onChange={(e) =>
                setNotification({
                  ...Notification,
                  target_config: {
                    ...Notification.target_config,
                    departments: e.target.value,
                  },
                })
              }
              input={<OutlinedInput label="Departments" />}
              MenuProps={MenuProps}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id || dept._id} value={dept.id || dept._id}>
                  {dept.name || dept.department_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Programs</InputLabel>
            <Select
              multiple
              value={Notification.target_config.programs}
              onChange={(e) =>
                setNotification({
                  ...Notification,
                  target_config: {
                    ...Notification.target_config,
                    programs: e.target.value,
                  },
                })
              }
              input={<OutlinedInput label="Programs" />}
              MenuProps={MenuProps}
            >
              {programs.map((prog) => (
                <MenuItem key={prog.id || prog._id} value={prog.id || prog._id}>
                  {prog.name || prog.program_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <FormControl fullWidth margin="dense">
            <InputLabel>Exclude Departments</InputLabel>
            <Select
              multiple
              value={Notification.target_config.exclude_departments}
              onChange={(e) =>
                setNotification({
                  ...Notification,
                  target_config: {
                    ...Notification.target_config,
                    exclude_departments: e.target.value,
                  },
                })
              }
              input={<OutlinedInput label="Exclude Departments" />}
              MenuProps={MenuProps}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id || dept._id} value={dept.id || dept._id}>
                  {dept.name || dept.department_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            margin="dense"
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Notification.target_config.include_all_students}
                onChange={(e) =>
                  setNotification({
                    ...Notification,
                    target_config: {
                      ...Notification.target_config,
                      include_all_students: e.target.checked,
                    },
                  })
                }
              />
              <label className="">Include All Students</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Notification.target_config.include_all_admins}
                onChange={(e) =>
                  setNotification({
                    ...Notification,
                    target_config: {
                      ...Notification.target_config,
                      include_all_admins: e.target.checked,
                    },
                  })
                }
              />
              <label>Include All Admins</label>
            </div>
          </FormControl>
        </div>
      </div>

      <DialogActions sx={{ padding: "0", marginY: "3px" }}>
        <Button onClick={sendNotification} color="error">
          Send Notification
        </Button>
        <Button onClick={closeModal} color="error">
          Cancel
        </Button>
      </DialogActions>
    </div>
  );
}
CreateNotificationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  sendAlert: PropTypes.func,
};

export default CreateNotificationModal;
