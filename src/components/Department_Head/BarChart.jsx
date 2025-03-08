import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

export default function BarChartHead() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/statistic", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response: ", response);
      if (response.status === 200) {
        console.log("Data fetched successfully");
        const departmentData = response.data.map((department) => ({
          departmentViolationCount: department.departmentViolationCount,
          name: department.department_name,
          programs: department.programs.map((program) => ({
            name: program.program_name,
            value: program.programViolationCount || 0,
          })),
        }));
        setDepartments(departmentData);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setLoading(false);
    }
  };
  const GetLoadingUI = () => {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Loading...</p>
      </div>
    );
  };
  const GetDepartmentBarChart = () => {
    return departments.map((department) => (
      <Box
        key={department.name}
        sx={{
          marginTop: "30px",
          marginBottom: "30px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        <h1 className="text-xl font-semibold">
          {department.name} - Program Violations
        </h1>
        <label className="text-sm text-gray-500">
          Total Department Violation : {department.departmentViolationCount}
        </label>
        {department.programs.length > 0 ? (
          <BarChart
            colors={["#FF0000"]}
            height={300}
            xAxis={[
              {
                scaleType: "band",
                data: department.programs.map((program) => program.name),
              },
            ]}
            series={[
              {
                data: department.programs.map((program) => program.value),
                label: "Total Violations",
              },
            ]}
          />
        ) : (
          <div className="flex items-center justify-center h-40">
            <p>No data for this department.</p>
          </div>
        )}
      </Box>
    ));
  };
  const GetNoDataToDisplay = () => {
    return (
      <div className="flex items-center justify-center h-40">
        <p>No data to display.</p>
      </div>
    );
  };
  useEffect(() => {
    console.log("Barchart mounted: Fetching data...");
    fetchData();
  }, []);
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 15, sm: 15 },
        pb: { xs: 8, sm: 12 },
        minHeight: "100vh",
      }}
    >
      <div className="mx-auto h-full sm:w-full px-4">
        {loading ? (
          <GetLoadingUI />
        ) : departments.length > 0 && !loading ? (
          <GetDepartmentBarChart />
        ) : (
          <GetNoDataToDisplay />
        )}
      </div>
    </Container>
  );
}
