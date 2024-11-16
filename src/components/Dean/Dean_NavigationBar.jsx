import React from "react";
import reactsvg from "@src/assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

const Dean_NavigationBar = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <nav className="h-fit w-screen bg-red-500 p-3 md:justify-between flex justify-center text-white sticky">
      <div className="md:flex items-center px-2 hover:bg-red-700 hover:rounded-md hover:cursor-pointer hidden">
        <img src={reactsvg} alt="React Logo" className="h-fit mx-2" />
        <label className="flex justify-center self-center">
          Batangas State University Disciplinary Management
        </label>
      </div>
      <div className="h-[100px] flex gap-x-5 items-center flex-wrap py-1">
        <Link
          className="p-2 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
          to="/Dean"
        >
          Dean
        </Link>
        {isAuthenticated && (
          <Link
            className="p-2 hover:bg-red-700 hover:rounded-md hover:cursor-pointer"
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
