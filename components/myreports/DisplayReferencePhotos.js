import { Box, Stack, Typography } from "@mui/material";
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
      <Stack direction="row" spacing={1}>
        {images.map((image) => {
          return (
            <Image
              alt="Reference images of the missing person"
              key={image._id}
              image={image}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
