import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const CreateStudentModal = ({ handleClose }) => {
    const [studentName, setStudentName] = useState('');
    // Can be student object as well.
    const handleSubmit = () => {
        console.log('Student Name:', studentName);
        handleClose;
    };

    return (
       <div>
        
       </div>
    );
}
export default CreateStudentModal;