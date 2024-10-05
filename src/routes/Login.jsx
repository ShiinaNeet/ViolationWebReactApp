import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/students'); // Redirect to home or any other route after login
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className='flex flex-col bg-slate-100 w-full sm:w-1/3 p-3 rounded-md gap-y-5 shadow-sm shadow-red-400'>
        <h1 className="mb-4 text-2xl text-center">Login</h1>
        <TextField 
        id="outlined-basic" 
        label="Email Address" 
        variant="outlined" 
        />
        <TextField 
        id="outlined-basic" 
        label="Password" 
        variant="outlined" 
        />
        <Button onClick={handleLogin} className=''>Login</Button>
      </div>
    </div>
  );
};

export default Login;