import React from "react";
import reactsvg from "../assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Notification from "./Notification";

const Navigationbar = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <nav className="h-[100px] w-screen bg-red-500 px-2 md:justify-between flex justify-center text-white sticky shadow-md">
      <div className="md:flex px-2 hidden">
        <img
          src={reactsvg}
          alt="React Logo"
          className="h-fit mx-2 flex justify-center self-center"
        />
        <label className="flex justify-center self-center">
          Batangas State University Disciplinary Management
        </label>
      </div>
      <div className="h-[100px] flex gap-x-5 items-center flex-wrap mx-5">
        {/* <Link
          className="p-2 hover:bg-blue-700 hover:rounded-md hover:cursor-pointer"
          to="/Students"
        >
          Students
        </Link> */}
        <Link
          className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
          to="/Violations"
        >
          Violation
        </Link>
        <Link
          className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
          to="/Users"
        >
          Users
        </Link>
        <Link
          className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
          to="/Chart"
        >
          Charts
        </Link>
        <Link
          className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
          to="/Notification"
        >
          Notification
        </Link>
        {isAuthenticated && (
          <Link
            className="p-5 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
            onClick={logout}
          >
            Logout
          </Link>
        )}

        {localStorage.getItem("accessToken") === null &&
          window.location.replace("/login")}
      </div>
    </nav>
  );
};

export default Navigationbar;
