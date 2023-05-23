import { Button, Stack, Typography } from "@mui/material";
import { TwitterShareButton, TwitterIcon } from "react-share";
export default function TwitterButton() {
  return (
    <>
      <TwitterShareButton>
        <Stack alignItems="center" direction="row" spacing={1}>
          <TwitterIcon size={32} round/>
          <Typography>Share to Twitter</Typography>
        </Stack>
      </TwitterShareButton>
    </>
  );
}
