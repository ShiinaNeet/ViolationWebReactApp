import { Container } from "@mui/material";
import AlertMessageStudent from "../../components/AlertMessageStudent";
export default function Home() {
  return (
    <>
      <Container
        sx={{
          pt: { xs: 15, sm: 15 },
          pb: { xs: 8, sm: 12 },
          minHeight: "100vh",
          height: "100vh"
        }}
      >
        <div className="my-2 w-full">
          {/* <DocumentList /> */}
          <AlertMessageStudent />
        </div>
      </Container>
    </>
  );
}
