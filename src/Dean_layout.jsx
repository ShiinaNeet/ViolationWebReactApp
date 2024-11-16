import React from "react";
import { Outlet } from "react-router-dom";
import Navigationbar from "./components/Dean/Dean_NavigationBar";

const DeanLayout = () => (
  <div className="overflow-x-scroll:hidden">
    <Navigationbar />
    <Outlet />
  </div>
);

export default DeanLayout;
