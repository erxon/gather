import nextConnect from "next-connect";
import { uploadPhoto } from "@/lib/controllers/photoController";

const handler = nextConnect();

handler.post(async (req, res) => {
  const { images, reportId, missingPerson, type } = req.body;

  const result = await uploadPhoto({ images, reportId, missingPerson, type });

  if (result && result.error) {
    res.status(400).json({ error: result.error });
  } else {
    res.status(200).json(result);
  }
});

export default handler;
