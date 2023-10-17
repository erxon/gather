import { Stack, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

export default function FileUploadGuidelines({ content }) {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={1}>
      <CircleIcon color="primary" fontSize="small" />
      <Typography variant="body2">{content}</Typography>
    </Stack>
  );
}
