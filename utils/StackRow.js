import { Stack } from "@mui/material";

export default function StackRow({ children, styles }) {
  return (
    <Stack sx={styles} direction="row" spacing={0.5} alignItems="center">
      {children}
    </Stack>
  );
}
