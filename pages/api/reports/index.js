import nextConnect from "next-connect";
import { createReport, getReports } from "@/lib/controllers/reportController";
import { newReport } from "@/lib/controllers/smsNotification";
import auth from "@/middleware/auth";

const handler = nextConnect();

handler
  .use(auth)
  .post(async (req, res) => {
    const user = await req.user;
    const data = {
      ...req.body,
      account: user ? user._id : null,
      username: user ? user.username : null,
      reportedAt: new Date(),
    };

    createReport(data)
      .then(async (response) => {
        if (response && response.errors) {
          return res
            .status(400)
            .json({ error: "Important fields are missing" });
        }
        //Uncomment this to enable messaging notifications
        // await newReport()
        return res
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
