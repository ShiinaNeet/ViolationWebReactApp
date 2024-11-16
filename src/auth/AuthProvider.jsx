import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { setupAxiosInterceptors } from "../axios";
import { data } from "autoprefixer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");
  const login = async (name, password) => {
    try {
      const response = await axios.post(
        "/auth/login",
        {
          fullname: name,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "success") {
        localStorage.setItem("accessToken", response.data.api_token);
        const authTokens = {
          accessToken: localStorage.getItem("accessToken"),
        };
        setupAxiosInterceptors(authTokens);
        setIsAuthenticated(true);
        // console.log(isAuthenticated);
        // setUserType(response.data.user_type);
        return response.data.data;
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
