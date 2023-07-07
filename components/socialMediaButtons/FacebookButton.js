import { Button, Stack, Typography } from "@mui/material";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { FacebookProvider, ShareButton } from "react-facebook";
export default function FacebookButton(props) {
  const handleClick = () => {};
  return (
    <>
    <FacebookProvider appId="260770046646432">
      <ShareButton href={props.url}>
        Share
      </ShareButton>
    </FacebookProvider>
      <FacebookShareButton
        url={props.url}
        quote={`Missing Person ${props.name} `}
        hashtag={`#MissingPerson${props.name}`}
        
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <FacebookIcon size={32} round />
          <Typography>Share to Facebook</Typography>
        </Stack>
      </FacebookShareButton>
    </>
  );
}
