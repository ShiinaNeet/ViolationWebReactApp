import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Alert, AlertTitle, Snackbar } from '@mui/material';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const vertical = 'bottom';
  const horizontal = 'right';
  
  const [alertMessage, setAlertMessage] = React.useState({open: false ,title: '', message: '', variant: ''});
  const [errorMessages, setErrorMessages] = React.useState([]);

  const [account, setAccount] = React.useState({name: '', password: ''});

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertMessage({open:false});
  };
  
  const handleLogin = () => {
    if(account.name === '' || account.password === '') {
      // alert('Please fill in all fields');
      setAlertMessage({open: true, title: 'Error', message: 'Please fill in all fields', variant: 'error'});
      return;
    }
    if(login(account.name, account.password) == true) {
      navigate('/Students');
    }
     // Redirect to home or any other route after login
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className='flex flex-col bg-slate-100 w-full sm:w-1/3 p-3 rounded-md gap-y-5 shadow-sm shadow-red-400 animate-slide-in'>
        <h1 className=" text-3xl text-center font-mono font-extrabold">STUDENT VIOLATION TRACKING APP</h1>
        <TextField 
        id="outlined-basic" 
        label="Full Name" 
        variant="outlined" 
        onChange={(e) => setAccount({...account, name: e.target.value})}
        value={account.name}
        />
        <TextField 
        id="outlined-basic" 
        label="Password" 
        variant="outlined" 
        value={account.password}
        onChange={(e) => setAccount({...account, password: e.target.value})}
        />
        <Button onClick={handleLogin} className=''>Login</Button>
      </div>
      <Snackbar open={alertMessage.open} autoHideDuration={3000} onClose={handleAlertClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
        <Alert
        onClose={handleAlertClose}
        icon={false}
        severity="info"
        sx={{ width: '100%' }}
        >
            <AlertTitle>{alertMessage.title}</AlertTitle>
            {errorMessages.length > 0 ? errorMessages.join(', ') : alertMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;