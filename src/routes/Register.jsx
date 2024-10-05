import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleRegister = () => {
    console.log('Registered');
    navigate('/Login');
    // if(registersuccess === true){
    //   console.log('Register Success');
    //   navigate('/login');
    // }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className='flex flex-col bg-slate-100 w-full sm:w-1/3 p-3 rounded-md gap-y-5 shadow-sm shadow-red-400'>
        <h1 className="mb-4 text-2xl text-center">Register</h1>
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
        <Button onClick={handleRegister} className=''>Register</Button>
      </div>
    </div>
  )
}
