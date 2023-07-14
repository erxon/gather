import { Box, Button, Paper, Typography, Stack } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function EmailVerification({ email, setCompleted }) {
  return (
    <div>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <EmailOutlinedIcon />
          <Typography sx={{ mb: 2 }} variant="h6">
            Email verification
          </Typography>
        </Stack>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 0.5 }}>
            Click send verification so we could verify your email address.
          </Typography>
          <Typography variant="body2">
            Your email <span style={{ fontWeight: "bold" }}>{email}</span>
          </Typography>
        </Box>
        <Button onClick={() => setCompleted(true)} variant="contained">Send Verification</Button>
      </Paper>
    </div>
  );
}
