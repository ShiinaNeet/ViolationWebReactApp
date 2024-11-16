import React from "react";
import { Outlet } from "react-router-dom";
import Navigationbar from "./components/Department_Head/Department_Head_NavigationBar";
const DepartmentHeadLayout = () => (
  <div className="overflow-x-scroll:hidden">
    <Navigationbar />
    <Outlet />
  </div>
);

export default DepartmentHeadLayout;
