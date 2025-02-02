import { Outlet } from "react-router-dom";
import Navigationbar from "./components/Department_Head/NavigationBar";
const DepartmentHeadLayout = () => (
  <div className="overflow-x-scroll:hidden">
    <Navigationbar />
    <Outlet />
  </div>
);

export default DepartmentHeadLayout;
