import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TableHead } from "@mui/material";
import formatDate from "../utils/moment";
import "../animations.css";
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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
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

StudentViolationList.propTypes = {
  student: PropTypes.shape({
    violations: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        date_committed: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  users: PropTypes.array.isRequired,
};

export default function StudentViolationList(props) {
  const { student, users } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  // console.log(student);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    if (student && Array.isArray(student.violations)) {
      console.log("Student Violation List component: ", student);
      setData(student.violations);
    } else {
      setData([]);
    }
    return () => setData([]);
  }, [student]);
  React.useEffect(() => {
    const listItems = document.querySelectorAll(".slide-in");
    listItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("slide-in-down-visible");
      }, index * 250);
    });
  }, [data, page]);
  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className="slide-in-down-visible">
                <TableCell>Name</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Reported By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index} className="slide-in">
                    <TableCell>{row.code}</TableCell>
                    <TableCell align="center">
                      {formatDate(
                        row.date_committed,
                        "MMMM DD, YYYY - hh:mm A"
                      )}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const user = users.find(
                          (user) => user.id === row.reported_by
                        );
                        if (user) {
                          const capitalize = (str) =>
                            str.charAt(0).toUpperCase() +
                            str.slice(1).toLowerCase();
                          return `${capitalize(user.first_name)} ${capitalize(
                            user.last_name
                          )}`;
                        }
                        return "User not found";
                      })()}
                    </TableCell>
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
                  rowsPerPageOptions={[{ label: "All", value: -1 }]}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
