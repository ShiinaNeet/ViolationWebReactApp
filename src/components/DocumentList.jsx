import React from "react";
import { Download } from "@mui/icons-material";
import { Button, Card, CardContent, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthProvider";

function DocumentList() {
  const { userType } = useAuth();
  const [documents, setDocuments] = React.useState([]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  React.useEffect(() => {
    console.log("User Type:", userType);
    if (userType === null) {
      setDocuments([
        "Student-Incident-Report",
        "Formal-Complaint-Letter",
        "Call-Slip",
        "Notice-Of-Case-Dismissal",
        "Temporary-Gate-Pass",
        "Request-For-Non-Wearing-Of-Uniform",
      ]);
    } else if (userType === "COORDINATOR") {
      setDocuments([
        "Letter-Of-Suspension",
        "Notice-Of-Case-Dismissal",
        "Written-Reprimand-For-Violation-Of-Norms-Conduct",
        "Written-Warning-For-Violation-Of-Norms-Conduct",
      ]);
    } else {
      setDocuments([
        "Student-Incident-Report",
        "Formal-Complaint-Letter",
        "Call-Slip",
        "Notice-Of-Case-Dismissal",
        "Temporary-Gate-Pass",
        "Request-For-Non-Wearing-Of-Uniform",
      ]);
    }
  }, [userType]);

  return (
    <>
      <Typography
        variant="h5"
        color="error"
        className="text-left font-bold text-gray-800 mb-10 py-5"
      >
        Request File
      </Typography>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 mb-5"
      >
        {documents.map((filename, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="shadow-md transition-transform transform hover:scale-105">
              <CardContent className="flex items-center justify-between">
                <Typography
                  variant="body1"
                  className="text-gray-700 font-semibold"
                >
                  {filename.replace(/-/g, " ")}
                </Typography>
                <Tooltip title="Download File" arrow>
                  <a
                    href={`/documents/${filename}.docx`}
                    download
                    target="_blank"
                  >
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Download />}
                    >
                      Download
                    </Button>
                  </a>
                </Tooltip>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

export default DocumentList;
