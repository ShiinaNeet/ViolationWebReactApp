import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { valueFormatter } from "../utils/ChartData";
import { StyledEngineProvider } from "@mui/material/styles";
import BarChartHead from "../components/Department_Head/BarChart";
import { Container } from "@mui/material";

export default function Chart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("statistic", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response: ", response);
      if (response.status === 200) {
        console.log("Data fetched successfully");
        const transformedData = response.data.map((item, index) => ({
          id: index,
          value: item.count,
          label: `${item.violation_name} (${item.count})`,
        }));
        setData(transformedData);
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
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 0,
          pb: { xs: 8, sm: 12 },
        }}
      >
        <BarChartHead />
      </Container>
    </>
  );
}
