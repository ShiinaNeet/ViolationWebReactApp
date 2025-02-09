import * as React from "react";
import PropTypes from "prop-types";
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

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import {
  Alert,
  AlertTitle,
  alpha,
  Chip,
  Container,
  DialogContentText,
  FormControl,
  InputLabel,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  styled,
  TableHead,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import formatDate from "../utils/moment";
import { red } from "@mui/material/colors";
import { RemoveRedEye } from "@mui/icons-material";

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
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: `0px 10px 6px rgba(0, 0, 0, 0.1)`,
}));
export default function Reports() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [rows, setRows] = React.useState([]);
  const [term, setTerm] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [semesterFilter, setSemesterFilter] = React.useState("");

  const [searchFilterModal, setSearchFilterModal] = React.useState(false);

  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });

  const vertical = "bottom";
  const horizontal = "right";
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 6));
    setPage(0);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertMessage({ open: false });
  };

  React.useEffect(() => {
    fetchData();

    return () => {
      console.log("Reports component mounted");
    };
  }, []);
  //   React.useEffect(() => {
  //     setSearchFilterModal(false);
  //   }, [searchFilter, semesterFilter]);
  const fetchData = async () => {
    axios
      .get("/statistic/reports", {
        params: {
          skip: 0,
          limit: 100,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Data fetched successfully");
          setRows(response.data);
        } else {
          console.log("Failed to fetch data");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setAlertMessage({
          open: true,
          title: error.title,
          message: error.message,
          variant: "error",
        });
      });
    axios
      .get("/term/", {
        params: {
          skip: 0,
          limit: 100,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Term Data fetched successfully");
          setTerm(response.data.data);
        } else {
          console.log("Failed to fetch data");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setAlertMessage({
          open: true,
          title: error.title,
          message: error.message,
          variant: "error",
        });
      });
  };
  const data = [
    {
      department_name: "CAS",
      semester: { name: "Second Semester", number: 2 },
      departmentViolationCount: 2,
      programs: [
        {
          program_name: "BA Communication",
          violations: [
            {
              code: "12.1.12",
              date_committed: "2025-02-05T11:15:00.146Z",
              reported_by: "6728b20d48c4d4c422da5c59",
              student: {
                srcode: "88888888",
                fullname: "John Cruz",
                email: "johncruz@email.com",
                violation_summary: {
                  categories: [{ category: "minor", count: 1 }],
                  total_violations: 1,
                },
              },
            },
            {
              code: "14.3.4",
              date_committed: "2025-02-10T09:30:00.000Z",
              reported_by: "6728b20d48c4d4c422da5c59",
              student: {
                srcode: "88888888",
                fullname: "John Cruz",
                email: "johncruz@email.com",
                violation_summary: {
                  categories: [{ category: "major", count: 1 }],
                  total_violations: 2,
                },
              },
            },
          ],
          programViolationCount: 2,
        },
      ],
    },
    {
      department_name: "CABEIHM",
      semester: { name: "Second Semester", number: 2 },
      departmentViolationCount: 2,
      programs: [
        {
          program_name: "BSBA Marketing Management",
          violations: [
            {
              code: "12.1.2",
              date_committed: "2025-02-06T15:55:34.218Z",
              reported_by: "6728b20d48c4d4c422da5c59",
              student: {
                srcode: "99999999",
                fullname: "Justin Bieber",
                email: "justinbieber@email.com",
                violation_summary: {
                  categories: [{ category: "minor", count: 2 }],
                  total_violations: 2,
                },
              },
            },
            {
              code: "10.5.3",
              date_committed: "2025-02-12T08:45:00.000Z",
              reported_by: "6728b20d48c4d4c422da5c59",
              student: {
                srcode: "99999999",
                fullname: "Justin Bieber",
                email: "justinbieber@email.com",
                violation_summary: {
                  categories: [{ category: "major", count: 1 }],
                  total_violations: 3,
                },
              },
            },
          ],
          programViolationCount: 2,
        },
      ],
    },
  ];

  const filteredData = rows.flatMap((dept) =>
    dept.programs.flatMap((program) =>
      program.violations
        .filter(
          (violation) =>
            violation.student.fullname
              .toLowerCase()
              .includes(searchFilter.toLowerCase()) &&
            (semesterFilter ? dept.semester.name === semesterFilter : true)
        )
        .map((violation) => {
          const summary = violation.student.violation_summary;
          const minorCount = summary
            ? summary.categories.find((c) => c.category === "minor")?.count || 0
            : 1; // Default to 1 if summary is null
          const majorCount = summary
            ? summary.categories.find((c) => c.category === "major")?.count || 0
            : 0;

          return {
            department: dept.department_name,
            program: program.program_name,
            student: violation.student.fullname,
            violationDetails: `${violation.code} - ${new Date(
              violation.date_committed
            ).toLocaleDateString()} (${dept.semester.name})`,
            minorOffenses: minorCount,
            majorOffenses: majorCount,
          };
        })
    )
  );

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 10, sm: 15 },
        pb: { xs: 8, sm: 12 },
        height: "100vh",
      }}
    >
      <div className="w-full h-full mx-auto ">
        <div className="flex flex-col md:flex-row justify-between gap-x-2 text-sm md:text-md bg-white my-2 rounded-md px-1 py-5">
          <h1 className="md:text-3xl text-2xl flex items-center">
            Reports List
          </h1>
          <Button onClick={() => setSearchFilterModal(true)}>Filter</Button>
        </div>

        <StyledToolbar variant="dense" disableGutters>
          <TableContainer component={Paper} className="">
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Violation Details</TableCell>
                  <TableCell>Minor Offenses</TableCell>
                  <TableCell>Major Offenses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.student}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.program}</TableCell>
                    <TableCell>{row.violationDetails}</TableCell>
                    <TableCell>{row.minorOffenses}</TableCell>
                    <TableCell>{row.majorOffenses}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[{ label: "All", value: -1 }]} // Provide an array of options
                    count={filteredData.length}
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
        </StyledToolbar>
        {searchFilterModal && (
          <Dialog
            open={searchFilterModal}
            onClose={() => setSearchFilterModal(false)}
            maxWidth="sm"
            PaperProps={{
              style: {
                width: "500px", // Set your desired fixed width here
                overflowX: "hidden",
                overflowY: "hidden",
              },
            }}
          >
            <DialogTitle className="slide-in-visible mb-1 font-bold text-large">
              Filter the reports by student name and semester
            </DialogTitle>
            <DialogContent>
              <TextField
                className="slide-in-from-right"
                fullWidth
                color="error"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                inputProps={{ "aria-label": "Without label" }}
                label="Search by student name"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="semester" color="error">
                  Semester
                </InputLabel>
                <Select
                  label="Semester"
                  className="slide-in-from-right font-medium"
                  fullWidth
                  color="error"
                  value={semesterFilter}
                  onChange={(e) =>
                    setSemesterFilter(
                      e.target.value === "" ? "" : e.target.value
                    )
                  }
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value=""> All </MenuItem>
                  {term.map((term, index) => (
                    <MenuItem key={index} value={term.name}>
                      {term.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ overflowX: "hidden", overflowY: "hidden" }}>
              <Button
                onClick={fetchData}
                className="flex w-full sm:w-1/2 justify-center slide-in-visible"
              >
                Search
              </Button>
              <Button
                className="flex w-full sm:w-1/2 justify-center slide-in-from-right"
                onClick={() => setSearchFilterModal(false)}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Snackbar
          open={alertMessage.open}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleAlertClose}
            icon={false}
            severity="info"
            sx={{ width: "100%" }}
          >
            <AlertTitle>{alertMessage.title}</AlertTitle>
            {alertMessage.message}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
