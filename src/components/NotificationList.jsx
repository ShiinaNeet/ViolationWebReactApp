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
  Snackbar,
  styled,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Toolbar,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import axios from "axios";
import moment from "moment";
import CreateNotificationModal from "./CreateNotificationModal";
import ViewNotificationModal from "./ViewNotificationModal";
import { AnimatePresence, motion } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);
  const [filter] = useState("All");
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  // Fetch notifications from the API
  // Apply filter to notifications
  const applyFilter = () => {
    const currentTimestamp = Date.now();
    if (filter === "All") {
      setFilteredNotifications(notifications);
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
  const fetchNotifications = () => {
    try {
      setIsLoading(true);
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
          }
        });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
      applyFilter();
    }
  };
  // Fetch notifications on initial render
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Apply filter whenever notifications or filter state changes
  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, filter]);
  return (
    <>
      <div className="w-full h-full mx-auto">
        <AnimatePresence>
          <motion.div
            key="header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h1 className="text-2xl text-red-600 py-3">Notifications</h1>
          </motion.div>
        </AnimatePresence>
        <StyledToolbar variant="dense" disableGutters>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <AnimatePresence>
              <motion.thead
                key="table-head"
                initial={{ opacity: 0, y: -10 }} // Slide down animation
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TableRow sx={{ width: "100%" }}>
                  <TableCell onClick={() => fetchNotifications()} size="small">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="hover:bg-gray-200 hover:rounded-md py-2 px-3 rounded-sm flex items-start w-fit"
                      onClick={() => fetchNotifications()}
                    >
                      <ReplayIcon fontSize="small" />
                    </motion.div>
                  </TableCell>
                  <TableCell size="small">
                    <div className="hover:bg-gray-200 hover:rounded-md rounded-sm flex items-start w-fit">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Button
                          onClick={() => setIsCreateModalOpen(true)}
                          color="black"
                          sx={{ fontWeight: "bold", fontSize: "auto" }}
                        >
                          Compose
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                  <TableCell size="small"></TableCell>
                  <TableCell
                    size="large"
                    align="center"
                    sx={{ textSizeAdjust: "auto", fontWeight: "bold" }}
                  >
                    Sent At
                  </TableCell>
                  <TableCell
                    size="large"
                    align="center"
                    sx={{ textSizeAdjust: "auto", fontWeight: "bold" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </motion.thead>
            </AnimatePresence>
            <TableBody>
              <AnimatePresence>
                {isLoading ? (
                  <TableRow align="center">
                    <TableCell
                      colSpan={5}
                      className="text-center"
                      align="center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notif, idx) => (
                    <motion.tr
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <TableCell className="w-[10px] sm:w-[20px] md:w-[30px] lg:w-[40px] xl:w-[50px] 2xl:w-[60px] border text-center">
                        {idx + 1}.
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm text-gray-800 md:text-lg font-semibold font-sans w-1/4 border ">
                        {truncateText(notif.subject, 50)}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm text-gray-800 w-1/4 overflow-hidden border">
                        <strong className="font-semibold">
                          {truncateText(notif.category, 20)}
                        </strong>{" "}
                        - {truncateText(notif.body, 50)}
                      </TableCell>
                      <TableCell
                        className="px-4 py-2 text-sm text-gray-800 w-1/4"
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
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </StyledToolbar>
      </div>
      <Dialog open={isCreateModalOpen} onClose={handleClose} maxWidth="sm">
        <DialogTitle
          sx={{ paddingY: "10px", paddingBottom: "0px", paddingX: "15px" }}
        >
          New Message
        </DialogTitle>
        <DialogContent sx={{ padding: "15px", paddingBottom: "10px" }}>
          <CreateNotificationModal
            closeModal={handleClose}
            sendAlert={sendAlert}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isViewModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ padding: "15px", paddingBottom: "10px" }}>
          View Notification
        </DialogTitle>
        <DialogContent sx={{ padding: "15px", paddingBottom: "10px" }}>
          {isViewModalOpen && selectedNotification && (
            <ViewNotificationModal
              closeModal={handleClose}
              notificationData={selectedNotification}
              Snackbar={alertMessage}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDeleteModalOpen} onClose={handleClose} maxWidth="sm">
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
    </>
  );
}
