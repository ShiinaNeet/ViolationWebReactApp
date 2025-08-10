import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Dean/NavigationBar";

const DeanLayout = () => (
  <div className="overflow-x-scroll:hidden w-full h-full">
    <Navigationbar />
    <Outlet />
  </div>
);

export default DeanLayout;
