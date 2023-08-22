import dbConnect from "@/db/dbConnect";
import Update from "@/db/update";
import Report from "@/db/report";

const createUpdate = async (req, res) => {
  try {
    await dbConnect();
    const user = await req.user;

    //create new update
    const update = {
      user: user._id,
      reportId: req.body.reportId,
      text: req.body.text,
      image: req.body.image,
      vide: req.body.video,
      createdAt: req.body.createdAt,
    };

    const newUpdate = new Update(update);

    //add new update to database
    await newUpdate.save();

    res.status(200).json({
      message: "successfull added.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "something went wrong.",
    });
  }
};

const findUpdatesByReport = async (req, res) => {
  const { reportId } = req.query;

  try {
    await dbConnect();

    const updates = await Update.find({ reportId: reportId });

    res.status(200).json(updates);
  } catch (error) {
    res.status(400).json({ error: error, message: "something went wrong." });
  }
};

const findUpdate = async (req, res, next) => {
  const { id } = req.query;
  try {
    await dbConnect();
    const update = await Update.findById(id).populate("user").exec();

    req.result = update;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "something went wrong." });
  }
};

const getUpdate = async (req, res) => {
  const update = req.result;
  res.status(200).json(update);
};

const removeUpdate = async (req, res) => {
  try {
    await dbConnect();

    const update = await Update.findByIdAndDelete(req.result._id);

    res
      .status(200)
      .json({ updateRemoved: update, message: "removed successfully." });
  } catch (error) {
    res.status(400).json({ message: "something went wrong." });
  }
};

const editUpdate = async (req, res) => {
  try {
    await dbConnect();

    const changesToApply = {
      text: req.body.text,
      image: req.body.image,
      video: req.body.video,
      updatedAt: new Date(),
    };

    const updateToEdit = await Update.findByIdAndUpdate(
      req.result._id,
      changesToApply
    );

    res
      .status(200)
      .json({ update: updateToEdit, message: "changes applied successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error, message: "something went wrong." });
  }
};

export {
  createUpdate,
  findUpdatesByReport,
  findUpdate,
  getUpdate,
  removeUpdate,
  editUpdate,
};
