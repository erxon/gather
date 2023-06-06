import Authenticate from "@/utils/authority/Authenticate";
import { Typography } from "@mui/material";

function RenderPhotos() {
  return <Typography>Photos</Typography>;
}

export default function Page() {
  return (
    <Authenticate>
      <RenderPhotos />
    </Authenticate>
  );
}
