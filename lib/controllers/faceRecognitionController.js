import Match from "@/db/match";
import dbConnect from "@/db/dbConnect";
import fetch from "node-fetch";
import { pusher } from "@/utils/pusher";
import Notification from "@/db/notification";
import Report from "@/db/report";

const getMatches = async (req, res, next) => {
  const { photoId } = req.query;
  try {
    await dbConnect();
    const matches = await Match.findOne({ photoId: photoId });
    req.result = matches;
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const pastMatches = (req, res) => {
  res.status(200).json(req.result);
};

const readMatches = async (req, res, next) => {
  const { photoId } = req.query;
  try {
    await dbConnect();
    if (req.result) {
      return res.status(200).json(req.result);
    } else {
      fetch(
        
        `https://face-recognition-for-gather-v2.onrender.com/matches/${photoId}`
      ).then(async (response) => {
        const result = await response.json();
        req.result = result;
        next();
      });

      // const result = await findMatches.json();
      // req.result = result.matches;
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
    req.result = await findMatches.json();
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const storeMatches = async (req, res) => {
  //store matches in db
  const { photoId } = req.query;
  const matches = {
    photoId: photoId,
    matches: req.result.matches,
    createdAt: Date.now(),
  };

  try {
    await dbConnect();
    if (req.result.matches.length > 0) {
      const newMatch = Match(matches);
      const saveMatch = await newMatch.save();

      return res.status(200).json(saveMatch);
    } else {
      return res.status(200).json(null)
    }
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const updateMatches = async (req, res) => {
  //update matches
  try {
    await dbConnect();

    fetch(
      `https://face-recognition-for-gather-v2.onrender.com/matches/${req.body.photoId}`
    ).then(async (response) => {
      const result = response.json();
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
    });
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

const notifyReporter = async (req, res, next) => {
  try {
    await pusher.trigger(
      `notification-citizen-${req.body.userId}`,
      "match-found",
      {
        body: {
          createdAt: Date.now(),
          body: {
            type: "match-found",
            message: "The missing person in your report was possibly found.",
          },
        },
      }
    );
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const saveNotification = async (req, res, next) => {
  try {
    await dbConnect();
    const notification = {
      channel: `notification-citizen-${req.body.userId}`,
      event: "match-found",

      createdAt: Date.now(),
      body: {
        type: "match-found",
        message: "The missing person in your report was possibly found.",
        reportId: req.body.reportId,
        photoUploaded: req.body.photoUploadedId,
      },
    };
    await Notification(notification).save();
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

const updateReport = async (req, res) => {
  try {
    await dbConnect();
    const setFound = await Report.findByIdAndUpdate(req.body.reportId, {
      found: true,
    });
    res.status(200).json({ result: setFound });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export {
  getMatches,
  readMatches,
  storeMatches,
  findMatches,
  updateMatches,
  resetMatches,
  updateReport,
  saveNotification,
  notifyReporter,
  pastMatches,
};
