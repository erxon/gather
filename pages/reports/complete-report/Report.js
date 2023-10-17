import { Paper, Typography, Stack, Box, Chip } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Report({ data }) {
  const reportedAt = new Date(data.reportedAt);
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography fontWeight={500} variant="body1" sx={{ mb: 2 }}>
        Your report
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={400}
            sx={{ mb: 0.5 }}
            color="secondary"
          >
            This report will be verified by authorities.
          </Typography>
          <Chip
            size="small"
            color="secondary"
            variant="filled"
            label={data.status}
          />
        </Box>
        <Box>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PlaceIcon />
              <Typography variant="body1">{data.lastSeen}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon />
              <Typography variant="body2">
                {data.gender}, {data.age} years old
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon />
              <Typography variant="body2">
                {reportedAt.toDateString()} {reportedAt.toLocaleTimeString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
