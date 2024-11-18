import React from "react";
import reactsvg from "@src/assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

const Dean_NavigationBar = () => {
  const { logout, isAuthenticated, userType } = useAuth();

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
      <div className="h-[100px] flex gap-x-5 items-center flex-wrap py-1 px-5">
        <Link
          className="p-2 hover:bg-blue-700 hover:rounded-md hover:cursor-pointer"
          to="/dean/home"
        >
          {userType == "PROGRAM HEAD" ? "Program Head" : "Dean"}
        </Link>
        {isAuthenticated && (
          <Link
            className="p-2 hover:bg-blue-700 hover:rounded-md hover:cursor-pointer"
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

export default Dean_NavigationBar;
