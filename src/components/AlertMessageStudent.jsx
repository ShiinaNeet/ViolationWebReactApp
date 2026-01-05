import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

import "../animations.css";

export default function AlertMessageStudent() {
  const [message, setMessage] = React.useState({
    subject: "",
    body: "",
    files: [],
    usertype: "student",
    recipients: [""],
    error: false,
  });

  const [isLoading, setIsLoading] = React.useState(false);
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
  const handleRecipientChange = (index, value) => {
    const newRecipients = [...message.recipients];
    newRecipients[index] = value;
    setMessage({ ...message, recipients: newRecipients });
  };
  const addRecipientField = () => {
    setMessage((prevState) => ({
      ...prevState,
      recipients: [...prevState.recipients, ""],
    }));
  };

  const sendMessage = async () => {
    setIsLoading(true);
    console.log("Message: ", message);
    // if(message.body === '' || message.violationName.length === 0 || message.email === '') {
    if (
      message.body === "" ||
      message.files.length === 0 ||
      message.recipients.length === 0 ||
      message.subject === "" ||
      message.usertype === ""
    ) {
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

    const formData = new FormData();
    message.files.forEach((file) => {
      formData.append("attachment", file);
    });
    message.recipients.forEach((recipient) => {
      formData.append("recipient", recipient);
    });

    await axios
      .post("form/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          subject: message.subject,
          body: message.body,
          usertype: message.usertype,
        },
      })
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
  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) =>
      [
        "application/pdf",
        "video/mp4",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(file.type)
    );
    setMessage((prevState) => ({
      ...prevState,
      files: [...prevState.files, ...filteredFiles],
    }));
  };

  const onRemoveItem = (index) => {
    const newFiles = message.files.filter((file, i) => i !== index);
    setMessage((prevState) => ({
      ...prevState,
      files: newFiles,
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full mx-0 h-screen">
      <div>
        <div className="py-3" style={{ fontSize: "16px" }}>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="font-bold" style={{ fontSize: "16px" }}>
              Send Email
            </label>
            <br />
          </motion.div>
        </div>
        <div className="flex flex-col gap-y-3">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <TextField
              autoFocus
              id="standard-multiline-static"
              label="Subject"
              color="primary"
              multiline
              rows={2}
              variant="outlined"
              fullWidth
              required={true}
              value={message.subject}
              onChange={(e) =>
                setMessage({ ...message, subject: e.target.value })
              }
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <TextField
              autoFocus
              id="standard-multiline-static"
              label="User Type"
              color="primary"
              multiline
              rows={2}
              variant="outlined"
              fullWidth
              required={true}
              value={message.usertype}
              onChange={(e) =>
                setMessage({ ...message, usertype: e.target.value })
              }
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <TextField
              autoFocus
              id="standard-multiline-static"
              label="Message Body"
              color="primary"
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              required={true}
              value={message.body}
              onChange={(e) => setMessage({ ...message, body: e.target.value })}
            />
          </motion.div>
          <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-1">
            {/* <div className="md:w-3/4 flex flex-col gap-y-2"> */}
            <motion.div
              className="md:w-3/4 flex flex-col gap-y-2"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              {message.recipients.map((recipient, index) => (
                <TextField
                  key={index}
                  id={`recipient-${index}`}
                  label={`Email Address ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  required
                  value={recipient}
                  size="small"
                  onChange={(e) => handleRecipientChange(index, e.target.value)}
                  color="primary"
                />
              ))}
            </motion.div>
            {/* </div> */}
            <motion.div
              className="h-full w-full md:w-1/4 flex items-center justify-center"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outlined"
                onClick={addRecipientField}
                color="primary"
                className="w-full h-full"
              >
                Add More User
              </Button>
            </motion.div>
          </div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              {...getRootProps({ className: "dropzone" })}
              className="border-solid border rounded-sm border-gray-400 p-4 text-center"
            >
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
              <em>
                (Only PDF, MP4, DOCX, Word, and Excel files will be accepted)
              </em>
            </div>
            <div>
              {message.files.map((file, index) => (
                <div key={index} className="flex w-full h-fit whitespace-pre">
                  <label className="py-2">{file.name + "  "}</label>
                  <label
                    className="py-2 px-2 rounded-sm text-black hover:bg-gray-100"
                    onClick={() => onRemoveItem(index)}
                  >
                    Remove
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="my-2 flex justify-end">
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={sendMessage}
          size="medium"
          disabled={isLoading}
          color="primary"
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
      <Snackbar
        open={alertMessage.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        className="snackbar-bottom"
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
