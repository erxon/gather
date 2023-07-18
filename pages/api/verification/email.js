import {
  checkEmailVerificationCode,
  emailVerification,
  updateIsEmailVerified,
} from "@/lib/controllers/verificationController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .post((req, res) => {
    emailVerification(req, res);
  })
  .use((req, res, next) => {
    checkEmailVerificationCode(req, res, next);
  })
  .put((req, res) => {
    updateIsEmailVerified(req, res);
  });

export default handler;
