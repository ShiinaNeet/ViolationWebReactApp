import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  alpha,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  boxShadow: `0px 4px 6px ${alpha(red[500], 0.9)}`,
}));

export default function NotificationList() {
  const vertical = "bottom";
  const horizontal = "right";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [notificationQueryParams, setNotificationQueryParams] = React.useState({
    search: null,
    sort: "date-asc",
    sent: null,
  });
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  // Fetch notifications from the API
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`notification`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          search: notificationQueryParams.search,
          sort: notificationQueryParams.sort,
          sent: notificationQueryParams.sent,
        },
      });
      setNotifications(response.data.queued_emails);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filter to notifications
  const applyFilter = () => {
    if (filter === "All") {
      setFilteredNotifications(notifications);
    } else if (filter === "Message-Sent") {
      setFilteredNotifications(
        notifications.filter((notif) => notif.is_sent === true)
      );
    } else if (filter === "Message-Queued") {
      setFilteredNotifications(
        notifications.filter((notif) => notif.is_sent === false)
      );
    }
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

  return (
    <div className="">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <StyledToolbar variant="dense" disableGutters>
          <TableContainer component={Paper} className="py-2">
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
              <TableHead sx={{ padding: "0px" }}>
                <TableRow
                // sx={{ borderBottom: "2px solid red", padding: "0px" }}
                >
                  <TableCell onClick={() => fetchNotifications()} size="small">
                    <div className="hover:bg-red-100 py-1.5 px-3 rounded-sm flex items-start">
                      <ReplayIcon color="error" fontSize="small" />
                    </div>
                  </TableCell>
                  <TableCell size="small">
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      color="error"
                    >
                      Compose
                    </Button>
                  </TableCell>
                  <TableCell size="small"></TableCell>
                  <TableCell size="small" align="center">
                    Status
                  </TableCell>
                  <TableCell size="small" align="center">
                    <FormControl
                      sx={{ minWidth: 120 }}
                      error
                      className="text-red-500"
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Filter
                      </InputLabel>
                      <Select
                        size="small"
                        value={filter}
                        onChange={handleFilterChange}
                        fullWidth
                        color="error"
                        label="Filter"
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                      >
                        <MenuItem value="All">
                          <em>All Message</em>
                        </MenuItem>
                        <MenuItem value="Message-Sent">Sent</MenuItem>
                        <MenuItem value="Message-Queued">Queued</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNotifications.map((notif, idx) => (
                  <Tooltip title={"Click to view " + notif.subject} key={idx}>
                    <TableRow
                      key={idx}
                      className=" border-gray-200 w-full border-separate hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => {
                        setSelectedNotification(notif);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <TableCell className="w-[10px] sm:w-[20px] md:w-[30px] lg:w-[40px] xl:w-[50px] 2xl:w-[60px] border text-center">
                        <p> {idx + 1}.</p>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm text-gray-800 md:text-lg font-semibold font-sans w-1/4 border ">
                        <p className="font-semibold">{notif.subject}</p>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm text-gray-800 max-w-20 overflow-hidden white-space-nowrap text-overflow-ellipsis border">
                        <p className="font-thin">
                          <strong className="font-semibold">
                            {notif.category}
                          </strong>{" "}
                          - {notif.body}
                        </p>{" "}
                      </TableCell>
                      <TableCell
                        className="w-[10px] sm:w-[20px] md:w-[30px] lg:w-[40px] xl:w-[50px] 2xl:w-[60px] border text-center"
                        align="center"
                      >
                        <Chip
                          label={notif.is_sent ? "Sent" : "Queued"}
                          color={notif.is_sent ? "secondary" : "error"}
                          variant="outlined"
                          size="small"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell
                        className="px-4 py-2 text-sm text-gray-800 w-1/4 "
                        align="center"
                      >
                        {moment(notif.sent_at).format("MMMM DD, YYYY")}
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                ))}
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
