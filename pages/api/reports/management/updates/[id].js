import {
  editUpdate,
  findUpdate,
  getUpdate,
  removeUpdate,
} from "@/lib/controllers/report-management/updatesController";
import auth from "@/middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use(async (req, res, next) => {
    const user = await req.user;
    if (user && user.status === "verified") {
      next();
    } else {
      res.status(400).json({
        message: "user not authorized",
      });
    }
  })
  .use((req, res, next) => {
    findUpdate(req, res, next);
  })
  .use((req, res, next) => {
    if (req.result === null) {
      res.status(400).json({ message: "not found." });
    } else {
      next();
    }
  })
  .get((req, res) => {
    getUpdate(req, res);
  })
  .put((req, res) => {
    editUpdate(req, res);
  })
  .delete((req, res) => {
    removeUpdate(req, res);
  });

export default handler;
