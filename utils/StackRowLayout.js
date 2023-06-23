import { Stack } from "@mui/material";

export default function StackRowLayout({ spacing, children }) {
  return (
    <Stack direction="row" spacing={spacing} alignItems="center">
      {children}
    </Stack>
  );
}
