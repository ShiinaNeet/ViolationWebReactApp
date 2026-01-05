import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import axios from "axios";
import moment from "moment";
import CreateNotificationModal from "../components/CreateNotificationModal";
import ViewNotificationModal from "../components/ViewNotificationModal";
import { AnimatePresence, motion } from "framer-motion";
import { StyledToolbar } from "../utils/StyledToolBar";
import TablePaginationActions from "../utils/TablePaginationActions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

function Notification() {
  const vertical = "bottom";
  const horizontal = "right";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
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
  const GetTableFooter = () => {
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[{ label: "All", value: -1 }]}
            count={notifications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>
    );
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
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 15, sm: 15 },
        pb: { xs: 8, sm: 12 },
        height: "100vh",
        width: "90%",
        mx: "auto",
      }}
    >
      <>
        <div className="w-full h-full mx-auto">
          <AnimatePresence>
            <motion.div
              key="header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h1 className="text-black py-3" style={{ fontSize: "16px" }}>
                Notifications
              </h1>
            </motion.div>
          </AnimatePresence>
          <StyledToolbar
            variant="dense"
            disableGutters
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{
                  minHeight: 500,
                  overflow: "hidden",
                }}
              >
                <AnimatePresence>
                  <motion.thead
                    key="table-head"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableRow
                      sx={{ width: "100%", backgroundColor: "#f5f5f5" }}
                    >
                      <TableCell
                        size="small"
                        sx={{
                          width: "30%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: "10px",
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="hover:bg-gray-200 hover:rounded-md py-2 px-3 rounded-sm flex items-start w-fit"
                          onClick={() => fetchNotifications()}
                        >
                          <ReplayIcon fontSize="small" />
                        </motion.div>
                        <div className="hover:bg-gray-200 hover:rounded-md rounded-sm flex items-start w-fit">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button
                              onClick={() => setIsCreateModalOpen(true)}
                              color="black"
                              sx={{
                                fontSize: "16px",
                                textTransform: "capitalize",
                              }}
                            >
                              Compose
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                      <TableCell size="small" />
                      <TableCell
                        size="large"
                        align="center"
                        sx={{
                          textSizeAdjust: "auto",

                          fontSize: "16px",
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        Sent At
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "16px",
                          display: { xs: "none", sm: "flex" },
                          textAlign: { xs: "left" },
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </motion.thead>
                </AnimatePresence>
                <TableBody>
                  {isLoading ? (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      // exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        Loading...
                      </TableCell>
                    </motion.tr>
                  ) : (
                    (rowsPerPage > 0
                      ? filteredNotifications.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : filteredNotifications
                    ).map((notif, idx) => (
                      <AnimatePresence key={notif.id}>
                        <motion.tr
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                          {/* <TableCell className="w-[1px] md:w-[30px] lg:w-[40px] xl:w-[50px] 2xl:w-[60px] border text-center"></TableCell> */}
                          <TableCell
                            sx={{
                              width: { xs: "50%" },
                              fontSize: "16px",
                            }}
                            className="px-4 py-2 text-gray-800 font-semibold font-sans w-1/4 border"
                          >
                            {truncateText(notif.subject, 50)}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", sm: "table-cell" },
                              fontSize: "16px",
                            }}
                            className="hidden px-4 py-2 text-gray-800 w-2/5 overflow-hidden border"
                          >
                            <strong className="font-semibold">
                              {truncateText(notif.category, 20)}
                            </strong>{" "}
                            - {truncateText(notif.body, 50)}
                          </TableCell>
                          <TableCell
                            className="px-4 py-2 text-gray-800 w-1/4 hidden sm:table-cell"
                            sx={{
                              display: { xs: "none", sm: "table-cell" },
                              fontSize: "16px",
                            }}
                            align="center"
                          >
                            {moment(notif.send_at).format("MMMM DD, YYYY")}
                          </TableCell>
                          <TableCell
                            sx={{
                              alignItems: "center",
                              justifyContent: "center",
                              display: "flex",
                              flexDirection: "row",
                              "@media (max-width: 400px)": {
                                flexDirection: "column",
                                gap: "10px",
                              },
                            }}
                          >
                            <Button
                              color="primary"
                              variant="text"
                              onClick={() => {
                                setSelectedNotification(notif);
                                setIsViewModalOpen(true);
                              }}
                              size="small"
                              sx={{
                                padding: "5px",
                                ":hover": {
                                  backgroundColor: "#f3f4f6",
                                  color: "black",
                                  "& .MuiSvgIcon-root": {
                                    color: "black", // Changes icon color on hover
                                  },
                                },
                              }}
                            >
                              <RemoveRedEyeIcon
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  transition: "color 0.2s ease-in-out",
                                }}
                              />
                            </Button>
                            <Button
                              color="primary"
                              variant="text"
                              onClick={() => {
                                setIsDeleteModalOpen(true);
                                setSelectedNotification(notif);
                              }}
                              size="small"
                              sx={{
                                padding: "5px",
                                ":hover": {
                                  backgroundColor: "#f3f4f6",
                                  color: "black",
                                  "& .MuiSvgIcon-root": {
                                    color: "black", // Changes icon color on hover
                                  },
                                },
                              }}
                            >
                              <DeleteOutlineIcon
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  transition: "color 0.2s ease-in-out",
                                }}
                              />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      </AnimatePresence>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <GetTableFooter />
          </StyledToolbar>
        </div>
        <Dialog open={isCreateModalOpen} onClose={handleClose} maxWidth="sm">
          <DialogTitle
            sx={{
              paddingY: "10px",
              paddingBottom: "0px",
              paddingX: "15px",
              fontSize: "16px",
            }}
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
          <DialogTitle
            sx={{
              padding: "15px",
              paddingBottom: "10px",
              fontSize: "16px",
            }}
          >
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
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isDeleteModalOpen} onClose={handleClose} maxWidth="sm">
          <DialogTitle sx={{ fontSize: "16px" }}>
            Delete Notification?
          </DialogTitle>
          <DialogContent sx={{ fontSize: "16px" }}>
            <p>Are you sure you want to delete this notification?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={axiosDeleteNotification} color="primary">
              Delete
            </Button>
            <Button onClick={handleClose} color="primary">
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
    </Container>
  );
}

export default Notification;
