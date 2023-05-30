import nextConnect from "next-connect";
import { uploadPhoto } from "@/lib/controllers/photoController";

const handler = nextConnect();

handler.post(async (req, res) => {
  const { publicId, reportId, fileName, mpName } = req.body;

  const result = await uploadPhoto({ publicId, reportId, fileName, mpName });

  if (result && result.error) {
    res.status(400).json({ error: result.error });
  } else {
    res.status(200).json(result);
  }
});

export default handler;
