import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Coordinator/NavigationBar";

const Coordinator_layout = () => (
  <div className="overflow-x-scroll:hidden">
    <Navigationbar />
    <Outlet />
  </div>
);

export default Coordinator_layout;
