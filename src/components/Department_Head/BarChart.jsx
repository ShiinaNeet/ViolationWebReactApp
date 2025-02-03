import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

export default function BarChartHead() {
  const [data, setData] = useState([]);
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
        var responsedata = [
          {
            department_name: "CTE",
            departmentViolationCount: 2,
            programs: [
              {
                program_name: "BS Education Major in English",
                programViolationCount: 3,
              },
              {
                program_name: "BS Education Major in Science",
                programViolationCount: 2,
              },
            ],
          },
          {
            department_name: "Engineering",
            departmentViolationCount: 2,
            programs: [
              {
                program_name: "BS Computer Engineering",
                programViolationCount: 4,
              },
              {
                program_name: "BS Education Major in English",
                programViolationCount: 1,
              },
            ],
          },
        ];

        // Flatten and aggregate violations
        const programViolations = new Map();

        // responsedata.forEach((department) => {
        //   department.programs.forEach((program) => {
        //     const programName = program.program_name;
        //     const totalViolations = program.programViolationCount || 0; // Use provided count

        //     if (programViolations.has(programName)) {
        //       programViolations.set(
        //         programName,
        //         programViolations.get(programName) + totalViolations
        //       );
        //     } else {
        //       programViolations.set(programName, totalViolations);
        //     }
        //   });
        // });
        const departmentData = response.data.map((department) => ({
          departmentViolationCount: department.departmentViolationCount,
          name: department.department_name,
          programs: department.programs.map((program) => ({
            name: program.program_name,
            value: program.programViolationCount || 0,
          })),
        }));

        // Convert Map to an array for chart
        // const chartData = Array.from(programViolations, ([name, value]) => ({
        //   name,
        //   value,
        // }));
        setDepartments(departmentData);
        // setData(chartData);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Barchart mounted: Fetching data...");
    fetchData();
  }, []);

  const transformedData = data.map((item) => item.name);
  const seriesData = data.map((item) => item.value);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 10, sm: 15 },
        pb: { xs: 8, sm: 12 },
        minHeight: "100vh",
      }}
    >
      <div className="mx-auto h-full md:w-full px-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p>Loading...</p>
          </div>
        ) : departments.length > 0 ? (
          departments.map((department) => (
            <Box
              key={department.name}
              sx={{
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
                Total Department Violation :{" "}
                {department.departmentViolationCount}
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
          ))
        ) : (
          <div className="flex items-center justify-center h-40">
            <p>No data to display.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
