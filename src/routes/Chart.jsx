import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { valueFormatter } from "../utils/ChartData";
import { StyledEngineProvider } from "@mui/material/styles";
import BarChartHead from "../components/Department_Head/BarChartHead";
import { Container } from "@mui/material";

export default function Chart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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

  const legendProps =
    screenWidth < 730
      ? {
          padding: { bottom: -50 },
          direction: "row",
          itemMarkHeight: 10,
          position: {
            horizontal: "left",
            vertical: "top",
          },
          itemMarkWidth: 20,
          itemGap: 5,
          spacing: 20,
        }
      : {
          padding: { right: 0 },
          direction: "column",
          itemMarkHeight: 10,
          position: {
            horizontal: "right",
            vertical: "top",
          },
          itemMarkWidth: 20,
          itemGap: 5,
          spacing: 20,
        };

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
        <div className="w-full flex-col pb-5 px-10 my-3">
          <div className="w-full p-5 overflow-visible group h-full bg-white rounded-md my-4 ">
            <div className="flex justify-between">
              <h1 className="text-lg font-bold">Monthly</h1>
              <button
                onClick={fetchData}
                className="group-hover:block hidden text-cyan-600 hover:bg-cyan-100 p-2 rounded-md"
              >
                <RestartAltIcon />
                Reload
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <StyledEngineProvider injectFirst>
                <PieChart
                  series={[
                    {
                      data: data,
                      highlightScope: {
                        fade: "global",
                        highlight: "item",
                      },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                      valueFormatter,
                      arcLabelMinAngle: 20,
                      arcLabelRadius: 90,
                    },
                  ]}
                  slotProps={{
                    legend: legendProps,
                  }}
                  height={screenWidth < 1000 ? 600 : 500}
                />
              </StyledEngineProvider>
            )}
          </div>
          <div className="w-full p-5 overflow-visible group h-full bg-white rounded-md">
            <div className="flex justify-between">
              <h1 className="text-lg font-bold">Overall</h1>
              <button
                onClick={fetchData}
                className="group-hover:block hidden text-cyan-600 hover:bg-cyan-100 p-2 rounded-md"
              >
                <RestartAltIcon />
                Reload
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <PieChart
                series={[
                  {
                    data: data,
                    highlightScope: {
                      fade: "global",
                      highlight: "item",
                    },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                    valueFormatter,
                    arcLabelMinAngle: 20,
                    arcLabelRadius: 90,
                  },
                ]}
                slotProps={{
                  legend: legendProps,
                }}
                height={screenWidth < 1000 ? 600 : 500}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
