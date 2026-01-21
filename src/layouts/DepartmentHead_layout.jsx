import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Department_Head/NavigationBar";

const DepartmentHeadLayout = () => (
  <div className="overflow-x-scroll:hidden w-full h-full min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
    <Navigationbar />
    <Outlet />
  </div>
);

export default DepartmentHeadLayout;
