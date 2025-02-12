import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  alpha,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import axios from "axios";
import moment from "moment";
import CreateNotificationModal from "./CreateNotificationModal";
import ViewNotificationModal from "./ViewNotificationModal";
import { red } from "@mui/material/colors";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: `0px 10px 6px rgba(0, 0, 0, 0.1)`,
}));

export default function NotificationList() {
  const vertical = "bottom";
  const horizontal = "right";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  // Fetch notifications from the API
  const fetchNotifications = () => {
    setIsLoading(true);
    try {
      axios
        .get(`notification`, {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            skip: 0,
            limit: 100,
          },
        })
        .then((response) => {
          if (response.data.status === "success") {
            setNotifications(response.data.data);
            setFilteredNotifications(response.data.data);
            console.log("Notifications fetched:", response.data.data); // Check if this logs the correct data
            applyFilter();
          }
        });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filter to notifications
  const applyFilter = () => {
    const currentTimestamp = Date.now();
    if (filteredNotifications.length == 0) return;
    if (filter === "All") {
      setFilteredNotifications(notifications);
      console.log("Filtering all");
    } else if (filter === "Sent") {
      setFilteredNotifications(
        notifications.filter(
          (notif) => Date.parse(notif.sent_at) < currentTimestamp
        )
      );
    } else if (filter === "Queued") {
      setFilteredNotifications(
        notifications.filter(
          (notif) => Date.parse(notif.sent_at) >= currentTimestamp
        )
      );
    }
    console.log("Filtering");
  };

  // Fetch notifications on initial render
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Apply filter whenever notifications or filter state changes
  useEffect(() => {
    applyFilter();
  }, [notifications, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
  };
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage({ ...alertMessage, open: false });
  };
  const sendAlert = (title, message) => {
    setAlertMessage({
      open: true,
      title: title,
      message: message,
    });
  };
  const axiosDeleteNotification = async () => {
    console.log("Deleting notification:", selectedNotification);
    axios
      .delete("notification", { params: { id: selectedNotification.id } })
      .then((response) => {
        if (response.data.status === "success") {
          sendAlert("Success", "Notification deleted successfully!");
          fetchNotifications();
        } else {
          sendAlert("Error", "Please try again later");
        }
      })
      .catch((error) => {
        console.error(error);
        sendAlert("Error", error.message);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
      });
  };
  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  return (
    <div className="">
      <div className="flex flex-row justify-between my-2">
        <h1 className="text-2xl text-red-600 py-3">Notifications</h1>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <StyledToolbar variant="dense" disableGutters>
          <TableContainer component={Paper} className="">
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
              <TableHead sx={{ padding: "10px" }}>
                <TableRow className="slide-in-down-visible">
                  <TableCell onClick={() => fetchNotifications()} size="small">
                    <div className="hover:bg-gray-200 hover:rounded-md py-2 px-3 rounded-sm flex items-start w-fit">
                      <ReplayIcon fontSize="small" />
                    </div>
                  </TableCell>
                  <TableCell size="small">
                    <div className="hover:bg-gray-200 hover:rounded-md rounded-sm flex items-start w-fit">
                      <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        color="black"
                        sx={{ fontWeight: "bold", fontSize: "auto" }}
                      >
                        Compose
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell size="small"></TableCell>
                  <TableCell
                    size="large"
                    align="center"
                    sx={{ textSizeAdjust: "auto", fontWeight: "bold" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    size="large"
                    align="center"
                    sx={{ textSizeAdjust: "auto", fontWeight: "bold" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNotifications
                  ? filteredNotifications.map((notif, idx) => (
                      // <Tooltip
                      //   title={"Click to view " + notif.subject}
                      //   key={idx}
                      // >
                      <TableRow
                        key={idx}
                        className=" border-gray-200 w-full border-separate hover:bg-gray-100 hover:cursor-pointer slide-in-down-visible"
                        sx={{ paddingY: 2 }} // Increase vertical padding
                      >
                        <TableCell className="w-[10px] sm:w-[20px] md:w-[30px] lg:w-[40px] xl:w-[50px] 2xl:w-[60px] border text-center">
                          <p> {idx + 1}.</p>
                        </TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-800 md:text-lg font-semibold font-sans w-1/4 border ">
                          <p className="font-semibold">
                            {truncateText(notif.subject, 50)}
                          </p>
                        </TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-800 w-1/4 overflow-hidden  border">
                          <p className="font-thin">
                            <strong className="font-semibold text-">
                              {truncateText(notif.category, 20)}
                            </strong>{" "}
                            - {truncateText(notif.body, 50)}
                          </p>
                        </TableCell>
                        <TableCell
                          className="px-4 py-2 text-sm text-gray-800 w-1/4 "
                          align="center"
                        >
                          {moment(notif.send_at).format("MMMM DD, YYYY")}
                        </TableCell>
                        <TableCell className="w-fit" align="center">
                          <Button
                            color="error"
                            variant="text"
                            onClick={() => {
                              setSelectedNotification(notif);
                              setIsViewModalOpen(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            color="error"
                            variant="text"
                            onClick={() => {
                              setIsDeleteModalOpen(true);
                              setSelectedNotification(notif);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                      // </Tooltip>
                    ))
                  : ""}
                {filteredNotifications.length === 0 && (
                  <TableRow fullWidth align="center">
                    <TableCell
                      colSpan={5}
                      className="text-center"
                      align="center"
                    >
                      No Notifications.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledToolbar>
      )}

      <Dialog
        open={isCreateModalOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>New Message</DialogTitle>
        <DialogContent>
          <CreateNotificationModal
            closeModal={handleClose}
            sendAlert={sendAlert}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isViewModalOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogContent>
          <ViewNotificationModal
            closeModal={handleClose}
            notificationData={selectedNotification}
            Snackbar={alertMessage}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>Delete Notification?</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this notification?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={axiosDeleteNotification} color="error">
            Delete
          </Button>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isViewModalOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogContent>
          <ViewNotificationModal
            closeModal={handleClose}
            notificationData={selectedNotification}
            Snackbar={alertMessage}
          />
        </DialogContent>
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
          icon={false}
          severity="info"
          sx={{ width: "100%" }}
        >
          <AlertTitle>{alertMessage.title}</AlertTitle>
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
