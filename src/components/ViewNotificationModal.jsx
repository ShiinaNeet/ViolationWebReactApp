import { Button, TextField } from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

function ViewNotificationModal({ closeModal, notificationData }) {
  const formattedDate = moment(notificationData.set_at).format(
    "MMMM Do YYYY, h:mm a"
  );
  return (
    <div>
      <div>
        <TextField
          focused
          margin="dense"
          id="standard-multiline-static"
          label="Subject"
          variant="filled"
          color="error"
          fullWidth
          value={notificationData.subject}
          readOnly
        />
        <TextField
          focused
          margin="dense"
          id="standard-multiline-static"
          label="Category"
          color="error"
          variant="filled"
          multiline
          rows={2}
          fullWidth
          value={notificationData.category}
          readOnly
        />
        <TextField
          focused
          margin="dense"
          id="standard-multiline-static"
          label="Body"
          color="error"
          variant="filled"
          multiline
          rows={4}
          fullWidth
          value={notificationData.body}
          readOnly
        />
        {notificationData.is_sent == false && (
          <p className="text-red-500 text-sm">Message in Queue</p>
        )}
        {notificationData.is_sent == true &&
          notificationData.sent_to.length > 0 && (
            <p>
              Sent to the following users:{" "}
              {notificationData.sent_to.map((user, index) => (
                <strong
                  key={index}
                  className="text-sm text-red-500 cursor-pointer"
                >
                  {user +
                    (index < notificationData.sent_to.length - 1 ? ", " : "")}
                </strong>
              ))}
            </p>
          )}
        <p className="text-right w-full text-red-400 text-sm">
          {formattedDate}
        </p>

        <Button onClick={closeModal} color="error" fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
}

ViewNotificationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  notificationData: PropTypes.object.isRequired,
};

export default ViewNotificationModal;
