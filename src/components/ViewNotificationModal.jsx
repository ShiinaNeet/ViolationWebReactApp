import { TextField } from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";

function ViewNotificationModal({ notificationData, departments, programs }) {
  // Helper functions to map IDs to names
  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safePrograms = Array.isArray(programs) ? programs : [];
  const getDepartmentNames = (ids) => {
    if (!ids || ids.length === 0) return "None";
    return ids
      .map(
        (id) =>
          safeDepartments.find((d) => d.id === id || d._id === id)?.name ||
          safeDepartments.find((d) => d.id === id || d._id === id)
            ?.department_name ||
          id
      )
      .join(", ");
  };
  const getProgramNames = (ids) => {
    if (!ids || ids.length === 0) return "None";
    return ids
      .map(
        (id) =>
          safePrograms.find((p) => p.id === id || p._id === id)?.name ||
          safePrograms.find((p) => p.id === id || p._id === id)?.program_name ||
          id
      )
      .join(", ");
  };

  return (
    <div>
      <TextField
        margin="dense"
        label="Subject"
        variant="outlined"
        fullWidth
        value={notificationData.subject || ""}
        InputProps={{ readOnly: true }}
      />
      <TextField
        margin="dense"
        label="Category"
        variant="outlined"
        fullWidth
        value={notificationData.category || ""}
        InputProps={{ readOnly: true }}
      />
      <TextField
        margin="dense"
        label="Message"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        value={notificationData.body || ""}
        InputProps={{ readOnly: true }}
      />
      <TextField
        margin="dense"
        label="Recipients"
        variant="outlined"
        fullWidth
        value={
          notificationData.recipients && notificationData.recipients.length > 0
            ? notificationData.recipients.join(", ")
            : "None"
        }
        InputProps={{ readOnly: true }}
      />
      <TextField
        margin="dense"
        label="Send At"
        variant="outlined"
        fullWidth
        value={
          notificationData.send_at
            ? moment(notificationData.send_at).format("MMMM DD, YYYY HH:mm")
            : ""
        }
        InputProps={{ readOnly: true }}
      />
      {notificationData.target_config && (
        <div style={{ marginTop: "16px" }}>
          <TextField
            margin="dense"
            label="User Types"
            variant="outlined"
            fullWidth
            value={
              notificationData.target_config.user_types &&
              notificationData.target_config.user_types.length > 0
                ? notificationData.target_config.user_types.join(", ")
                : "None"
            }
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Departments"
            variant="outlined"
            fullWidth
            value={getDepartmentNames(
              notificationData.target_config.departments
            )}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Programs"
            variant="outlined"
            fullWidth
            value={getProgramNames(notificationData.target_config.programs)}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Exclude Departments"
            variant="outlined"
            fullWidth
            value={getDepartmentNames(
              notificationData.target_config.exclude_departments
            )}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Include All Students"
            variant="outlined"
            fullWidth
            value={
              notificationData.target_config.include_all_students ? "Yes" : "No"
            }
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Include All Admins"
            variant="outlined"
            fullWidth
            value={
              notificationData.target_config.include_all_admins ? "Yes" : "No"
            }
            InputProps={{ readOnly: true }}
          />
        </div>
      )}
    </div>
  );
}

ViewNotificationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  notificationData: PropTypes.object.isRequired,
  departments: PropTypes.array,
  programs: PropTypes.array,
};

export default ViewNotificationModal;
