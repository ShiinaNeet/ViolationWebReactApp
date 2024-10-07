import React from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SendIcon from '@mui/icons-material/Send';
import formatDate from '../utils/moment';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
export default function AlertMessageStudent({ open, handleClose, data }) {
    const [message, setMessage] = React.useState({
        body: '',
        name: data?.name || '',
        violation: data?.violation || '',
        date: Date.now(),
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
        setAlertMessage({open:true, title: 'Success', message: 'Violation has been added successfully', variant: 'success'});
        // try {
        //     const response = await axios.post('/violation/create', violations, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //         }
        //     });
    
        //     if (response.data.status === 'Success') {
        //         console.log("Saved");
        //         fetchData(); 
        //     } else {
        //         console.log("Failed to save");
        //     }
        // } catch (e) {
        //     console.log("Error Occurred: ", e);
        //     setAlertMessage({open:true, title: 'Error Occured!', message: 'Please try again later.', variant: 'error'});
        // }
        
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
                        value={message.body}
                        onChange={(e) => setMessage({ ...message, body: e.target.value })}
                    />
                    <label htmlFor="" className='flex justify-end text-base text-blue-500'>
                        {formatDate(message.date)}
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