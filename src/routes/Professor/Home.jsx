import { Container } from "@mui/material";
import Students from "../Students";

export default function Home() {
  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          pb: { xs: 8, sm: 12 },
          minHeight: "100vh",
          width: "90%",
          margin: "auto",
        }}
      >
        <Students DataToGet={"professor"} />
      </Container>
    </>
  );
}
