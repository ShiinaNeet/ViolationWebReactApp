import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import StudentViolationList from '../components/StudentViolationList';
import CreateStudentModal from '../components/CreateStudentModal';
const Students = () => {
    const data = [
        { name: 'John Doe', status: 'Active', date: '2023-10-01' },
        { name: 'Jane Smith', status: 'Inactive', date: '2023-09-15' },
        { name: 'Alice Johnson', status: 'Active', date: '2023-08-20' },
        { name: 'Bob Brown', status: 'Inactive', date: '2023-07-30' },
        { name: 'Charlie Davis', status: 'Active', date: '2023-06-25' },
        { name: 'Diana Evans', status: 'Inactive', date: '2023-05-10' },
        { name: 'Ethan Foster', status: 'Active', date: '2023-04-18' },
        { name: 'Fiona Green', status: 'Inactive', date: '2023-03-22' },
        { name: 'George Harris', status: 'Active', date: '2023-02-14' },
        { name: 'Hannah Irving', status: 'Inactive', date: '2023-01-05' },
    ];
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [ViewModal, setViewModal] = React.useState(false);
    const [targetStudent, setStudent] = React.useState({});
    const [addStudentModal, setAddStudentModal] = React.useState(false);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setViewModal(false);
        setAddStudentModal(false);
    };
    const handleViewViolationModal = (person) => {
        setAnchorEl(null);
        setStudent(person);
        setViewModal(true);
        setAddStudentModal(false);
        
    };
    const handleUpdateViolationModal = () => {
        setAnchorEl(null);
        
    };
    const handleDeleteViolationModal = () => {
        setAnchorEl(null);
        
    };

    return (
        <>
            <div className="container mx-auto p-4 ">
                <div className='flex justify-between h-fit'>
                    <h1 className='text-3xl py-3'>Student List</h1>
                    <button className='bg-blue-500 my-2 p-2 rounded-sm text-white hover:bg-blue-600'
                    onClick={() => setAddStudentModal(true)}
                    >Add Student</button>
                </div>

                <div className="overflow-x-auto shadow-sm shadow-zinc-500 rounded-lg ">
                    <table className="min-w-full border-gray-200 rounded-md">
                        <thead>
                            <tr className="bg-gray-500 text-white text-lg font-bold">
                                <th className="py-5 px-4 border-b">Name</th>
                                <th className="py-5 px-4 border-b">Status</th>
                                <th className="py-5 px-4 border-b">Date</th>
                                <th className="py-5 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((student, index) => (
                                <tr key={index} className="hover:bg-gray-50 text-center">
                                    <td className="py-2 px-4 border-b">{student.name}</td>
                                    <td className="py-2 px-4 border-b">{student.status}</td>
                                    <td className="py-2 px-4 border-b">{student.date}</td>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            { ViewModal && (<Modal
                open={ViewModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='modal bg-white h-2/3 overflow-y-scroll w-2/3 my-auto rounded-md flex flex-col gap-y-3'>
                    <h2 className='py-5 text-2xl font-bold text-center'>Student Violation History</h2>
                    <TextField
                    required
                    id="outlined-required"
                    label="Student Name"
                    defaultValue="Hello World"
                    value={targetStudent.name}
                    readOnly
                    />
                    <TextField
                    required
                    id="outlined-required"
                    label="Status"
                    defaultValue="Hello World"
                    value={targetStudent.status}
                    readOnly
                    />
                    <TextField
                    required
                    id="outlined-required"
                    label="Date"
                    defaultValue="Hello World"
                    value={targetStudent.date}
                    readOnly
                    />
                   <div id="Violation list">
                        <h1 className='text-2xl'>History</h1>
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
                  {/* <CreateStudentModal onClose={handleClose} /> */}
                  <div className='flex flex-col w-[400px] gap-y-5'>
                        <h2 className='py-3 text-2xl font-bold text-center'>Add New Student</h2>
                        <TextField
                        required
                        id="outlined-required"
                        label="Student Name"
                        // onChange={(e) => setStudentName(e.target.value)}
                        
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
        </>

    );
};

export default Students;