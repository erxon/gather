import dbConnect from "@/db/dbConnect";

const isAuthorized = async (req, res, next) => {
  try {
    await dbConnect();

    const user = await req.user;
    if (!user) {
      return res.status(400).json({ error: "unauthorized" });
    }
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: error, message: "Something went wrong." });
  }
};

const isAuthority = async (req, res, next) => {
  try {
    await dbConnect();
    const user = await req.user;

    if (user && user.type === "authority") {
      next();
    } else {
      return res.status(400).json({ error: "User not an authority." });
    }
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const isVerified = async (req, res, next) => {
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

export { isAuthority, isVerified, isAuthorized };
