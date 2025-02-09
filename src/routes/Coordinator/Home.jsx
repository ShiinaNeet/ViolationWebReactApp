import { Container } from "@mui/material";
import Students from "../Students";

export default function Home() {
  return (
    <>
      <Container
        sx={{
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Students DataToGet={"department_head"} />
      </Container>
    </>
  );
}
