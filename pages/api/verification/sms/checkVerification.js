import { checkVerificationCode, updateIsContactNumberVerified} from "@/lib/controllers/verificationController";
import nextConnect from "next-connect";

const handler = nextConnect()

handler.use((req, res, next) => {
    checkVerificationCode(req, res, next)
}).put((req, res) => {
    updateIsContactNumberVerified(req, res)
})

export default handler;