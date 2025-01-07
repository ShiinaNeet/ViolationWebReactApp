import NotificationList from "../components/NotificationList";

function Notification() {
  return (
    <div className="container mx-auto h-full px-2">
      <div className="flex flex-row justify-between h-fit">
        <NotificationList />
      </div>
    </div>
  );
}

export default Notification;
