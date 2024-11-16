import React from "react";
import reactsvg from "@src/assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

const Department_Head_NavigationBar = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <nav className="h-[100px] w-screen bg-blue-500 px-2 md:justify-between flex justify-center text-white sticky shadow-md">
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
      <div className="h-[100px] flex gap-x-5 items-center flex-wrap py-1">
        <Link
          className="p-2 hover:bg-blue-700 hover:rounded-sm hover:cursor-pointer"
          to="/department-head/home"
        >
          Home
        </Link>
        <Link
          className="p-2 hover:bg-blue-700 hover:rounded-sm hover:cursor-pointer"
          to="/department-head/graph"
        >
          Graphs
        </Link>
        {isAuthenticated && (
          <Link
            className="p-2 hover:bg-blue-700 hover:rounded-sm hover:cursor-pointer"
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

export default Department_Head_NavigationBar;
