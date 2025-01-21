import ProgramHeadTable from "@components/Dean/ProgramHeadTable";
import DepartmentTable from "@components/Dean/DepartmentTable";
import { Container } from "@mui/material";
export default function Home() {
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: { xs: 10, sm: 15 },
          pb: { xs: 8, sm: 12 },
          height: "100vh",
        }}
      >
        <ProgramHeadTable />
        <DepartmentTable />
      </Container>
    </>
  );
}
