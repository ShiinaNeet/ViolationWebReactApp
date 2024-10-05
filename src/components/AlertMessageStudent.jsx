import React from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function AlertMessageStudent({ open, handleClose, data }) {
    const [message, setMessage] = React.useState({
        body: '',
        name: data?.name || '',
        violation: data?.violation || '',
        date: data?.date || '',
    });

    const handleSave = () => {
        console.log('Saved!');
        handleClose();
    };

    return (
        <div className='w-full'>
            <Dialog open={open} onClose={handleClose}>
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
                        {message.date} // use Moment to format the date
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}