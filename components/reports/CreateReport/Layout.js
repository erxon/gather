import { Typography } from "@mui/material";

export default function Layout({ head, children }) {
  return (
    <div>
      <Typography sx={{ mb: 3 }} variant="h6">
        {head}
      </Typography>
      {children}
    </div>
  );
}
