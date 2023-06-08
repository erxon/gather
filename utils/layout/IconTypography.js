import { Stack, Typography } from "@mui/material";

export default function IconTypography({ Icon, customStyles, content }) {
  return (
    <Stack sx={customStyles} direction="row" spacing={0.5} alignItems="center">
      {Icon}
      <Typography variant="body2">{content}</Typography>
    </Stack>
  );
}
