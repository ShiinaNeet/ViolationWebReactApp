import React, { useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SendIcon from "@mui/icons-material/Send";
import formatDate from "../utils/moment";
import {
  Alert,
  AlertTitle,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
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

export default function AlertMessageStudent({ open, handleClose, data }) {
  const theme = useTheme();
  const [message, setMessage] = React.useState({
    body: "",
    fullName: "",
    violationName: [],
    email: "",
    userid: "",
    date: formatDate(new Date(), "MMMM D, YYYY"),
    error: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [violations, setViolations] = React.useState([]);
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "success",
  });
  const vertical = "bottom";
  const horizontal = "right";
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertMessage({ open: false });
  };
  const handleViolation = () => {
    let violationsname = "";
    message.violationName.forEach((element) => {
      violationsname += element.name + ", ";
    });
    return violationsname;
  };
  const sendMessage = async () => {
    setIsLoading(true);
    // if(message.body === '' || message.violationName.length === 0 || message.email === '') {
    if (message.body === "" || message.violationName.length === 0) {
      setMessage({ ...message, error: true });
      setAlertMessage({
        open: true,
        title: "Uh oh!",
        message: "All fields are required!",
        variant: "info",
      });
      setIsLoading(false);
      return;
    }
    // setAlertMessage({open:true, title: 'Success', message: 'Email was sent succesfully!', variant: 'success'});
    await axios
      .post(
        "/email/send/violation",
        {
          userid: data.userid,
          message: message.body,
          violation_name: handleViolation(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Email was sent succesfully!");
          setAlertMessage({
            open: true,
            title: "Success",
            message: "Email was sent succesfully!",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          console.log("Failed to send email: ", response.data.message);
          setAlertMessage({
            open: true,
            title: "Error Occured!",
            message: response.data.message,
            variant: "error",
          });
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setIsLoading(false);
        setAlertMessage({
          open: true,
          title: "Error Occured!",
          message: "Please try again later.",
          variant: "error",
        });
      });
  };

  useEffect(() => {
    if (data) {
      setMessage({
        ...message,
        fullName: data.fullname,
        userid: data.userid,
        email: data.email ? data.email : "",
      });
      setViolations(data.violations);
    }
  }, [data]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMessage({
      ...message,
      violationName: typeof value === "string" ? value.split(",") : value,
    });
    // console.log(message.violationName);
  };
  return (
    <div className="w-full mx-0">
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <div className="p-2 text-2xl">
          <label className="font-bold">Dear {message.fullName},</label>
          <br />
          {/* <label htmlFor="" className='my-5 text-base'> <strong className='font-bold'>Violation: </strong> {message.violations}</label> */}
          <InputLabel id="demo-multiple-name-label">Violation:</InputLabel>
          <Select
            color="error"
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            value={message.violationName}
            error={message.error && message.violationName.length === 0}
            onChange={handleChange}
            className="w-full text-black"
            // input={<OutlinedInput label="Name" />}
            multiple
            MenuProps={MenuProps}
          >
            {violations.map((violation, index) => (
              <MenuItem
                key={index}
                value={violation}
                style={getStyles(violation, message.violationName, theme)}
              >
                {violation.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="p-2 flex flex-col gap-y-3">
          <TextField
            id="standard-multiline-static"
            label="Email Address"
            variant="standard"
            fullWidth
            readOnly={true}
            error={message.error}
            helperText={message.error ? "Email Address is required" : ""}
            value={message.email}
            className="cursor-none"
            color="error"
          />
          <TextField
            autoFocus
            id="standard-multiline-static"
            label="Message"
            color="error"
            multiline
            rows={6}
            variant="standard"
            fullWidth
            required={true}
            error={message.error}
            helperText={message.error ? "Message is required" : ""}
            value={message.body}
            onChange={(e) => setMessage({ ...message, body: e.target.value })}
          />
          <label htmlFor="" className="flex justify-start text-base ">
            {message.date}
          </label>
        </div>
        <div className="p-2 flex justify-end">
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={sendMessage}
            size="small"
            disabled={isLoading}
            color="error"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
          <Button onClick={handleClose} color="error" size="large">
            Cancel
          </Button>
        </div>
      </Dialog>
      <Snackbar
        open={alertMessage.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertMessage.variant}
          sx={{ width: "100%" }}
        >
          <AlertTitle>{alertMessage.title}</AlertTitle>
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
