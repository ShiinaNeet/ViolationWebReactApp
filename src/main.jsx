import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import Layout from "./layouts/layout";
import DeanLayout from "./layouts/Dean_layout";
import DepartmentHeadLayout from "./layouts/DepartmentHead_layout";
import ProfessorLayout from "./layouts/Professor_layout";
import CoordinatorLayout from "./layouts/Coordinator_Layout";
//Dean Layout
import Dean_Home from "./routes/Dean/Home";
import Dean_Department from "./components/Dean/DepartmentTable";
//Department head Layout
import DepartmentHead_Home from "./routes/Department_head/Home";
import ViolationBarChart from "./components/Department_Head/BarChart";

//Professor Layout
import Professor_Home from "./routes/Professor/Home";

//Coordinator Layout
import Coordinator_Home from "./routes/Coordinator/Home";

import Notification from "./routes/Notification";
import Students from "./routes/Students";
import Violations from "./routes/Violations";
import Chart from "./routes/Chart";
import Login from "./routes/Login";
import Unauthorized from "./routes/Unauthorized";
import Users from "./routes/Users";
import Reports from "./routes/Reports";
import Forms from "./routes/Forms";

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
        element: <ProtectedRoute element={<Users />} />,
      },
      {
        path: "chart",
        element: <ProtectedRoute element={<Chart />} />,
      },
      {
        path: "reports",
        element: <ProtectedRoute element={<Reports />} />,
      },
      {
        path: "forms",
        element: <ProtectedRoute element={<Forms />} />,
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
    ],
  },
  {
    path: "/coordinator",
    element: <ProtectedRoute element={<CoordinatorLayout />} />,
    children: [
      {
        path: "home",
        element: <ProtectedRoute element={<Coordinator_Home />} />,
      },
      {
        path: "students",
        element: <ProtectedRoute element={<Students />} />,
      },
      {
        path: "forms",
        element: <ProtectedRoute element={<Forms />} />,
      },
      {
        path: "notification",
        element: <ProtectedRoute element={<Notification />} />,
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
createTheme({
  palette: {
    primary: {
      main: "#ff5722",
    },
    secondary: {
      main: "#ff5722",
    },
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={createTheme()}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
