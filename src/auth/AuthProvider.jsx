import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { setupAxiosInterceptors } from "../axios";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");
  const login = async (name, password) => {
    try {
      const response = await axios.post(
        "/auth/login",
        {
          username: name,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "success") {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("userType", response.data.account_type);
        // const coordinatorType = "OSD_COORDINATOR";
        // localStorage.setItem("userType", coordinatorType);
        const authTokens = {
          accessToken: localStorage.getItem("accessToken"),
        };
        setupAxiosInterceptors(authTokens);
        setIsAuthenticated(true);
        setUserType(response.data.account_type);
        return response.data.account_type;
        // setUserType(coordinatorType);
        // return coordinatorType;
      } else {
        console.log("Failed to login: ", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUserType("");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, setUserType, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
