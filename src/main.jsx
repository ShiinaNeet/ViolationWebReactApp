import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./routes/Home";
import Students from './routes/Students';
import Layout from './layout';
import Violations from './routes/Violations';
import Chart from './routes/Chart';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/Students",
        element: <Students />
      },
      {
        path: "/Violations",
        element: <Violations />
      },
      {
        path: "/Chart",
        element: <Chart />
      },
    ]
  },
  
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
