import { AdvancedImage } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { limitFill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

export default function QueryPhotoSmall(props) {
  const image = new CloudinaryImage(`query-photos/${props.publicId}`, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  }).resize(limitFill().width(100).height(100).gravity(autoGravity()));

  return <AdvancedImage cldImg={image} />;
}