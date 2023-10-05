import { addDentalAndFingerprintRecord } from "@/lib/controllers/reportController";
import auth from "@/middleware/auth";
import { isAuthorized } from "@/utils/api-helpers/authorize";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    isAuthorized(req, res, next);
  })
  .post((req, res) => {
    addDentalAndFingerprintRecord(req, res);
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
