import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
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

function TablePaginationActions(props) {
  const theme = useTheme();
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
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
    createData('Late Submission', '2023-10-01'),
    createData('Absent', '2023-10-02'),
    createData('Disruptive Behavior', '2023-10-03'),
    createData('Incomplete Homework', '2023-10-04'),
    createData('Cheating', '2023-10-05'),
    createData('Unapproved Device Usage', '2023-10-06'),
    createData('Dress Code Violation', '2023-10-07'),
    createData('Bullying', '2023-10-08'),
    createData('Skipping Class', '2023-10-09'),
    createData('Vandalism', '2023-10-10'),
    createData('Tardiness', '2023-10-11'),
    createData('Disrespectful Behavior', '2023-10-12'),
    createData('Fighting', '2023-10-13'),
    createData('Forgery', '2023-10-14'),
    createData('Gambling', '2023-10-15'),
    createData('Insubordination', '2023-10-16'),
    createData('Littering', '2023-10-17'),
    createData('Loitering', '2023-10-18'),
    createData('Plagiarism', '2023-10-19'),
    createData('Profanity', '2023-10-20'),
    createData('Smoking', '2023-10-21'),
    createData('Theft', '2023-10-22'),
    createData('Truancy', '2023-10-23'),
    createData('Unauthorized Absence', '2023-10-24'),
    createData('Unauthorized Area', '2023-10-25'),
    createData('Unauthorized Use of Equipment', '2023-10-26'),
    createData('Unexcused Absence', '2023-10-27'),
    createData('Unprepared for Class', '2023-10-28'),
    createData('Unsafe Behavior', '2023-10-29'),
    createData('Verbal Abuse', '2023-10-30'),
    createData('Violence', '2023-10-31'),
    createData('Weapons Possession', '2023-11-01'),
    createData('Chewing Gum', '2023-11-02'),
    createData('Classroom Disruption', '2023-11-03'),
    createData('Defiance', '2023-11-04'),
    createData('Disrespect', '2023-11-05'),
    createData('Dress Code', '2023-11-06'),
    createData('Drug Use', '2023-11-07'),
    createData('Electronic Device', '2023-11-08'),
    createData('False Alarm', '2023-11-09'),
    createData('Falsification', '2023-11-10'),
    createData('Fighting', '2023-11-11'),
    createData('Forgery', '2023-11-12'),
    createData('Gambling', '2023-11-13'),
    createData('Harassment', '2023-11-14'),
    createData('Inappropriate Language', '2023-11-15'),
    createData('Insubordination', '2023-11-16'),
    createData('Littering', '2023-11-17'),
    createData('Loitering', '2023-11-18'),
    createData('Plagiarism', '2023-11-19'),
    createData('Profanity', '2023-11-20'),
    createData('Smoking', '2023-11-21'),
    createData('Theft', '2023-11-22'),
    createData('Truancy', '2023-11-23'),
    createData('Unauthorized Absence', '2023-11-24'),
    createData('Unauthorized Area', '2023-11-25'),
    createData('Unauthorized Use of Equipment', '2023-11-26'),
    createData('Unexcused Absence', '2023-11-27'),
    createData('Unprepared for Class', '2023-11-28'),
    createData('Unsafe Behavior', '2023-11-29'),
    createData('Verbal Abuse', '2023-11-30'),
    createData('Violence', '2023-12-01'),
    createData('Weapons Possession', '2023-12-02'),
].sort((a, b) => (a.date < b.date ? -1 : 1));
 

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.calories}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.fat}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}//sds
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
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
  );
}