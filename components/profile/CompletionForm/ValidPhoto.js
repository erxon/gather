import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

export default function ValidPhoto({ publicId }) {
  let validPhoto = new CloudinaryImage(publicId, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(fill().width(300).height(200));

  return (
    <>
      <AdvancedImage cldImg={validPhoto} />
    </>
  );
}
