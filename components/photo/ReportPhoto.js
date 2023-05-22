import { AdvancedImage, responsive } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { limitFit, fill } from "@cloudinary/url-gen/actions/resize";

export default function ReportPhoto(props) {
  const image = new CloudinaryImage(props.publicId, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  });

  return <AdvancedImage cldImg={image} width="100%" height="auto" />;
}
