import { Stack, Typography } from "@mui/material";

export default function IconText({ text, icon, textStyle }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {icon}
      <Typography sx={{ ...textStyle }} variant="body2">
        {text}
      </Typography>
    </Stack>
  );
}
