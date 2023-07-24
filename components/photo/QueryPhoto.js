import { AdvancedImage, responsive } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { limitFit, fill, fit, crop, pad, limitFill } from "@cloudinary/url-gen/actions/resize";
import { color } from "@cloudinary/url-gen/qualifiers/background";
import { autoGravity, compass } from "@cloudinary/url-gen/qualifiers/gravity";

export default function QueryPhoto(props) {
  const image = new CloudinaryImage(`query-photos/${props.publicId}`, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(fill().height(300).width(300));

  return <AdvancedImage cldImg={image} />;
}
