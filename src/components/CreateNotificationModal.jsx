import { Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import PropTypes from "prop-types";

function CreateNotificationModal({ closeModal, sendAlert }) {
  const [Notification, setNotification] = React.useState({
    error: false,
    body: "",
    subject: "",
    category: "",
    set_when: new Date().toISOString().slice(0, 16),
  });
  const formatToMicroseconds = (dateTime) => {
    const [date, time] = dateTime.split("T");
    return `${date}T${time}:00.000000`;
  };
  const handleDateTimeChange = (e) => {
    setNotification({ ...Notification, set_when: e.target.value });
    console.log("Formatted value: ", e.target.value);
  };
  const sendNotification = () => {
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
      .post("/notification", [], {
        params: {
          subject: Notification.subject,
          body: Notification.body,
          category: Notification.category,
          set_when: formattedValue,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
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
          "Error occured!",
          "Something went wrong while sending the notification"
        );
      })
      .finally(() => {
        closeModal();
      });
    // console.log(
    //   "Converted using formattomicrosecond function: ",
    //   formattedValue
    // );
  };
  return (
    <div>
      {/* <h1 className="text-xl font-semibold">Queue Notification</h1> */}
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
        <Button onClick={sendNotification} color="error" fullWidth>
          Send Notification
        </Button>
        <Button onClick={closeModal} color="error" fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
}
CreateNotificationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  sendAlert: PropTypes.func,
};

export default CreateNotificationModal;
