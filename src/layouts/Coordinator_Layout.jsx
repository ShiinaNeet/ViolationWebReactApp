import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Coordinator/NavigationBar";

const Coordinator_layout = () => (
  <div className="overflow-x-scroll:hidden w-full h-full min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
    <Navigationbar />
    <Outlet />
  </div>
);

export default Coordinator_layout;
