import dbConnect from "@/db/dbConnect";
import ReportLog from "@/db/reportLog";
import { updateReport } from "@/lib/controllers/reportController";
import { editReporter } from "@/lib/controllers/reporterController";
import auth from "@/middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .put(async (req, res, next) => {
    const user = await req.user;
    const { reportId } = req.query;
    const update = { ...req.body };
    console.log(update);

    updateReport(reportId, update, user._id)
      .then((data) => {
        req.result = {
          userId: user._id,
          data: data,
          update: update,
          message: "Success",
        };
        next();
      })
      .catch((error) => {
        return res.status(400).json({
          error: error,
          message: "Something went wrong while updating the report.",
        });
      });
  })
  .put((req, res, next) => {
    const { reportId } = req.query;
    editReporter(req.body.reporterId, { match: reportId })
      .then(() => {
        next();
      })
      .catch((error) => {
        res
          .status(400)
          .json({
            error: error,
            message: "Something went wrong in updating Reporter data",
          });
      });
  })
  .put(async (req, res) => {
    console.log(req.result);
    try {
      await dbConnect();

      const createLog = new ReportLog({
        reportId: req.result.data._id,
        editor: req.result.userId,
        note: {
          content: req.body.noteContent,
          viewer: req.body.noteViewer,
        },
        oldState: JSON.stringify(req.result.data),
        changes: JSON.stringify(req.result.update),
        createdAt: new Date(),
      });

      await createLog.save();

      res.status(200).json({
        ...req.result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error, message: "Something went wrong." });
    }
  });

export default handler;
