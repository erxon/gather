import { Button, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function FacebookAuthButton({ authType }) {
  //authType can be Login or Signup
  return (
    <>
      <Button startIcon={<FacebookIcon />}>{authType} with Facebook</Button>
    </>
  );
}
