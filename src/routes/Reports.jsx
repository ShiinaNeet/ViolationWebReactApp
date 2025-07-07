import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import {
  Alert,
  AlertTitle,
  alpha,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  styled,
  TableHead,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import TablePaginationActions from "../utils/TablePaginationActions";

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
  const position = { vertical: "bottom", horizontal: "right" };
  const { vertical, horizontal } = position;
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [term, setTerm] = React.useState([]);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [semesterFilter, setSemesterFilter] = React.useState("");
  const [searchFilterModal, setSearchFilterModal] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
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
  const fetchData = async () => {
    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
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
          const minorCount =
            summary && summary.categories
              ? summary.categories.find((c) => c.category === "minor")?.count ||
                0
              : 1;
          const majorCount =
            summary && summary.categories
              ? summary.categories.find((c) => c.category === "major")?.count ||
                0
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
  const GetHeader = () => {
    return (
      <div className="flex flex-col md:flex-row justify-between gap-x-2 text-sm md:text-md bg-white my-2 rounded-md">
        <h1 className="text-2xl text-red-600 py-3 flex items-center">
          Reports List
        </h1>
        <Button onClick={() => setSearchFilterModal(true)} color="error">
          Filter
        </Button>
      </div>
    );
  };
  const GetTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Student</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Program</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Violation Details</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Minor Offenses</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Major Offenses</TableCell>
        </TableRow>
      </TableHead>
    );
  };
  const GetTableBodyData = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Loading...
          </TableCell>
        </TableRow>
      );
    } else if (filteredData.length === 0 && isLoading === false) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            No records found
          </TableCell>
        </TableRow>
      );
    }
    return filteredData.map((row, index) => (
      <TableRow key={index}>
        <TableCell>{row.student}</TableCell>
        <TableCell>{row.department}</TableCell>
        <TableCell>{row.program}</TableCell>
        <TableCell>{row.violationDetails}</TableCell>
        <TableCell>{row.minorOffenses}</TableCell>
        <TableCell>{row.majorOffenses}</TableCell>
      </TableRow>
    ));
  };
  const GetTableFooter = () => {
    return (
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
    );
  };
  const GetTable = () => {
    return (
      <StyledToolbar variant="dense" disableGutters>
        <TableContainer component={Paper} className="">
          <Table sx={{ minWidth: 400 }}>
            <GetTableHead />
            <TableBody>
              <GetTableBodyData />
            </TableBody>
            <TableFooter>
              <GetTableFooter />
            </TableFooter>
          </Table>
        </TableContainer>
      </StyledToolbar>
    );
  };
  React.useEffect(() => {
    fetchData();
    return () => {
      console.log("Reports component mounted");
    };
  }, []);
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
        <GetHeader />
        <GetTable />
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
            <DialogContent sx={{ overflowX: "hidden", overflowY: "hidden" }}>
              <TextField
                className="slide-in-from-right"
                fullWidth
                color="error"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                inputProps={{ "aria-label": "Without label" }}
                label="Search by student name"
                margin="normal"
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
                color="error"
              >
                Search
              </Button>
              <Button
                className="flex w-full sm:w-1/2 justify-center slide-in-from-right"
                onClick={() => setSearchFilterModal(false)}
                color="error"
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
