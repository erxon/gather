import { AdvancedImage, responsive } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { limitFit, fill } from "@cloudinary/url-gen/actions/resize";

export default function ReportPhotoLarge(props) {
  const image = new CloudinaryImage(props.publicId, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(fill().width(400).height(500));

  return <AdvancedImage cldImg={image} />;
}
