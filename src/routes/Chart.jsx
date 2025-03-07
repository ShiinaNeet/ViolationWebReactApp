import BarChartHead from "../components/Department_Head/BarChart";
import { Container } from "@mui/material";

export default function Chart() {
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
