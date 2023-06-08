import { Box, Typography, Divider, Stack } from "@mui/material";

export default function Head({ title, component }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack sx={{mb: 3}} direction="row" alignItems="center">
        <Typography variant="h5">
          {title}
        </Typography>
        <Box sx={{textAlign: 'right', width: '100%'}}>
          {component}
        </Box>
        
      </Stack>

      <Divider />
    </Box>
  );
}
