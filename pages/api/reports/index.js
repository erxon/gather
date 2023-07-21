import nextConnect from "next-connect";
import { createReport, getReports } from "@/lib/controllers/reportController";
import { newReport } from "@/lib/controllers/smsNotification";

const handler = nextConnect();

handler
  .post((req, res) => {
    const data = {
      ...req.body,
      reportedAt: new Date(),
    };

    createReport(data)
      .then(async (response) => {
        if (response && response.errors) {
          res.status(400).json({ error: "Important fields are missing" });
        }
        //Uncomment this to enable messaging notifications
        // await newReport()
        res
          .status(200)
          .json({ data: response, message: "successfully uploaded" });
      })
      .catch((err) => {
        res.json({ error: err });
      });
  })
  .get((req, res) => {
    //get all reports
    getReports()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  });

export default handler;
