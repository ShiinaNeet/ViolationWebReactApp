import * as React from "react";
import Box from "@mui/material/Box";
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
import Tooltip from "@mui/material/Tooltip";
import {
  Alert,
  AlertTitle,
  Chip,
  Container,
  ListItemButton,
  ListItemText,
  Snackbar,
  TableHead,
  Typography,
} from "@mui/material";
import axios from "axios";
import TablePaginationActions from "../utils/TablePaginationActions";
import { StyledToolbar } from "../utils/StyledToolBar";
import { RemoveRedEye } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";

export default function Violations() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [errorMessages] = React.useState([]);
  const [alertMessage, setAlertMessage] = React.useState({
    open: false,
    title: "",
    message: "",
    variant: "",
  });
  const [rowDataToView, setRowDataToView] = React.useState({
    id: "",
    category: "",
    section: "",
    offense_codes: [],
    sanctions: [],
    set: "",
    violations: [],
  });
  const vertical = "bottom";
  const horizontal = "right";
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    }),
  };
  const [isLoading, setIsLoading] = React.useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertMessage({ open: false });
  };
  const handleOpen = (row) => {
    setRowDataToView(row);
    setOpen(true);
  };
  const fetchData = async () => {
    setIsLoading(true);
    axios
      .get("/violation", {
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
          console.log("Data fetched successfully");
          setRows(response.data.data);
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
  };
  const GetHeader = () => {
    return (
      <div
        className="flex flex-col md:flex-row justify-between gap-x-2 bg-white dark:bg-dark-paper my-2 rounded-md py-3 px-4 transition-colors duration-300"
        style={{ fontSize: "16px" }}
      >
        <h1
          className="text-black dark:text-white flex items-center"
          style={{ fontSize: "16px" }}
        >
          Violation List
        </h1>
      </div>
    );
  };
  const GetTableHeader = () => {
    return (
      <TableHead>
        <TableRow style={{ fontSize: "16px" }}>
          <th className="py-5 px-4 font-bold" style={{ fontSize: "16px" }}>
            Section
          </th>
          <th
            className="py-5 px-4 font-bold w-fit"
            style={{ fontSize: "16px" }}
          >
            Set
          </th>
          <th
            className="py-5 px-4 font-bold text-center w-1/3"
            style={{ fontSize: "16px" }}
          >
            Category
          </th>
          <th
            className="py-5 px-4 font-bold text-center"
            style={{ fontSize: "16px" }}
          >
            Actions
          </th>
        </TableRow>
      </TableHead>
    );
  };
  const GetTableRowLoading = () => {
    return (
      <TableRow style={{ height: 53 * emptyRows }}>
        <TableCell colSpan={4} align="center" style={{ fontSize: "16px" }}>
          Loading....
        </TableCell>
      </TableRow>
    );
  };
  const GetTableFooter = () => {
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[{ label: "All", value: -1 }]}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            colSpan={4}
          />
        </TableRow>
      </TableFooter>
    );
  };
  const GetDialogContent = () => {
    return (
      <>
        <TextField
          autoFocus
          color="primary"
          margin="dense"
          label="Category"
          type="text"
          fullWidth
          className="capitalize"
          value={
            rowDataToView.category.length > 0
              ? rowDataToView.category.charAt(0).toUpperCase() +
                rowDataToView.category.slice(1)
              : "No data"
          }
          sx={{
            cursor: "none",
            "& .MuiInputBase-input": { fontSize: "16px" },
            "& .MuiInputLabel-root": { fontSize: "16px" },
          }}
          readOnly
        />
        <TextField
          autoFocus
          color="primary"
          margin="dense"
          label="Section"
          type="text"
          fullWidth
          value={
            rowDataToView.section.length > 0 ? rowDataToView.section : "No data"
          }
          sx={{
            cursor: "none",
            "& .MuiInputBase-input": { fontSize: "16px" },
            "& .MuiInputLabel-root": { fontSize: "16px" },
          }}
          readOnly
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: 1,
          }}
        >
          <Typography variant="h8" sx={{ mb: 1, fontSize: "16px" }}>
            Offense Codes:
          </Typography>
          <div>
            {rowDataToView.offense_codes?.length > 0 && (
              <>
                {rowDataToView.offense_codes.map((offense_code) => (
                  <Chip
                    label={offense_code}
                    variant="outlined"
                    color="primary"
                    key={offense_code}
                    margin="dense"
                    size="medium"
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      p: 0.5,
                      "& .MuiChip-label": { fontSize: "16px" },
                    }}
                  />
                ))}
              </>
            )}
            {!rowDataToView.offense_codes && (
              <Chip
                label={"No Data"}
                variant="outlined"
                color="primary"
                margin="dense"
                size="medium"
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                  p: 0.5,
                  "& .MuiChip-label": { fontSize: "16px" },
                }}
              />
            )}
          </div>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", marginY: 1 }}>
          <Typography variant="h8" sx={{ fontSize: "16px" }}>
            Sanctions:
          </Typography>
          <div>
            {rowDataToView.sanctions &&
              Object.entries(rowDataToView.sanctions).map(
                ([key, value], idx) => (
                  <ListItemButton key={key}>
                    <ListItemText
                      primary={`${idx + 1}. ${
                        key.replace(/_/g, " ").charAt(0).toUpperCase() +
                        key.replace(/_/g, " ").slice(1)
                      }: ${value}`}
                    />
                  </ListItemButton>
                )
              )}
          </div>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", my: 1 }}>
          <Typography variant="h8" sx={{ mb: 1, fontSize: "16px" }}>
            Violations:
          </Typography>
          <div>
            {rowDataToView.violations.length > 0 &&
              rowDataToView.violations.map((violation) => (
                <ListItemButton key={violation.code}>
                  <ListItemText
                    primary={`${violation.code}: ${violation.description}`}
                  />
                </ListItemButton>
              ))}
          </div>
        </Box>
      </>
    );
  };
  React.useEffect(() => {
    fetchData();
    return () => {
      console.log("Violations component unmounted");
    };
  }, []);
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 10, sm: 15 },
        pb: { xs: 8, sm: 12 },
        minHeight: "100vh",
        width: "90%",
        mx: "auto",
      }}
    >
      <div className="w-full h-full mx-auto ">
        <GetHeader />
        <StyledToolbar variant="dense" disableGutters>
          <TableContainer component={Paper}>
            <Table
              sx={{
                minWidth: 500,
                minHeight: 400,
              }}
              aria-label="custom pagination table"
            >
              <GetTableHeader />
              <TableBody>
                <AnimatePresence>
                  {isLoading ? (
                    <GetTableRowLoading />
                  ) : (
                    (rowsPerPage > 0
                      ? rows.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : rows
                    ).map((row, index) => (
                      <TableRow
                        key={index}
                        component={motion.tr}
                        variants={rowVariants}
                        initial="hidden"
                        hidden={isLoading}
                        exit={{ opacity: 0, y: -10 }}
                        animate="visible"
                        custom={index}
                        layout
                        sx={{ maxHeight: 160 }}
                      >
                        <TableCell scope="row">
                          <Tooltip title={row.section} arrow>
                            <div className="flex flex-wrap break-words whitespace-normal justify-start">
                              {row.section}
                            </div>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{ maxHeight: 160 }}
                          scope="row"
                          className="w-fit"
                        >
                          <Tooltip title={row.set}>
                            <div className="flex flex-wrap break-words whitespace-normal cursor-pointer justify-start">
                              {row.set}
                            </div>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip
                            title={
                              row.category.charAt(0).toUpperCase() +
                              row.category.slice(1)
                            }
                            arrow
                          >
                            <div className="flex flex-wrap break-words whitespace-normal justify-center">
                              <Button
                                variant="text"
                                color={
                                  row.category === "major" ? "primary" : "primary"
                                }
                                sx={{ width: "50%" }}
                                size="small"
                              >
                                {row.category.charAt(0).toUpperCase() +
                                  row.category.slice(1)}
                              </Button>
                            </div>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          className="flex justify-center"
                          align="center"
                        >
                          <Tooltip title="Edit">
                            <Button
                              className="rounded-sm text-white hover:bg-gray-100 hover:text-black"
                              onClick={() => handleOpen(row)}
                            >
                              <RemoveRedEye color="primary" />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </AnimatePresence>
                {rows.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      style={{ fontSize: "16px" }}
                    >
                      No Data to show.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <GetTableFooter />
            </Table>
          </TableContainer>
        </StyledToolbar>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="false"
          sx={{
            maxHeight: "90vh",
            height: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginX: { md: "10px", lg: "auto" },
          }}
        >
          <DialogTitle sx={{ fontSize: "16px" }}>Violation Details</DialogTitle>
          <DialogContent
            sx={{
              overflowY: "auto",
              marginBottom: "10px",
              minWidth: "70vw",
              maxWidth: "90vw",
            }}
          >
            <GetDialogContent />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
            {errorMessages.length > 0
              ? errorMessages.join(", ")
              : alertMessage.message}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
