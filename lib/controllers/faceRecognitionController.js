import Match from "@/db/match";
import dbConnect from "@/db/dbConnect";

const getMatches = async (req, res, next) => {
  const {photoId} = req.query
  try {
    await dbConnect();
    const matches = await Match.findOne({ photoId: photoId });
    req.result = matches;
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const readMatches = async (req, res, next) => {
  try {
    await dbConnect();
    if (req.result) {
      return res.status(200).json(req.result);
    } else {
      const findMatches = await fetch(
        `https://face-recognition-for-gather-v2.onrender.com/matches/${req.body.photoId}`
      );

      const result = await findMatches.json();
      req.result = result.matches;
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const findMatches = async (req, res, next) => {
  const { photoId } = req.query;
  try {
    await dbConnect();
    const findMatches = await fetch(
      `https://face-recognition-for-gather-v2.onrender.com/matches/${photoId}`
    );

    req.result = findMatches;
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const storeMatches = async (req, res) => {
  //store matches in db
  const {photoId} = req.query
  const matches = {
    photoId: photoId,
    matches: req.result,
    createdAt: Date.now(),
  };

  try {
    await dbConnect();
    const newMatch = Match(matches);
    const saveMatch = await newMatch.save();

    res.status(200).json({ data: saveMatch, message: "Successfully saved." });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const updateMatches = async (req, res) => {
  //update matches
  try {
    await dbConnect();

    const reMatch = await fetch(
      `https://face-recognition-for-gather-v2.onrender.com/matches/${req.body.photoId}`
    );

    const result = await reMatch.json();
    const update = {
      matches: result.matches,
      updatedAt: Date.now(),
    };
    const findPhotoAndUpdate = await Match.findOneAndUpdate(
      { photoId: req.body.photoId },
      update
    );

    res
      .status(200)
      .json({ data: findPhotoAndUpdate, message: "Updated successfully." });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const resetMatches = async (req, res) => {
  //delete matches
  const { id } = req.query;
  try {
    await dbConnect();
    const reset = await Match.findByIdAndDelete(id);

    res.status(200).json({ data: reset, message: "Reset." });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

export {
  getMatches,
  readMatches,
  storeMatches,
  findMatches,
  updateMatches,
  resetMatches,
};
