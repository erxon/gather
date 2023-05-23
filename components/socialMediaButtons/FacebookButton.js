import { Button, Stack, Typography } from "@mui/material";
import { FacebookShareButton, FacebookIcon } from "react-share";
export default function FacebookButton(props) {
  return (
    <>
      <FacebookShareButton
        url={props.url}
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <FacebookIcon size={32} round />
          <Typography>Share to Facebook</Typography>
        </Stack>
      </FacebookShareButton>
    </>
  );
}
