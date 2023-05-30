import nextConnect from "next-connect";
import { updateReport } from "@/lib/controllers/reportController";

const handler = nextConnect();

handler.put(async (req, res) => {
  const { reportId } = req.query;
  const update = {
    photoId: req.body.photoId,
  };
  console.log(update)

  const updateResponse = await updateReport(reportId, update);

  if (updateResponse && updateResponse.error) {
    res.status(400).json(updateResponse.error);
  } else {
    res.status(200).json({
      message: "Photo successfully attached to the report",
      data: updateResponse,
    });
  }
});
