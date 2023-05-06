import { Button, Stack } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';

export default function TwitterAuthButton({ authType }) {
  //authType can be Login or Signup
  return (
    <>
      <Button startIcon={<TwitterIcon />}>{authType} with Twitter</Button>
    </>
  );
}
