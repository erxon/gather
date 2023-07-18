import dbConnect from "@/db/dbConnect";
import User from "@/db/user";
import client from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_TOKEN;
const service = process.env.NEXT_PUBLIC_TWILIO_SERVICE;

const checkEmailVerificationCode = async (req, res, next) => {
  try {
    const checkCode = await client(accountSid, authToken)
      .verify.v2.services(service)
      .verificationChecks.create({ to: req.body.to, code: req.body.code });
    if (checkCode.status === "approved") {
      next();
    } else {
      throw new Error("Incorrect token.");
    }
  } catch (error) {
    res.status(400).json({ success: true, message: error.message });
  }
};

const emailVerification = async (req, res) => {
  try {
    const verifyEmail = await client(accountSid, authToken)
      .verify.v2.services(service)
      .verifications.create({
        channelConfiguration: {
          template_id: "d-64ebde4317fa42ffa1daeee5d4bd9a19",
        },
        to: req.body.to,
        channel: "email",
      });
    console.log(verifyEmail.sid);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const checkVerificationCode = async (req, res, next) => {
  const to = req.body.to;
  const code = req.body.code;
  try {
    const checkCode = await client(accountSid, authToken)
      .verify.v2.services(service)
      .verificationChecks.create({
        to,
        code,
      });
    if (checkCode.status === "approved") {
      next();
    } else {
      throw new Error("Incorrect token.");
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ error: error.message, message: "something went wrong" });
  }
};

const verifyPhoneNumber = async (req, res) => {
  const to = req.body.to;
  const channel = "sms";
  const locale = "en";

  try {
    const sendVerification = await client(accountSid, authToken)
      .verify.v2.services(service)
      .verifications.create({
        to,
        channel,
        locale,
      });

    console.log(`Sent verification ${sendVerification.sid}`);
    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message, message: "something went wrong." });
  }
};


const updateIsEmailVerified = async (req, res) => {
  try {
    await dbConnect();
    await User.findByIdAndUpdate(req.body.userId, {
      isEmailVerified: true,
    });
    res.status(200).json({ message: "Verification sucess." });
  } catch (error) {
    res.status(400).json({
      message: error.messge,
    });
  } 
}

const updateIsContactNumberVerified = async (req, res) => {
  try {
    await dbConnect();
    await User.findByIdAndUpdate(req.body.userId, {
      isContactNumberVerified: true,
    });
    res.status(200).json({ message: "Verification sucess." });
  } catch (error) {
    res.status(400).json({
      message: error.messge,
    });
  }
};

export {
  verifyPhoneNumber,
  checkVerificationCode,
  updateIsContactNumberVerified,
  updateIsEmailVerified,
  emailVerification,
  checkEmailVerificationCode
};
