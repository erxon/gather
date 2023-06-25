import Match from "@/db/match";
import dbConnect from "@/db/dbConnect";

const getMatches = async (req, res, next) => {
  try {
    await dbConnect();
    const matches = await Match.find({ photoId: req.body.photoId });
    req.result = matches;
    next();
  } catch (error) {
    res.status(400).json({error: error, message: 'Something went wrong.'})
  }
};

const readMatches = async (req, res) => {
  try {
    await dbConnect();
    
  } catch (error){
    res.status(400).json({error: error, message: 'Something went wrong.'})
  }
}
