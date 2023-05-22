import { Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function FacebookButton() {
  return (
    <>
      <Button variant="contained" size="small" startIcon={<FacebookIcon />}>
        Share to Facebook
      </Button>
    </>
  );
}
