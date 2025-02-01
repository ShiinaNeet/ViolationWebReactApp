import { Container } from "@mui/material";
import Students from "../Students";

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
        <Students DataToGet={"professor"} />
      </Container>
    </>
  );
}
