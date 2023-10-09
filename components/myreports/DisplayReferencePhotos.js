import { Box, Grid, Stack, Typography } from "@mui/material";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { limitFit, fill } from "@cloudinary/url-gen/actions/resize";

function Image({ image }) {
  const cloudImage = new CloudinaryImage(`report-photos/${image.publicId}`, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(fill().width(150).height(150));

  return (
    <Box>
      <AdvancedImage cldImg={cloudImage} />
    </Box>
  );
}

export default function DisplayReferencePhotos({ images }) {
  return (
    <Box>
      <Grid container spacing={0.5}>
        {images.map((image) => {
          return (
            <Grid key={image._id} item>
              <Image
                alt="Reference images of the missing person"
                image={image}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
