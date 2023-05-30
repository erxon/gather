import nextConnect from "next-connect";
import { findPhoto } from "@/lib/controllers/photoController";

const handler = nextConnect();

handler.get(async (req, res) => {
  const {photoId} = req.query;
  const retrievedPhoto = await findPhoto(photoId);

  if (retrievedPhoto && retrievedPhoto.error) {
    res.status(400).json(retrievedPhoto.error);
  } else {
    res.status(200).json(retrievedPhoto);
  }
});


export default handler;
