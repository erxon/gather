import { Box, Typography } from "@mui/material";

export default function Layout({ head, subheading, children }) {
  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">{head}</Typography>
        <Typography>{subheading}</Typography>
      </Box>
      {children}
    </div>
  );
}
