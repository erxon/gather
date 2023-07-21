import User from "@/db/user";
import dbConnect from "@/db/dbConnect";
import client from "twilio";

const newReport = async () => {
  try {
    await dbConnect();
    const users = await User.find({ type: "authority", status: "verified" });
    users.map((user) => {
      client(
        process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
        process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_TOKEN
      ).messages.create({
        from: "+15736976703",
        to: `+63${user.contactNumber}`,
        body: `Hello ${user.firstName} there is a new report uploaded in the system. Please check your account.`,
      });
    });
    return;
  } catch (error) {
    return error;
  }
};

const newActiveReport = async (req, res, next) => {
  try {
    await dbConnect()
    const citizens = await User.find({ type: "citizen", status: "verified" });
    if (citizens.length > 0) {
      citizens.map((citizen) => {
        client(
          process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
          process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_TOKEN
        ).messages.create({
          from: "+15736976703",
          to: `+63${citizen.contactNumber}`,
          body: `Hello ${citizen.firstName} there is a new active report. Please check your account.`,
        });
      });
    }
    next()
  } catch (error) {
    res.status(400).json({
      error: error,
      message: "Something went wrong sending messages.",
    });
  }
};

export { newReport, newActiveReport };
