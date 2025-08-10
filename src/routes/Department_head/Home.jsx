import { Container } from "@mui/material";
import Students from "../Students";

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
        <Students DataToGet={"department_head"} />
      </Container>
    </>
  );
}
