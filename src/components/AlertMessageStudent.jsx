import React, { useEffect } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SendIcon from '@mui/icons-material/Send';
import formatDate from '../utils/moment';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import axios from 'axios';

export default function AlertMessageStudent({ open, handleClose, data }) {
    const [message, setMessage] = React.useState({
        body: '',
        name: data?.name || '',
        violation: data?.violation || '',
        date: formatDate(new Date(), 'MMMM D, YYYY'),
        error: false,
    });
    const [alertMessage, setAlertMessage] = React.useState({open: false ,title: '', message: '', variant: 'success'});
    const vertical = 'bottom';
    const horizontal = 'right';
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setAlertMessage({open:false});
        handleClose();
      };

    const sendMessage = async () => {
        // setRows((prevRows) => {
        //     const existingIndex = prevRows.findIndex((r) => r.id === currentRow.id);
        //     if (existingIndex >= 0) {
        //         const updatedRows = [...prevRows];
        //         updatedRows[existingIndex] = currentRow;
        //         return updatedRows;
        //     } else {
        //         return [...prevRows, { ...currentRow, id: prevRows.length + 1 }];
        //     }
        // });
        if(message.body === '') {
            setMessage({...message, error: true});
            return
        }
        setAlertMessage({open:true, title: 'Success', message: 'Email was sent succesfully!', variant: 'success'});
        // axios.post('/violation/create', violations, {
        //     headers: {
        //     'Content-Type': 'application/json',
        //     }
        // })
        // .then((response) => {
        //     if (response.data.success === true) {
        //         console.log("Email was sent succesfully!");
        //         setAlertMessage({open:true, title: 'Success', message: 'Email was sent succesfully!', variant: 'success'});
        //         fetchData(); 
        //     } else {
        //         console.log("Failed to send email: ", response.data.message);
        //         setAlertMessage({open:true, title: 'Error Occured!', message: response.data.message, variant: 'error'});
        //     }
        // })
        // .catch((e) => {
        //     console.log("Error Occurred: ", e);
        //     setAlertMessage({open:true, title: 'Error Occured!', message: 'Please try again later.', variant: 'error'});
        // });
        
    };

    return (
        <div className='w-full' >
            <Dialog open={open} onClose={handleClose} 
            fullWidth={true}
            maxWidth='md'
            >   
                <DialogTitle>
                    <strong>Dear {message.name},</strong>
                    <br />
                    <label htmlFor="" className='my-5 text-base'>Violation: {message.violation}</label>
                </DialogTitle>
                <DialogContent className=''>
                    <TextField
                        autoFocus
                        id="standard-multiline-static"
                        label="Message"
                        multiline
                        rows={6}
                        variant="standard"
                        fullWidth
                        required={true}
                        error={message.error}
                        helperText={message.error ? 'Message is required' : ''}
                        value={message.body}
                        onChange={(e) => setMessage({ ...message, body: e.target.value })}
                    />
                    <label htmlFor="" className='flex justify-end text-base text-blue-500'>
                        {
                            message.date
                        } 
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" endIcon={<SendIcon />} onClick={sendMessage} size="small">
                        Send
                    </Button>
                    <Button onClick={handleClose} color="primary" size="large">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={alertMessage.open} autoHideDuration={2000} onClose={handleAlertClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                <Alert
                onClose={handleAlertClose}
                severity={alertMessage.variant}
                sx={{ width: '100%' }}
                >
                    <AlertTitle>{alertMessage.title}</AlertTitle>
                    {alertMessage.message}
                </Alert>
            </Snackbar>
        </div>
    );
}