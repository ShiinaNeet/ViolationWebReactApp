import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

export default function BarChartHead() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/violation/statistic", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response: ", response);
      if (response.status === 200) {
        console.log("Data fetched successfully");
        setData(response.data);
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

  const transformedData = data.map((item) => item.violation_name);
  const seriesData = data.map((item) => item.count);

  return (
    <div className="container mx-auto h-full p-2 m-5 md:w-full shadow-lg">
      <Box sx={{ width: "100%", padding: "5px" }}>
        <h1 className="text-xl font-semibold">Department's Violations </h1>
        {!loading && data.length > 0 ? (
          <BarChart
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
  );
}
