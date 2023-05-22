import { Button } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function TwitterButton() {
  return (
    <>
      <Button variant="contained" size="small" startIcon={<TwitterIcon />}>
        Share to Twitter
      </Button>
    </>
  );
}
