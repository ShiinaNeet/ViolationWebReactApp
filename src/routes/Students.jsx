import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import { TableHead } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import StudentViolationList from '../components/StudentViolationList';
import AlertMessageStudent from '../components/AlertMessageStudent';
const Students = () => {
    const data = [
        { id: 1, name: 'John Doe', violation: 'Late Submission', count: 3, department: 'Computer Science', year: '3rd Year', section: 'A' },
        { id: 2, name: 'Jane Smith', violation: 'Plagiarism', count: 1, department: 'Information Technology', year: '2nd Year', section: 'B' },
        { id: 3, name: 'Alice Johnson', violation: 'Cheating', count: 2, department: 'Software Engineering', year: '4th Year', section: 'C' },
        { id: 4, name: 'Bob Brown', violation: 'Disruptive Behavior', count: 1, department: 'Computer Science', year: '1st Year', section: 'D' },
        { id: 5, name: 'Charlie Davis', violation: 'Late Submission', count: 2, department: 'Information Technology', year: '3rd Year', section: 'A' },
        { id: 6, name: 'Diana Evans', violation: 'Plagiarism', count: 1, department: 'Software Engineering', year: '2nd Year', section: 'B' },
        { id: 7, name: 'Ethan Foster', violation: 'Cheating', count: 3, department: 'Computer Science', year: '4th Year', section: 'C' },
        { id: 8, name: 'Fiona Green', violation: 'Disruptive Behavior', count: 1, department: 'Information Technology', year: '1st Year', section: 'D' },
        { id: 9, name: 'George Harris', violation: 'Late Submission', count: 2, department: 'Software Engineering', year: '3rd Year', section: 'A' },
        { id: 10, name: 'Hannah Irving', violation: 'Plagiarism', count: 1, department: 'Computer Science', year: '2nd Year', section: 'B' },
    ];
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [ViewModal, setViewModal] = React.useState(false);
    const [targetStudent, setStudent] = React.useState({
        id: 0,
        name: '',
        violation: '',
        date: ''
    });
    const [addStudentModal, setAddStudentModal] = React.useState(false);
    const [deleteStudentViolationModal, setDeleteStudentViolationModal] = React.useState(false);
    const [messageStudentModal, setMessageStudentModal] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setViewModal(false);
        setAddStudentModal(false);
        setMessageStudentModal(false);
        setDeleteStudentViolationModal(false);
        setStudent({});
    };
    const handleViewViolationModal = (person) => {
        setAnchorEl(null);
        console.log(person);
        setStudent(person);
        setViewModal(true);
        setAddStudentModal(false);
        
    };
    const handleUpdateViolationModal = () => {
        setAnchorEl(null);
        
    };
    const handleDeleteViolationModal = (person) => {
        setDeleteStudentViolationModal(true);
        setStudent(person);
        setAnchorEl(null);
        
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <div className='flex flex-col md:flex-row md:justify-between h-fit'>
                    <h1 className='text-3xl py-3'>Student List</h1>
                    {/* <button className='bg-blue-500 my-2 p-2 rounded-sm text-white hover:bg-blue-600'
                        onClick={() => setAddStudentModal(true)}
                    >
                        Add Student
                    </button> */}
                    </div>
                    <div className="overflow-x-auto shadow-sm shadow-zinc-500 rounded-lg">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow className='text-left'>
                                        <th className="py-5 px-4 border-b">ID</th>
                                        <th className="py-5 px-4 border-b">Name</th>
                                        <th className="py-5 px-4 border-b">Violation</th>
                                        <th className="py-5 px-4 border-b">Count</th>
                                        <th className="py-5 px-4 border-b">Department</th>
                                        <th className="py-5 px-4 border-b">Year</th>
                                        <th className="py-5 px-4 border-b">Section</th>
                                        <th className="py-5 px-4 border-b">Actions</th>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{student.id}</td>
                                            <td className="py-2 px-4 border-b">{student.name}</td>
                                            <td className="py-2 px-4 border-b">{student.violation}</td>
                                            <td className="py-2 px-4 border-b">{student.count}</td>
                                            <td className="py-2 px-4 border-b">{student.department}</td>
                                            <td className="py-2 px-4 border-b">{student.year}</td>
                                            <td className="py-2 px-4 border-b">{student.section}</td>
                                            <td className="py-2 px-4 border-b">
                                                <Button
                                                    id="basic-button"
                                                    aria-controls={open ? 'basic-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                    onClick={handleClick}
                                                >
                                                    Action
                                                </Button>
                                                <Menu
                                                    id="basic-menu"
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    MenuListProps={{
                                                        'aria-labelledby': 'basic-button',
                                                    }}
                                                >
                                                    <MenuItem onClick={() => handleViewViolationModal(student)}>View Violation</MenuItem>
                                                    <MenuItem onClick={() => handleUpdateViolationModal(student)}>Update Violation</MenuItem>
                                                    <MenuItem onClick={() => handleDeleteViolationModal(student)}>Delete Violation</MenuItem>
                                                </Menu>
                                            </td>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    </div>
                    { ViewModal && (<Modal
                        open={ViewModal}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <div className='modal bg-white h-2/3 overflow-y-scroll  sm:w-2/3 w-full my-auto rounded-md flex flex-col gap-y-3'>
                            <div className='flex flex-col justify-center items-center md:flex-row md:justify-between md:items-center md:w-full'>
                                <h2 className='py-3 text-2xl font-bold text-center'>Student Violation History</h2>
                                <Button className='bg-blue-500 p-2 rounded-sm text-white hover:bg-blue-600 hover:text-white'
                                onClick={() => setMessageStudentModal(true)}
                                >
                                    <AddAlertIcon /> Alert
                                </Button>
                            </div>
                           
                            <TextField
                                id="outlined-required"
                                label="Student Name"
                                value={targetStudent.name}
                                onChange={(e) => setStudent({ ...targetStudent, name: e.target.value })}
                                readOnly
                            />
                            <TextField
                                id="outlined-required"
                                label="Status"
                                value={targetStudent.violation}
                                onChange={(e) => setStudent({ ...targetStudent, violation: e.target.value })}
                                readOnly
                            />
                            <TextField
                                id="outlined-required"
                                label="Date"
                                value={targetStudent.date}
                                onChange={(e) => setStudent({ ...targetStudent, date: e.target.value })}
                                readOnly
                            />
                           <div id="Violation list">
                                <h2 className='py-3 text-2xl font-bold text-center'>Violation Records</h2>
                                <StudentViolationList />
                           </div>
                        </div>
                    </Modal>)
                    }
                    { addStudentModal && 
                        (<Modal
                            open={addStudentModal}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        > 
                            <div className='modal bg-white h-fit w-fit rounded-md flex'>
                                <div className='flex flex-col w-[400px] gap-y-5'>
                                    <h2 className='py-3 text-2xl font-bold text-center'>Add New Student</h2>
                                    <TextField
                                    required
                                    id="outlined-required"
                                    label="Student Name"
                                    />
                                    <div className='flex gap-x-2'>
                                        <button 
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
                                        onClick={() => handleSubmit()} >
                                            Submit
                                        </button>
                                        <button 
                                        className=' hover:bg-slate-200 text-black font-bold py-2 px-4 rounded w-full'
                                        onClick={handleClose} >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Modal>)
            }
            { messageStudentModal && <AlertMessageStudent open={messageStudentModal} handleClose={handleClose} data={targetStudent} /> }
            {deleteStudentViolationModal &&
                <Dialog open={deleteStudentViolationModal} onClose={handleClose}>
                    <DialogTitle>Delete Violation?</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Violation Name"
                            type="text"
                            fullWidth
                            value={targetStudent.violation}
                            readOnly
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button className='bg-red-500'>
                            Delete
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            }  
        </>
    );
};

export default Students;