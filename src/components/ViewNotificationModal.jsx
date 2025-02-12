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
          variant="standard"
          color="black"
          fullWidth
          value={
            notificationData.subject.charAt(0).toUpperCase() +
            notificationData.subject.slice(1)
          }
          readOnly
        />
        <TextField
          focused
          margin="dense"
          id="standard-multiline-static"
          label="Category"
          color="black"
          variant="standard"
          fullWidth
          value={
            notificationData.category
              ? notificationData.category.charAt(0).toUpperCase() +
                notificationData.category.slice(1)
              : "N/A"
          }
          readOnly
          sx={{}}
        />
        <TextField
          focused
          margin="dense"
          id="standard-multiline-static"
          label="Body"
          color="black"
          variant="standard"
          multiline
          rows={4}
          fullWidth
          value={
            notificationData.body.charAt(0).toUpperCase() +
            notificationData.body.slice(1)
          }
          readOnly
        />
        {notificationData.is_sent == false && (
          <p className="text-red-500 text-lg">Message in Queue</p>
        )}
        {notificationData.is_sent == true &&
          notificationData.sent_to.length > 0 && (
            <p>
              Sent to the following users:{" "}
              {notificationData.sent_to.map((user, index) => (
                <strong
                  key={index}
                  className="text-lg text-red-500 cursor-pointer"
                >
                  {user +
                    (index < notificationData.sent_to.length - 1 ? ", " : "")}
                </strong>
              ))}
            </p>
          )}
        <p className="text-right w-full  text-md my-1">{formattedDate}</p>

        <Button onClick={closeModal} color="black" fullWidth>
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
