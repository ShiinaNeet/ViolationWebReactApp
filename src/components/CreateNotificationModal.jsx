import {
  Button,
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
  const [Notification, setNotification] = React.useState({
    error: false,
    body: "",
    subject: "",
    category: "",
    set_when: new Date().toISOString().slice(0, 16),
    sent_to: [],
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
    console.log("Notification: ", Notification);
    if (
      Notification.subject === "" ||
      Notification.body === "" ||
      Notification.category === "" ||
      Notification.set_when === "" ||
      Notification.sent_to.length === 0 ||
      Notification.sent_to === undefined
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
          send_at: formattedValue,
          recepients: Notification.sent_to,
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
        <FormControl fullWidth margin="dense">
          <InputLabel id="demo-simple-select-label">
            Sent to the following:
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={Notification.sent_to}
            input={<OutlinedInput label="Sent to the following:" />}
            MenuProps={MenuProps}
            onChange={(e) => {
              setNotification({ ...Notification, sent_to: e.target.value });
              console.log("Sent to:", Notification.sent_to);
            }}
          >
            <MenuItem value={"STUDENT"}>Student</MenuItem>
            <MenuItem value={"ADMIN"}>Admin</MenuItem>
            <MenuItem value={"SECURITY"}>Security Guard</MenuItem>
            <MenuItem value={"PROGRAM HEAD"}>Program Head</MenuItem>
            <MenuItem value={"DEAN"}>Dean</MenuItem>
          </Select>
        </FormControl>
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
