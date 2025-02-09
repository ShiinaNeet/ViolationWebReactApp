import { Outlet } from "react-router-dom";
import Navigationbar from "./components/Coordinator/NavigationBar";

const DeanLayout = () => (
  <div className="overflow-x-scroll:hidden">
    <Navigationbar />
    <Outlet />
  </div>
);

export default DeanLayout;
