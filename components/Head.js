import { Box, Typography,} from "@mui/material";
import StackRowLayout from "@/utils/StackRowLayout";

export default function Head({ title, icon }) {
  return (
    <Box sx={{ mb: 3 }}>
      <StackRowLayout spacing={1}>
        {icon}
        <Typography variant="h5">{title}</Typography>
      </StackRowLayout>
    </Box>
  );
}
