import * as React from 'react';
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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { TableHead } from '@mui/material';

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

function createData(id, name, description, date) {
    return { id, name, description, date };
}

const initialRows = [
    createData(1, 'Late Submission', 'Submitted assignment late', '2023-10-01'),
    createData(2, 'Absent', 'Absent without notice', '2023-10-02'),
    createData(3, 'Disruptive Behavior', 'Disrupted the class', '2023-10-03'),
    createData(4, 'Cheating', 'Caught cheating during exam', '2023-10-04'),
    createData(5, 'Incomplete Homework', 'Did not complete homework', '2023-10-05'),
    createData(6, 'Tardiness', 'Arrived late to class', '2023-10-06'),
    createData(7, 'Unauthorized Use of Phone', 'Used phone during class', '2023-10-07'),
    createData(8, 'Disrespectful Behavior', 'Showed disrespect to teacher', '2023-10-08'),
    createData(9, 'Vandalism', 'Damaged school property', '2023-10-09'),
    createData(10, 'Bullying', 'Bullied another student', '2023-10-10'),
    createData(11, 'Skipping Class', 'Skipped class without permission', '2023-10-11'),
    createData(12, 'Dress Code Violation', 'Did not follow dress code', '2023-10-12'),
    createData(13, 'Plagiarism', 'Copied someone else\'s work', '2023-10-13'),
    createData(14, 'Fighting', 'Involved in a physical fight', '2023-10-14'),
    createData(15, 'Smoking', 'Caught smoking on campus', '2023-10-15'),
    createData(16, 'Alcohol Use', 'Caught drinking alcohol on campus', '2023-10-16'),
    createData(17, 'Drug Use', 'Caught using drugs on campus', '2023-10-17'),
    createData(18, 'Theft', 'Stole property from another student', '2023-10-18'),
    createData(19, 'Forgery', 'Forged a parent\'s signature', '2023-10-19'),
    createData(20, 'Insubordination', 'Refused to follow teacher\'s instructions', '2023-10-20'),
].sort((a, b) => (a.date < b.date ? -1 : 1));

export default function Violations() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState(initialRows);
    const [open, setOpen] = React.useState(false);
    const [openCreate, setOpenCreate] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState({ id: '', name: '', description: '', date: '' });
    const [violations, setViolations] = React.useState({ name: '', description: '', date: ''});
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = (row) => {
        setCurrentRow(row);
        setOpen(true);
    };
    const handleCreateOpen = () => {
        
        setOpenCreate(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenCreate(false);
        setCurrentRow({ id: '', name: '', description: '', date: '' });
        setViolations({ id: '', name: '', description: '', date: '' });
    };

    const handleSave = () => {
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
        console.log("Saved");
        handleClose();
    };

    const handleDelete = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    return (
        <div className="container h-full mx-auto">
             <div className="container mx-auto p-4 ">
                <div className='flex justify-between h-fit'>
                    <h1 className='text-3xl py-3'>Violation List</h1>
                    <button className='bg-blue-500 my-2 p-2 rounded-sm text-white hover:bg-blue-600'
                    onClick={() => handleCreateOpen()}
                    >
                        Add Violation
                    </button>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} >
                        <TableHead>
                            <TableRow>
                                <th className="py-5 px-4 font-bold text-center">Violation Name </th>
                                <th className="py-5 px-4 font-bold">Violation Description </th>
                                <th className="py-5 px-4 font-bold">Date Updated </th>
                                <th className="py-5 px-4 font-bold text-center">Actions</th>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : rows
                            ).map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <td>
                                        <div className='flex gap-x-2 justify-center'>
                                            <Button variant="contained" color="primary" className="mr-2" onClick={() => handleOpen(row)}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleDelete(row.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                    
                                </TableRow>
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
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={4}
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

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit Violation</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Violation Name"
                                type="text"
                                fullWidth
                                value={currentRow.name}
                                onChange={(e) => setCurrentRow({ ...currentRow, name: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                type="text"
                                fullWidth
                                value={currentRow.description}
                                onChange={(e) => setCurrentRow({ ...currentRow, description: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Date Updated"
                                type="date"
                                fullWidth
                                value={currentRow.date}
                                onChange={(e) => setCurrentRow({ ...currentRow, date: e.target.value })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
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
                    <Dialog open={openCreate} onClose={handleClose}>
                        <DialogTitle>Create Violation</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Violation Name"
                                type="text"
                                fullWidth
                                value={violations.name}
                                onChange={(e) => setViolations({ ...violations, name: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                type="text"
                                fullWidth
                                value={violations.description}
                                onChange={(e) => setViolations({ ...violations, description: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Date Updated"
                                type="date"
                                fullWidth
                                value={violations.date}
                                onChange={(e) => setViolations({ ...violations, date: e.target.value })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
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
                </TableContainer>
            </div>
            
        </div>
        
    );
}

