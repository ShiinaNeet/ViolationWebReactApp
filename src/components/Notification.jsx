import { Badge, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import React, { useEffect } from "react";
import axios from "axios";

export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notification, setNotification] = React.useState([]);
  // date-asc, date-desc, date-desc-a-z, date-desc-a-z
  const [notificationQueryParams, setNotificationQueryParams] = React.useState({
    search: null,
    sort: "date-asc",
    sent: null,
  });
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const GetNofitication = () => {
    axios
      .get(`notification`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          search: notificationQueryParams.search,
          sort: notificationQueryParams.sort,
          sent: notificationQueryParams.sent,
        },
      })
      .then((response) => {
        console.log(response.data);
        setNotification(response.data.queued_emails);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
    console.log("Notification");
  };
  useEffect(() => {
    GetNofitication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="flex items-center justify-end">
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Badge badgeContent={notification.length} color="secondary">
              <MailIcon className="text-white" />
            </Badge>
          </IconButton>
        </Tooltip>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {notification.map((notif, idx) => (
          <div key={idx}>
            <MenuItem
              onClick={handleClose}
              key={notif.id}
              sx={{ maxWidth: "400px", minWidth: "200px" }}
            >
              <p className="text-wrap">
                {idx + 1 + ". "} {notif.subject}
              </p>
            </MenuItem>
            {/* <Divider /> */}
          </div>
        ))}
      </Menu>
    </>
  );
}
