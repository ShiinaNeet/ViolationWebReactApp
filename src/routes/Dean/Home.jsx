import ProgramHeadTable from "@components/Dean/ProgramHeadTable";
// import DepartmentTable from "@components/Dean/DepartmentTable";
import { Container } from "@mui/material";
export default function Home() {
  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          pt: { xs: 10, sm: 15, md: 15 },
          pb: { xs: 8, sm: 12 },
          minHeight: "100vh",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <ProgramHeadTable />
      </Container>
    </>
  );
}
