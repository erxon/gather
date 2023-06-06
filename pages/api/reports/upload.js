import nextConnect from "next-connect";
import { addReporter } from "@/lib/controllers/reporterController";

const handler = nextConnect();

handler.post(async (req, res) => {
  const reporter = {
    photoUploaded: req.body.photo,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    relationToMissing: req.body.relationToMissing,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
  };
  try {
    const newReporter = await addReporter(reporter);
    res
      .status(200)
      .json({ message: "Photo successfully uploaded", result: newReporter });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong", error: error});
  }
});

export default handler;
