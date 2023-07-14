import { Box, Button, Paper, Typography, Stack } from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

export default function PhoneNumberVerification({
  contactNumber,
  setCompleted,
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <LocalPhoneOutlinedIcon />
        <Typography sx={{ mb: 2 }} variant="h6">
          Phone number
        </Typography>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ mb: 0.5 }}>
          Click send verification so we could verify your phone number.
        </Typography>
        <Typography variant="body2">
          Your phone number{" "}
          <span style={{ fontWeight: "bold" }}>{contactNumber}</span>
        </Typography>
      </Box>
      <Button
        onClick={() => {
          setCompleted(true);
        }}
        variant="contained"
      >
        Send Verification
      </Button>
    </Paper>
  );
}
