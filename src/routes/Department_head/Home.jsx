import { Container } from "@mui/material";
import Students from "../Students";

export default function Home() {
  return (
    <>
      {/* <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 10, sm: 15 },
          pb: { xs: 8, sm: 12 },
        }}
      > */}
      <Students DataToGet={"department_head"} />
      {/* </Container> */}
    </>
  );
}
