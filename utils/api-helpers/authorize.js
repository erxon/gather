import dbConnect from "@/db/dbConnect";

const checkType = async (req, res, next) => {
  try {
    await dbConnect();
    const user = await req.user;

    if (user.type === "authority") {
      next();
    } else {
      return res.status(400).json({ error: "User not an authority." });
    }
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const checkStatus = async (req, res, next) => {
  try {
    await dbConnect();
    const user = await req.user;

    if (user.status === "verified") {
      next();
    } else {
      return res.status(400).json({ error: "User not verified." });
    }
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

export {
    checkStatus,
    checkType
}