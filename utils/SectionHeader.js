import StackRowLayout from "./StackRowLayout";
import { Typography } from "@mui/material";

export default function SectionHeader({ icon, title }) {
  return (
    <StackRowLayout spacing={1}>
      {icon}
      <Typography variant="h6">{title}</Typography>
    </StackRowLayout>
  );
}
