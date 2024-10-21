import React, { useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { Button } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { valueFormatter } from "../utils/ChartData";

export default function Chart() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

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

    return (
        <>
            <div className=" w-full flex items-center flex-col p-10 gap-y-5">
                <div className="w-full p-5 overflow-y-visible group h-[500px]">
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
                         
                            
                        />
                    )}
                </div>
                <div className="w-full p-5 overflow-y-visible group h-[500px]">
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
                         
                        />
                    )}
                </div>
            </div>
        </>
    );
}
