import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
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
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { Alert, AlertTitle, Snackbar, TableHead } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import StudentViolationList from '../components/StudentViolationList';
import AlertMessageStudent from '../components/AlertMessageStudent';

function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
             <FirstPageIcon />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
             <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
               <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
              <LastPageIcon />
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
    return {
      fontWeight: personName.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
}
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
        { id: 11, name: 'Ian Jacobs', violation: 'Cheating', count: 2, department: 'Information Technology', year: '4th Year', section: 'C' },
        { id: 12, name: 'Jackie King', violation: 'Disruptive Behavior', count: 1, department: 'Software Engineering', year: '1st Year', section: 'D' },
        { id: 13, name: 'Kevin Lee', violation: 'Late Submission', count: 3, department: 'Computer Science', year: '3rd Year', section: 'A' },
        { id: 14, name: 'Laura Martinez', violation: 'Plagiarism', count: 1, department: 'Information Technology', year: '2nd Year', section: 'B' },
        { id: 15, name: 'Mike Nelson', violation: 'Cheating', count: 2, department: 'Software Engineering', year: '4th Year', section: 'C' },
        { id: 16, name: 'Nina O\'Connor', violation: 'Disruptive Behavior', count: 1, department: 'Computer Science', year: '1st Year', section: 'D' },
        { id: 17, name: 'Oscar Perez', violation: 'Late Submission', count: 2, department: 'Information Technology', year: '3rd Year', section: 'A' },
        { id: 18, name: 'Paula Quinn', violation: 'Plagiarism', count: 1, department: 'Software Engineering', year: '2nd Year', section: 'B' },
        { id: 19, name: 'Quincy Roberts', violation: 'Cheating', count: 3, department: 'Computer Science', year: '4th Year', section: 'C' },
        { id: 20, name: 'Rachel Scott', violation: 'Disruptive Behavior', count: 1, department: 'Information Technology', year: '1st Year', section: 'D' },
        { id: 21, name: 'Sam Taylor', violation: 'Late Submission', count: 2, department: 'Software Engineering', year: '3rd Year', section: 'A' },
        { id: 22, name: 'Tina Underwood', violation: 'Plagiarism', count: 1, department: 'Computer Science', year: '2nd Year', section: 'B' },
        { id: 23, name: 'Uma Vance', violation: 'Cheating', count: 2, department: 'Information Technology', year: '4th Year', section: 'C' },
        { id: 24, name: 'Victor White', violation: 'Disruptive Behavior', count: 1, department: 'Software Engineering', year: '1st Year', section: 'D' },
        { id: 25, name: 'Wendy Xiong', violation: 'Late Submission', count: 3, department: 'Computer Science', year: '3rd Year', section: 'A' },
        { id: 26, name: 'Xander Young', violation: 'Plagiarism', count: 1, department: 'Information Technology', year: '2nd Year', section: 'B' },
        { id: 27, name: 'Yara Zane', violation: 'Cheating', count: 2, department: 'Software Engineering', year: '4th Year', section: 'C' },
        { id: 28, name: 'Zachary Adams', violation: 'Disruptive Behavior', count: 1, department: 'Computer Science', year: '1st Year', section: 'D' },
        { id: 29, name: 'Abby Baker', violation: 'Late Submission', count: 2, department: 'Information Technology', year: '3rd Year', section: 'A' },
        { id: 30, name: 'Brian Clark', violation: 'Plagiarism', count: 1, department: 'Software Engineering', year: '2nd Year', section: 'B' },
        { id: 31, name: 'Cathy Davis', violation: 'Cheating', count: 3, department: 'Computer Science', year: '4th Year', section: 'C' },
        { id: 32, name: 'David Evans', violation: 'Disruptive Behavior', count: 1, department: 'Information Technology', year: '1st Year', section: 'D' },
        { id: 33, name: 'Eva Foster', violation: 'Late Submission', count: 2, department: 'Software Engineering', year: '3rd Year', section: 'A' },
        { id: 34, name: 'Frank Green', violation: 'Plagiarism', count: 1, department: 'Computer Science', year: '2nd Year', section: 'B' },
        { id: 35, name: 'Grace Harris', violation: 'Cheating', count: 2, department: 'Information Technology', year: '4th Year', section: 'C' },
        { id: 36, name: 'Henry Irving', violation: 'Disruptive Behavior', count: 1, department: 'Software Engineering', year: '1st Year', section: 'D' },
        { id: 37, name: 'Ivy Jacobs', violation: 'Late Submission', count: 3, department: 'Computer Science', year: '3rd Year', section: 'A' },
        { id: 38, name: 'Jack King', violation: 'Plagiarism', count: 1, department: 'Information Technology', year: '2nd Year', section: 'B' },
        { id: 39, name: 'Karen Lee', violation: 'Cheating', count: 2, department: 'Software Engineering', year: '4th Year', section: 'C' },
        { id: 40, name: 'Leo Martinez', violation: 'Disruptive Behavior', count: 1, department: 'Computer Science', year: '1st Year', section: 'D' },
        { id: 41, name: 'Mona Nelson', violation: 'Late Submission', count: 2, department: 'Information Technology', year: '3rd Year', section: 'A' },
        { id: 42, name: 'Nate O\'Connor', violation: 'Plagiarism', count: 1, department: 'Software Engineering', year: '2nd Year', section: 'B' },
        { id: 43, name: 'Olivia Perez', violation: 'Cheating', count: 3, department: 'Computer Science', year: '4th Year', section: 'C' },
        { id: 44, name: 'Paul Quinn', violation: 'Disruptive Behavior', count: 1, department: 'Information Technology', year: '1st Year', section: 'D' },
        { id: 45, name: 'Quinn Roberts', violation: 'Late Submission', count: 2, department: 'Software Engineering', year: '3rd Year', section: 'A' },
        { id: 46, name: 'Rita Scott', violation: 'Plagiarism', count: 1, department: 'Computer Science', year: '2nd Year', section: 'B' },
        { id: 47, name: 'Steve Taylor', violation: 'Cheating', count: 2, department: 'Information Technology', year: '4th Year', section: 'C' },
        { id: 48, name: 'Tara Underwood', violation: 'Disruptive Behavior', count: 1, department: 'Software Engineering', year: '1st Year', section: 'D' },
        { id: 49, name: 'Umar Vance', violation: 'Late Submission', count: 3, department: 'Computer Science', year: '3rd Year', section: 'A' },
        { id: 50, name: 'Vera White', violation: 'Plagiarism', count: 1, department: 'Information Technology', year: '2nd Year', section: 'B' }
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [ViewModal, setViewModal] = React.useState(false);
    const [targetStudent, setStudent] = React.useState({
        userid: 0,
        fullname: '',
        violations: [],
        year: '',
        department: '',
        section: ''
  
    });
    const [violationList, setViolationList] = React.useState([]);

    const theme = useTheme();
    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };
    const vertical = 'bottom';
    const horizontal = 'right';
    const [alertMessage, setAlertMessage] = React.useState({open: false ,title: '', message: '', variant: ''});
    const [errorMessages, setErrorMessages] = React.useState([]);
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setAlertMessage({open:false});
      };


    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const [addStudentModal, setAddStudentModal] = React.useState(false);
    const [updateStudentViolationModal, setUpdateStudentViolationModal] = React.useState(false);
    const [deleteStudentViolationModal, setDeleteStudentViolationModal] = React.useState(false);
    const [messageStudentModal, setMessageStudentModal] = React.useState(false);

    useEffect(() => {
        // if ((page + 1) * rowsPerPage >= rows.length) {
        //     fetchData();
        // }
        fetchViolationData();
        fetchData();
    }, []);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setViewModal(false);
        setAddStudentModal(false);
        setMessageStudentModal(false);
        setDeleteStudentViolationModal(false);
        setUpdateStudentViolationModal(false);
        setStudent({
            fullname: '',
            violations: [],
            year: '',
            department: '',
            section: ''});
        fetchData();
    };
    const handleViewViolationModal = (person) => {
        setAnchorEl(null);
        console.log(person);
        // setStudent(person);
        fetchUser(person);
        setViewModal(true);
        setAddStudentModal(false);
        
    };
    const handleUpdateViolationModal = (person) => {
        setAnchorEl(null);
        setUpdateStudentViolationModal(true);
        setStudent(person);
        
    };
    
    const handleDeleteViolationModal = (person) => {
        setDeleteStudentViolationModal(true);
        setStudent(person);
        setAnchorEl(null);
        
    };
    const handleDelete = async () => {
        
        if(targetStudent.userid == '' || targetStudent.userid == null || targetStudent.userid == 0){
            console.log("No violation to delete");
            setAlertMessage({open:true, title: 'Error occured!', message: 'There is no target student to be deleted! Please try again!',variant: 'info'});
            return;
        }
        axios.delete(`/user/delete/${targetStudent.userid}`, 
            {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            setErrorMessages([]);
            if (response.data.status ===  'success') {
                console.log("Saved");
                fetchData();
                setAlertMessage({open:true, title: 'Success', message: 'Student Violation was updated successfully!',variant: 'info'});
                setDeleteStudentViolationModal(false);
            } else {
                console.log("Failed to Update");
                setAlertMessage({open:true, title: 'Failed', message: response.data.description, variant: 'info'});
            }
        })
        .catch((e) => {
            console.log("Error Occurred: ", e);
            setErrorMessages([]);
            setAlertMessage({ open: true, title: 'Error Occurred!', message: 'Please try again later.', variant: 'error' });
        });
        setDeleteStudentViolationModal(false);
       
    }
    const fetchData = async () => {
        axios.get('/user/paginated', {
            params: {
            skip: page * rowsPerPage,
            limit: 100
            },
            headers: {
            'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if(response.data.status === "success"){
                setRows(prevRows => {
                    const newRows = response.data.data.filter(
                        newRow => !prevRows.some(row => row.id === newRow.id)
                    );
                    return [...prevRows, ...newRows]; // Append only unique rows
                });
            }
            else{
                console.log("Failed to fetch data");
            }
        })
        .catch((error) => {
            console.error('There was an error fetching the data!', error);
        });
    };
    const fetchViolationData = async () => {
        axios.get('https://student-discipline-api-fmm2.onrender.com/violation/paginated', {
            params: {
            skip: 0,
            limit: 100
            },
            headers: {
            'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if(response.data.success === true){
                console.log("Violation data fetched successfully");
                setViolationList(response.data.total);
                console.log(violationList);
            }
            else{
                console.log("Failed to fetch data");
            }
        })
        .catch((error) => {
            console.error('There was an error fetching the data!', error);
        });
    };
    const fetchUser = async (person) => {
        axios.get(`/user/${person.userid}`, {
            headers: {
            'Content-Type': 'application/json',
            }
        })
        .then((response) => {
               setStudent({ 
               fullname: response.data.fullname, 
               userid: response.data.userid, 
               violations: response.data.violations.length > 0 ? response.data.violations : [],
               year: response.data.year,
               department: response.data.department,
               section: response.data.section
               });
                // console.log(targetStudent);           
        })
        .catch((error) => {
            console.error('There was an error fetching the data!', error);
        });
    };
    const [selectedViolation, setSelectedViolation] = React.useState({name: '', _id:'', date: '', description:''});

    const handleDeleteViolation = (index) => {
        const updatedViolations = [...targetStudent.violations];
        updatedViolations.splice(index, 1);
        setStudent({ ...targetStudent, violations: updatedViolations });
    };

   
    const handleAddViolation = () => {
        if (selectedViolation && !targetStudent.violations.some(v => v.name === selectedViolation.name)) {
            const updatedViolations = [...targetStudent.violations, selectedViolation];
            setStudent({ ...targetStudent, violations: updatedViolations });
            setSelectedViolation("");
        }
    };
    const transformedViolations = targetStudent.violations.map(violation => ({
        ...violation,
        $oid: violation._id,
        _id: undefined // Remove the _id field
    }));
    const handleUpdateViolation = () => {
        // console.log('Updating violation...');
        // console.log("Current student violation: ",targetStudent.violations);
        if(targetStudent.violations.length == 0 || targetStudent.department == ''){
            console.log("No violation to update");
            setAlertMessage({open:true, title: 'Error occured!', message: 'Student Violation and Department fields are required!',variant: 'info'});
            return;
        }
        axios.put(`/user/update/${targetStudent.userid}`, 
            {   
            department: targetStudent.department,
            violations: transformedViolations
            },
            {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            setErrorMessages([]);
            if (response.data.status ===  'success') {
                console.log("Saved");
                fetchData();
                setAlertMessage({open:true, title: 'Success', message: 'Student Violation was updated successfully!',variant: 'info'});
                setUpdateStudentViolationModal(false);
            } else {
                console.log("Failed to Update");
                setAlertMessage({open:true, title: 'Failed', message: response.data.description, variant: 'info'});
            }
        })
        .catch((e) => {
            console.log("Error Occurred: ", e);
            setErrorMessages([]);
            setAlertMessage({ open: true, title: 'Error Occurred!', message: 'Please try again later.', variant: 'error' });
        });
   
    }

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
                <div className=" shadow-sm shadow-zinc-500 rounded-lg">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} >
                            <TableHead>
                                <TableRow className='text-left'>
                                    <th className="py-5 px-4 border-b">ID</th>
                                    <th className="py-5 px-4 border-b">Name</th>
                                    <th className="py-5 px-4 border-b">Violation</th>
                                    <th className="py-5 px-4 border-b">Department</th>
                                    <th className="py-5 px-4 border-b">Year</th>
                                    <th className="py-5 px-4 border-b">Section</th>
                                    <th className="py-5 px-4 border-b">Actions</th>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((student) => (
                                    <tr key={student.userid} className="hover:bg-gray-50" >
                                        <td className="py-2 px-4 border-b">{student.userid}</td>
                                        <td className="py-2 px-4 border-b">{student.fullname}</td>
                                        <td className="py-2 px-4 border-b">{student.violations.length > 0 ? student.violations[0].name : ''}</td>
                                        <td className="py-2 px-4 border-b">{student.department}</td>
                                        <td className="py-2 px-4 border-b">{student.year}</td>
                                        <td className="py-2 px-4 border-b">{student.section}</td>
                                        <td className="py-2 px-4 border-b">
                                            <Button onClick={() => handleViewViolationModal(student)}>View Violation</Button>
                                            <Button onClick={() => handleUpdateViolationModal(student)}>Update Violation</Button>
                                            <Button onClick={() => handleDeleteViolationModal(student)}>Delete Violation</Button>
                                        </td>
                                    </tr>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        slotProps={{
                                            select: {
                                                inputProps: {
                                                    'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            },
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            { ViewModal && (
                <Modal
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
                        
                        <label
                        readOnly
                        >
                            Name: {targetStudent.fullname}
                        </label>
                        <label
                        readOnly
                        >
                            Violation: { targetStudent.violations && targetStudent.violations.length > 0 ? targetStudent.violations[0].name : ''}
                        </label>
                   
                        <div id="Violation list">
                            <h2 className='py-3 text-2xl font-bold text-center'>Violation Records</h2>
                            <StudentViolationList student={targetStudent} />
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
                                onClick={() => handleSave()} >
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
             { updateStudentViolationModal &&
                <Dialog open={updateStudentViolationModal} onClose={handleClose} fullWidth={true} maxWidth="sm">
                    <DialogTitle>Edit Violation</DialogTitle>
                    <DialogContent>
                    <div>
                        <h3>Current Violations</h3>
                        <ul>
                            {targetStudent.violations.map((violation, index) => (
                                <li key={index} className='bg-slate-300 my-2 rounded-sm flex justify-between text-black'>
                                   <label className='p-2'>{violation.name} </label> 
                                    <Button
                                        onClick={() => handleDeleteViolation(index)}
                                        className='hover:bg-slate-500 hover:text-white'
                                    >
                                        Delete
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='my-5 w-full'>
                        <h3 className='mb-3'>Add Violation</h3>
                        <div className='flex '>
                            <select
                                className="w-full border rounded  flex-1"
                                value={selectedViolation.name}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    const violation = violationList.find(v => v.name === selectedName);
                                    setSelectedViolation({name: violation.name, _id: violation._id, date: violation.date, description: violation.description});
                                    
                                }}

                            >
                                <option value="">Select Violation</option>
                                {violationList.map((violation, index) => (
                                    <option key={index} value={violation.name}>
                                        {violation.name}
                                    </option>
                                ))}
                            </select>
                            <Button
                                className=''
                                onClick={handleAddViolation}
                                color="primary"
                            >
                                Add
                            </Button>
                        </div>
                        
                        <TextField
                        className='my-5 py-5'
                        label="Department"
                        type="text"
                        variant="standard"
                        value={targetStudent.department}
                        onChange={(e) => setStudent({ ...targetStudent, department: e.target.value })}
                        slotProps={{
                            inputLabel: {
                            shrink: true,
                            },
                        }}
                        fullWidth
                        />
                        
                    </div>
                    </DialogContent>
                    <DialogActions>
                        <Button className='bg-red-500'
                        onClick={handleUpdateViolation}
                        >
                            Update Student
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            }  
            { deleteStudentViolationModal &&
                <Dialog open={deleteStudentViolationModal} onClose={handleClose}>
                    <DialogTitle>Are you sure you want to delete this violation?</DialogTitle>
                    <DialogContent>
                        <div className='flex flex-col gap-y-2'>
                            <p></p>
                            <label>Name: {targetStudent.fullname}</label>
                            <label>Department: {targetStudent.department && targetStudent.department.length > 0 ? targetStudent.department : 'No department attached'}</label>
                            <br />
                            <label>Violation(s): </label>
                            <ul>
                                {targetStudent.violations.map((violation, index) => (
                                    <li key={index} className='bg-slate-300 my-2 rounded-sm flex justify-between text-black'>
                                    <label className='p-2'>{violation.name} </label> 
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                    </DialogContent>
                    <DialogActions>
                        <Button className='bg-red-500'
                        onClick={handleDelete}
                        >
                            Delete
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            }  
            { messageStudentModal && <AlertMessageStudent open={messageStudentModal} handleClose={handleClose} data={targetStudent} /> }
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
        </>
    );
        
};

export default Students;