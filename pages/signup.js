import Signup from "@/components/authentication/Signup";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <Box sx={{maxWidth: 400, margin: "auto"}}>
      <Signup />
    </Box>
  );
}
