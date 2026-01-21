import { Container } from "@mui/material";
import FormsList from "../components/FormList";

function Forms() {
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 15, sm: 15 },
        pb: { xs: 8, sm: 12 },
        minHeight: "100vh",
        width: "90%",
        mx: "auto",
      }}
    >
      <div className="w-full h-full mx-auto ">
        <FormsList />
      </div>
    </Container>
  );
}

export default Forms;
