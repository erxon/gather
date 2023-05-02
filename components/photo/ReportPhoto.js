import { AdvancedImage } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

export default function ReportPhoto(props) {
  const image = new CloudinaryImage(props.publicId, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  }).resize(fill().width(350).height(200));

  return <AdvancedImage cldImg={image} />;
}
