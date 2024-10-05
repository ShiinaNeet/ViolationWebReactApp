import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Home from './routes/Home';
import Students from './routes/Students';
import Layout from './layout';
import Violations from './routes/Violations';
import Chart from './routes/Chart';
import Login from './routes/Login';
import Unauthorized from './routes/Unauthorized';

import { setupAxiosInterceptors } from './axios';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthProvider';

const authTokens = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
};

setupAxiosInterceptors(authTokens);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute element={<Home />} />,
      },
      {
        path: '/Students',
        element: <ProtectedRoute element={<Students />} roles={['admin', 'user']} />,
      },
      {
        path: '/Violations',
        element: <ProtectedRoute element={<Violations />} roles={['admin']} />,
      },
      {
        path: '/Chart',
        element: <ProtectedRoute element={<Chart />} roles={['admin', 'user']} />,
      },
    ],
  },
  {
    path: '/Login',
    element: <ProtectedRoute element={<Login />} />,
  },
  {
    path: '*',
    element: <Unauthorized />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
