import React, { useState, useEffect } from "react";
import { alpha, Box, Container } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { red } from "@mui/material/colors";

export default function BarChartHead() {
  const [data, setData] = useState([]);
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

        const pieChartData = response.data.flatMap((department) =>
          department.programs.map((program) => ({
            name: program.program_name,
            value: program.total_violations,
          }))
        );
        setData(pieChartData);
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
        pt: { xs: 10, sm: 15 },
        height: "100vh",
      }}
    >
      <div className="mx-auto h-full md:w-full px-4">
        <Box
          sx={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "white",
          }}
        >
          <h1 className="text-xl font-semibold">
            Department&apos;s Violations{" "}
          </h1>
          {!loading && data.length > 0 ? (
            <BarChart
              colors={["#Ff0000", "#00FF00"]}
              height={300}
              xAxis={[
                {
                  scaleType: "band",
                  data: transformedData,
                },
              ]}
              series={[
                {
                  data: seriesData,
                },
              ]}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      </div>
    </Container>
  );
}
