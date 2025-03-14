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
            // const dummyData = [
            //   {
            //     id: "678fb324931df09a158c3083",
            //     subject: "Don’t Miss WinterFest 2025 – A Day of Celebration!",
            //     body: "Get ready for a day filled with excitement, laughter, and unforgettable memories at WinterFest 2025, happening on February 10, 2025, at the Campus Lawn and Auditorium!",
            //     category: "event",
            //     recipients: ["STUDENT", "ADMIN", "DEAN"],
            //     send_at: "2025-01-21T14:45:41.537000",
            //   },
            //   {
            //     id: "789ab456de78f23b189c4095",
            //     subject: "Final Exams Schedule Released",
            //     body: "The final exams schedule for the Spring semester is now available. Check the student portal for details and be prepared!",
            //     category: "academic",
            //     recipients: ["STUDENT", "PROFESSOR", "DEAN"],
            //     send_at: "2025-04-05T10:00:00.000000",
            //   },
            //   {
            //     id: "567cd890ab12c34d567e890f",
            //     subject: "System Maintenance Notice",
            //     body: "Scheduled system maintenance will take place on March 20, 2025, from 12:00 AM to 4:00 AM. The portal and online services may be unavailable during this time.",
            //     category: "announcement",
            //     recipients: ["STUDENT", "ADMIN", "FACULTY"],
            //     send_at: "2025-03-15T08:30:00.000000",
            //   },
            //   {
            //     id: "456ef678cd23b45a678d901e",
            //     subject: "Library Extended Hours for Midterms",
            //     body: "The university library will have extended hours from March 1-10, 2025, to help students prepare for midterms. Don’t forget to take advantage of the quiet study areas!",
            //     category: "facility",
            //     recipients: ["STUDENT", "PROFESSOR"],
            //     send_at: "2025-02-25T12:15:00.000000",
            //   },
            //   {
            //     id: "901gh789ef34c56b789e012f",
            //     subject: "Career Fair 2025 – Meet Top Employers!",
            //     body: "Join us for the annual Career Fair on April 15, 2025, at the Main Hall. Connect with top companies and explore internship and job opportunities.",
            //     category: "event",
            //     recipients: ["STUDENT", "ALUMNI"],
            //     send_at: "2025-04-01T09:45:00.000000",
            //   },
            //   {
            //     id: "123ab456cd78e90f123g456h",
            //     subject: "New Research Grants Available",
            //     body: "Faculty members can now apply for new research grants. The deadline for applications is May 30, 2025.",
            //     category: "academic",
            //     recipients: ["PROFESSOR", "RESEARCHER"],
            //     send_at: "2025-05-01T11:00:00.000000",
            //   },
            //   {
            //     id: "234bc567de89f01g234h567i",
            //     subject: "Important: Update Your Contact Information",
            //     body: "Ensure that your contact information is up to date in the university portal to receive the latest updates and emergency notifications.",
            //     category: "announcement",
            //     recipients: ["STUDENT", "FACULTY", "STAFF"],
            //     send_at: "2025-06-10T15:30:00.000000",
            //   },
            //   {
            //     id: "345cd678ef90g12h345i678j",
            //     subject: "Blood Donation Drive – Save Lives!",
            //     body: "Join the campus-wide blood donation drive on August 20, 2025. Your donation can save lives!",
            //     category: "event",
            //     recipients: ["STUDENT", "STAFF", "FACULTY"],
            //     send_at: "2025-08-05T10:00:00.000000",
            //   },
            //   {
            //     id: "456de789f01g23h456i789k",
            //     subject: "New Online Courses Available",
            //     body: "Explore our newly launched online courses on Data Science, AI, and Web Development. Enroll now!",
            //     category: "academic",
            //     recipients: ["STUDENT", "ALUMNI"],
            //     send_at: "2025-07-15T14:00:00.000000",
            //   },
            //   {
            //     id: "567ef890g12h34i567j890l",
            //     subject: "Reminder: Tuition Payment Deadline",
            //     body: "The tuition payment deadline for the Fall semester is approaching on September 5, 2025. Please ensure timely payment to avoid late fees.",
            //     category: "finance",
            //     recipients: ["STUDENT"],
            //     send_at: "2025-08-20T09:30:00.000000",
            //   },
            //   {
            //     id: "678fg901h23i45j678k901m",
            //     subject: "Health & Wellness Webinar",
            //     body: "Attend the Health & Wellness Webinar on October 10, 2025, to learn about stress management and healthy living tips.",
            //     category: "event",
            //     recipients: ["STUDENT", "STAFF", "FACULTY"],
            //     send_at: "2025-09-25T11:45:00.000000",
            //   },
            //   {
            //     id: "789gh012i34j56k789l012n",
            //     subject: "Graduation Ceremony Registration Open",
            //     body: "Graduating students, register now for the 2025 Graduation Ceremony before the deadline on November 1, 2025.",
            //     category: "announcement",
            //     recipients: ["STUDENT"],
            //     send_at: "2025-10-10T13:00:00.000000",
            //   },
            //   {
            //     id: "890hi123j45k67l890m123o",
            //     subject: "Campus Safety Reminder",
            //     body: "Stay safe on campus! Be aware of emergency exits, report suspicious activity, and always carry your ID.",
            //     category: "safety",
            //     recipients: ["STUDENT", "FACULTY", "STAFF"],
            //     send_at: "2025-10-20T16:00:00.000000",
            //   },
            //   {
            //     id: "901ij234k56l78m901n234p",
            //     subject: "New Internship Opportunities",
            //     body: "Check out the latest internship opportunities available for students. Apply now and gain valuable work experience!",
            //     category: "career",
            //     recipients: ["STUDENT"],
            //     send_at: "2025-11-05T10:15:00.000000",
            //   },
            //   {
            //     id: "012jk345l67m89n012o345q",
            //     subject: "Holiday Closure Notice",
            //     body: "The university will be closed from December 24, 2025, to January 2, 2026, for the holiday break.",
            //     category: "announcement",
            //     recipients: ["STUDENT", "FACULTY", "STAFF"],
            //     send_at: "2025-12-10T14:30:00.000000",
            //   },
            // ];
            // setNotifications(dummyData);
            // setFilteredNotifications(dummyData);
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
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 15, sm: 15 },
        pb: { xs: 8, sm: 12 },
        height: "100vh",
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
              <h1 className="text-2xl text-red-600 py-3">Notifications</h1>
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
                  minWidth: 500,
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
                    <TableRow sx={{ width: "100%" }}>
                      <TableCell
                        size="small"
                        sx={{
                          width: "20%",
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
                              sx={{ fontWeight: "bold", fontSize: "auto" }}
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
                          fontWeight: "bold",
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        Sent At
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          display: { xs: "none", sm: "flex" },
                          textAlign: { xs: "left", sm: "center" },
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
                      <TableCell align="center">Loading...</TableCell>
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
                              width: { xs: "40%" },
                            }}
                            className="px-4 py-2 text-sm text-gray-800 md:text-lg font-semibold font-sans w-1/4  border "
                          >
                            {truncateText(notif.subject, 50)}
                          </TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                            className="hidden px-4 py-2 text-sm text-gray-800 w-2/5 overflow-hidden border"
                          >
                            <strong className="font-semibold">
                              {truncateText(notif.category, 20)}
                            </strong>{" "}
                            - {truncateText(notif.body, 50)}
                          </TableCell>
                          <TableCell
                            className="px-4 py-2 text-sm text-gray-800 w-1/4 hidden sm:table-cell"
                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                            align="center"
                          >
                            {moment(notif.send_at).format("MMMM DD, YYYY")}
                          </TableCell>
                          <TableCell
                            sx={{
                              alignItems: "start",

                              width: { xs: "auto", sm: "20%" },
                            }}
                          >
                            <Button
                              color="error"
                              variant="text"
                              onClick={() => {
                                setSelectedNotification(notif);
                                setIsViewModalOpen(true);
                              }}
                              size="small"
                            >
                              View
                            </Button>
                            <Button
                              color="error"
                              variant="text"
                              size="small"
                              onClick={() => {
                                setIsDeleteModalOpen(true);
                                setSelectedNotification(notif);
                              }}
                            >
                              Delete
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
    </Container>
  );
}

export default Notification;
