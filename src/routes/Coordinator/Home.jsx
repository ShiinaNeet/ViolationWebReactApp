import { Container } from "@mui/material";
import DocumentList from "../../components/DocumentList";

export default function Home() {
  return (
    <>
      <Container
        sx={{
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 10, sm: 15 },
            pb: { xs: 8, sm: 12 },
            minHeight: "100vh",
          }}
        >
          <div className="w-full mx-auto h-full">
            <div className="flex flex-col justify-between h-fit rounded-md my-2">
              <DocumentList />
            </div>
          </div>
        </Container>
      </Container>
    </>
  );
}
