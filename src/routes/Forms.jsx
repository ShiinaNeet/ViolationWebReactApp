import { Container } from "@mui/material";

function Forms() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 15, sm: 15 },
        pb: { xs: 8, sm: 12 },
        height: "100vh",
      }}
    >
      <div className="w-full h-full mx-auto "></div>
    </Container>
  );
}

export default Forms;
