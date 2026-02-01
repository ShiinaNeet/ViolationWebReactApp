import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/statistic", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const departmentData = response.data
          .map((department) => ({
            id: department._id || department.id,
            departmentViolationCount: department.departmentViolationCount || 0,
            name: department.department_name,
            programs: (department.programs || [])
              .map((program) => ({
                id: program.program_id || program.name,
                name: program.program_name || "Unknown Program",
                value: Number(program.programViolationCount) || 0,
              }))
              .filter((p) => p.value > 0),
          }))
          .sort((a, b) => b.departmentViolationCount - a.departmentViolationCount);
        setDepartments(departmentData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Data Calculations
  const highestViolationDepartment = useMemo(() => {
    if (departments.length === 0) return null;
    return departments[0];
  }, [departments]);

  const totalViolations = useMemo(() => {
    return departments.reduce((sum, dept) => sum + dept.departmentViolationCount, 0);
  }, [departments]);

  const maxViolationCount = useMemo(() => {
    if (departments.length === 0) return 1;
    return Math.max(...departments.map((d) => d.departmentViolationCount));
  }, [departments]);

  const selectedDepartmentData = useMemo(() => {
    if (selectedDepartment === "all") return null;
    return departments.find((d) => d.id === selectedDepartment || d.name === selectedDepartment);
  }, [selectedDepartment, departments]);

  if (loading) {
    return (
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ width: "300px", textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
            Loading Analytics...
          </Typography>
          <LinearProgress color="primary" />
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        pt: { xs: 4, sm: 6 },
        pb: { xs: 8, sm: 12 },
        minHeight: "100vh",
      }}
    >
      {/* Dashboard Header */}
      <Box sx={{ my: 10, display: "flex", justifyContent: "space-between", alignItems: "end" }}>
      
      </Box>

      {/* Summary Cards Row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Highest Violation Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          <Card elevation={2}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <EmojiEventsIcon sx={{ color: "white" }} />
                </Avatar>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  HIGHEST FREQUENCY
                </Typography>
              </Box>
              
              <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                {highestViolationDepartment?.name || "No Data"}
              </Typography>
              
              <Box sx={{ mt: "auto", display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="h3" fontWeight="700" color="primary.main">
                  {highestViolationDepartment?.departmentViolationCount || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Incidents
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Violations Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card elevation={2}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <WarningAmberIcon sx={{ color: "white" }} />
                </Avatar>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  TOTAL VIOLATIONS
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                 Accumulated across all departments
              </Typography>
              
              <Box sx={{ mt: "auto", display: "flex", alignItems: "baseline" }}>
                <Typography variant="h3" fontWeight="700" color="text.primary">
                  {totalViolations}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Departments Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card elevation={2}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                 <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <DomainVerificationIcon sx={{ color: "white" }} />
                </Avatar>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  ACTIVE DEPARTMENTS
                </Typography>
              </Box>
              
               <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                 Departments with reported cases
              </Typography>

              <Box sx={{ mt: "auto", display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="h3" fontWeight="700" color="text.primary">
                  {departments.filter((d) => d.departmentViolationCount > 0).length}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  / {departments.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "40% 60%" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* Left Column: Department Ranking */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{ height: "100%" }}
        >
          <Paper elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h6" fontWeight="700">
                        Department Ranking
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Ordered by violation frequency
                    </Typography>
                </Box>
                <TrendingUpIcon color="action" />
              </Box>
            </Box>

            <Box sx={{ p: 0, overflowY: "auto", maxHeight: "500px", flexGrow: 1 }}>
                {departments.map((dept, index) => {
                    const isSelected = selectedDepartment === (dept.id || dept.name);
                    const percentage = Math.round((dept.departmentViolationCount / maxViolationCount) * 100);
                    
                    return (
                        <Box
                            key={dept.id || dept.name}
                            onClick={() => setSelectedDepartment(dept.id || dept.name)}
                            sx={{
                                p: 2,
                                cursor: "pointer",
                                borderBottom: 1,
                                borderColor: "divider",
                                bgcolor: isSelected ? "action.selected" : "transparent",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                {/* Rank Badge */}
                                <Avatar
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        mr: 2,
                                        bgcolor: index < 3 ? "secondary.main" : "action.disabled",
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    {index + 1}
                                </Avatar>
                                
                                <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 600 }}>
                                    {dept.name}
                                </Typography>
                                
                                <Chip 
                                    label={dept.departmentViolationCount} 
                                    size="small" 
                                    color={isSelected ? "primary" : "default"}
                                    variant={isSelected ? "filled" : "outlined"}
                                    sx={{ fontWeight: "bold" }}
                                />
                            </Box>
                            
                            {/* Progress Bar */}
                            <Box sx={{ display: "flex", alignItems: "center", pl: 5.5 }}>
                                <Box sx={{ width: "100%", mr: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={percentage}
                                        color={index === 0 ? "error" : "primary"}
                                        sx={{ height: 6, borderRadius: 3 }}
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    {percentage}%
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
          </Paper>
        </motion.div>

        {/* Right Column: Chart */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.3, delay: 0.4 }}
           style={{ height: "100%" }}
        >
          <Paper elevation={2} sx={{ height: "100%", p: 3, display: "flex", flexDirection: "column" }}>
            <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "start", sm: "center" }, gap: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="700">
                        Program Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Detailed breakdown by program
                    </Typography>
                </Box>
                
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="dept-select-label">Filter Department</InputLabel>
                    <Select
                        labelId="dept-select-label"
                        value={selectedDepartment}
                        label="Filter Department"
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <MenuItem value="all">All Departments</MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id || dept.name} value={dept.id || dept.name}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1, minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AnimatePresence mode="wait">
                    {selectedDepartmentData ? (
                        <motion.div
                            key={selectedDepartment}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            {selectedDepartmentData.programs.length > 0 ? (
                                <Box sx={{ width: "100%", height: "100%" }}>
                                    <BarChart
                                        colors={[getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#1976d2']}
                                        series={[{
                                            data: selectedDepartmentData.programs.map((p) => p.value),
                                            label: "Violations",
                                            color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#1976d2',
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        }]}
                                        xAxis={[{
                                            scaleType: "band",
                                            data: selectedDepartmentData.programs.map((p) => p.name),
                                            label: "Academic Programs",
                                            tickLabelStyle: {
                                                angle: 0,
                                                fontSize: 12,
                                                textAnchor: 'middle',
                                            }
                                        }]}
                                        yAxis={[{
                                            label: "Incidents Recorded",
                                        }]}
                                        height={450}
                                        slotProps={{
                                            legend: {
                                                labelStyle: {
                                                    fontSize: 14,
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                                    <FilterListIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                                    <Typography>No violations recorded for this department.</Typography>
                                </Box>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ textAlign: "center", maxWidth: "400px" }}
                        >
                            <Box 
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 2, 
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    bgcolor: 'background.default'
                                }}
                            >
                                <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontWeight: 600 }}>
                                    Select a Department
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Click on a department from the ranking list or use the dropdown to view detailed program statistics.
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
}
