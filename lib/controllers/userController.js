import dbConnect from "@/db/dbConnect";
import User from "@/db/user";

const verifyUser = async (req, res) => {
  try {
    await dbConnect();

    const update = {
      status: "verified",
    };
    const findUserAndUpdate = await User.findByIdAndUpdate(req.body.id, update);

    res
      .status(200)
      .json({ result: findUserAndUpdate, message: "User has been verified." });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

export {
    verifyUser
} 
