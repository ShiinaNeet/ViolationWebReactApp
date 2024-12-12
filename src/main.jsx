import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import DeanLayout from "./Dean_layout";
import DepartmentHeadLayout from "./DepartmentHead_layout";

//Dean Layout
import Dean_Home from "./routes/Dean/Home";

//Department head Layout
import DepartmentHead_Home from "./routes/Department_head/Home";
import ViolationBarChart from "./components/Department_Head/BarChartHead";

import Students from "./routes/Students";
import Violations from "./routes/Violations";
import Chart from "./routes/Chart";
import Login from "./routes/Login";
import Unauthorized from "./routes/Unauthorized";
import UsersManagement from "./routes/UsersManagement";

import { setupAxiosInterceptors } from "./axios";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthProvider";

const authTokens = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
};

setupAxiosInterceptors(authTokens);

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      {
        path: "/students",
        element: <ProtectedRoute element={<Students />} />,
      },
      {
        path: "violations",
        element: <ProtectedRoute element={<Violations />} />,
      },
      {
        path: "users",
        element: <ProtectedRoute element={<UsersManagement />} />,
      },
      {
        path: "chart",
        element: <ProtectedRoute element={<Chart />} />,
      },
    ],
  },
  {
    path: "/dean",
    element: <ProtectedRoute element={<DeanLayout />} />,
    children: [
      {
        path: "home",
        element: <ProtectedRoute element={<Dean_Home />} />,
      },
      {
        path: "students",
        element: <ProtectedRoute element={<Students />} />,
      },
    ],
  },
  {
    path: "/department-head",
    element: <ProtectedRoute element={<DepartmentHeadLayout />} />,
    children: [
      {
        path: "home",
        element: <ProtectedRoute element={<DepartmentHead_Home />} />,
      },
      {
        path: "graph",
        element: <ProtectedRoute element={<ViolationBarChart />} />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Unauthorized />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
