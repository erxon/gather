import { Stack, Typography } from "@mui/material";

export default function IconTypography({ Icon, customStyles, content }) {
  return (
    <Stack sx={customStyles} direction="row" spacing={1} alignItems="center">
      {Icon}
      <Typography sx={{color: "GrayText"}} variant="body2">{content}</Typography>
    </Stack>
  );
}
