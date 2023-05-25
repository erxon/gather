import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { crop, fill } from "@cloudinary/url-gen/actions/resize";
import { max } from "@cloudinary/url-gen/actions/roundCorners";
import { format } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/quality";


export default function ProfilePhotoAvatar({publicId}){
    let profilePhoto = new CloudinaryImage(publicId, {
        cloudName: "dg0cwy8vx",
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
        apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
      })
      .resize(
        fill().width(48).height(48)
      ).roundCorners(max()).delivery(format(auto())) ;

    return <>
        <AdvancedImage cldImg={profilePhoto} />
    </>
}