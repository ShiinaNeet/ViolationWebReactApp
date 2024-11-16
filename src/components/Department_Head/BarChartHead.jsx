import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { BarChart } from "@mui/x-charts/BarChart";

export default function BarChartHead() {
  const [seriesNb, setSeriesNb] = React.useState(2);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== "number") {
      return;
    }
    setItemNb(newValue);
  };
  const handleSeriesNbChange = (event, newValue) => {
    if (typeof newValue !== "number") {
      return;
    }
    setSeriesNb(newValue);
  };

  return (
    <div className="container mx-auto h-full px-2 md:w-full">
      <Box sx={{ width: "100%" }} className="m-5">
        <h1>Department name here</h1>
        <BarChart
          height={300}
          xAxis={[
            {
              scaleType: "band",
              data: [
                "Cheating",
                "Bullying",
                "Vandalism",
                "Stealing",
                "Lying",
                "Disrespect",
                "Skipping",
                "Smoking",
                "Drinking",
                "Gambling",
                "Fighting",
                "Tardiness",
              ],
            },
          ]}
          series={[
            { data: [4, 3, 5, 2, 7, 8, 6, 5, 4, 3, 2, 1] }, // Data for the first series
            { data: [1, 6, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Data for the second series
            { data: [2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }, // Data for the third series
          ]}
        />
      </Box>
    </div>
  );
}

const highlightScope = {
  highlight: "series",
  fade: "global",
};

const series = [
  {
    label: "series 1",
    data: [
      2423, 2210, 764, 1879, 1478, 1373, 1891, 2171, 620, 1269, 724, 1707, 1188,
      1879, 626, 1635, 2177, 516, 1793, 1598,
    ],
  },
  {
    label: "series 2",
    data: [
      2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 2031, 1757, 862,
      2446, 910, 2430, 2300, 805, 1835, 1684, 2197,
    ],
  },
  {
    label: "series 3",
    data: [
      1145, 1214, 975, 2266, 1768, 2341, 747, 1282, 1780, 1766, 2115, 1720,
      1057, 2000, 1716, 2253, 619, 1626, 1209, 1786,
    ],
  },
  {
    label: "series 4",
    data: [
      2361, 979, 2430, 1768, 1913, 2342, 1868, 1319, 1038, 2139, 1691, 935,
      2262, 1580, 692, 1559, 1344, 1442, 1593, 1889,
    ],
  },
  {
    label: "series 5",
    data: [
      968, 1371, 1381, 1060, 1327, 934, 1779, 1361, 878, 1055, 1737, 2380, 875,
      2408, 1066, 1802, 1442, 1567, 1552, 1742,
    ],
  },
  {
    label: "series 6",
    data: [
      2316, 1845, 2057, 1479, 1859, 1015, 1569, 1448, 1354, 1007, 799, 1748,
      1454, 1968, 1129, 1196, 2158, 540, 1482, 880,
    ],
  },
  {
    label: "series 7",
    data: [
      2140, 2082, 708, 2032, 554, 1365, 2121, 1639, 2430, 2440, 814, 1328, 883,
      1811, 2322, 1743, 700, 2131, 1473, 957,
    ],
  },
  {
    label: "series 8",
    data: [
      1074, 744, 2487, 823, 2252, 2317, 2139, 1818, 2256, 1769, 1123, 1461, 672,
      1335, 960, 1871, 2305, 1231, 2005, 908,
    ],
  },
  {
    label: "series 9",
    data: [
      1792, 886, 2472, 1546, 2164, 2323, 2435, 1268, 2368, 2158, 2200, 1316,
      552, 1874, 1771, 1038, 1838, 2029, 1793, 1117,
    ],
  },
  {
    label: "series 10",
    data: [
      1433, 1161, 1107, 1517, 1410, 1058, 676, 1280, 1936, 1774, 698, 1721,
      1421, 785, 1752, 800, 990, 1809, 1985, 665,
    ],
  },
].map((s) => ({ ...s, highlightScope }));
