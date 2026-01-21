import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Navigationbar";
import "../index.css";

const Layout = () => {
  return (
    <div className="overflow-x-scroll:hidden w-full h-full min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      <Navigationbar />
      <Outlet />
    </div>
  );
};
export default Layout;
