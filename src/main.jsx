import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import DeanLayout from "./Dean_layout";
import DepartmentHeadLayout from "./DepartmentHead_layout";
import ProfessorLayout from "./Professor_layout";

//Dean Layout
import Dean_Home from "./routes/Dean/Home";
import Dean_Department from "./components/Dean/DepartmentTable";
//Department head Layout
import DepartmentHead_Home from "./routes/Department_head/Home";
import ViolationBarChart from "./components/Department_Head/BarChart";

//Professor Layout
import Professor_Home from "./routes/Professor/Home";

import Notification from "./routes/Notification";
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
      {
        path: "/notification",
        element: <ProtectedRoute element={<Notification />} />,
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
      {
        path: "departments",
        element: <ProtectedRoute element={<Dean_Department />} />,
      },
      {
        path: "notification",
        element: <ProtectedRoute element={<Notification />} />,
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
      {
        path: "notification",
        element: <ProtectedRoute element={<Notification />} />,
      },
    ],
  },
  {
    path: "/professor",
    element: <ProtectedRoute element={<ProfessorLayout />} />,
    children: [
      {
        path: "home",
        element: <ProtectedRoute element={<Professor_Home />} />,
      },
      // {
      //   path: "graph",
      //   element: <ProtectedRoute element={<ViolationBarChart />} />,
      // },
      // {
      //   path: "notification",
      //   element: <ProtectedRoute element={<Notification />} />,
      // },
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
