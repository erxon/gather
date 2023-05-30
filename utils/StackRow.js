import { Stack } from "@mui/material";

export default function StackRow({ children }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {children}
    </Stack>
  );
}
