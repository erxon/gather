import { verifyUser } from "@/lib/controllers/userController";
import auth from "@/middleware/auth";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";
import nextConnect from "next-connect";

const handler = nextConnect();
//User needs to be an authority, and user should be a verified user
handler
  .use(auth)
  .use((req, res, next) => {
    //check if the user is an authority
    isAuthority(req, res, next)
  })
  .use((req, res, next) => {
    //check if the user is verified
    isVerified(req, res, next)
  })
  .put((req, res) => {
    verifyUser(req, res);
  });

export default handler;
