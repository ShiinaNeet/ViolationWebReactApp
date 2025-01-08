import { Container } from "@mui/material";
import NotificationList from "../components/NotificationList";

function Notification() {
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
      <div className="w-full h-full mx-auto ">
        <NotificationList />
      </div>
    </Container>
  );
}

export default Notification;
