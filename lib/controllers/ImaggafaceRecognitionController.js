import Photo from "@/db/photo";
import dbConnect from "@/db/dbConnect";
import FaceRecognition from "@/db/faceRecognition";
import Match from "@/db/match";
import got from "got";

const config = {
  apiKey: process.env.NEXT_PUBLIC_IMAGGA_API_KEY,
  apiSecret: process.env.NEXT_PUBLIC_IMAGGA_API_SECRET,
};

const createFaceID = async (publicId) => {
  const imageUrl = `https://res.cloudinary.com/dg0cwy8vx/image/upload/${publicId}`;
  const url =
    "https://api.imagga.com/v2/faces/detections?return_face_id=1&image_url=" +
    encodeURIComponent(imageUrl);
  try {
    const response = await got(url, {
      username: config.apiKey,
      password: config.apiSecret,
    });
    const body = JSON.parse(response.body);
    return body.result.faces[0].face_id;
  } catch (error) {
    console.log(error.response.body);
  }
};

const findMatches = async (req, res, next) => {
  try {
    const indexId = "missing_persons";
    const faceId = await createFaceID(`query-photos/${req.body.queryPhoto}`);
    const url =
      "https://api.imagga.com/v2/faces/recognition/" +
      indexId +
      "?face_id=" +
      faceId;

    const response = await got(url, {
      username: config.apiKey,
      password: config.apiSecret,
    });
    const result = JSON.parse(response.body);
    req.result = {
      photoId: req.body.queryPhoto,
      result: result.result.people,
    };

    next();
    // res.status(200).json(JSON.parse(response.body));
  } catch (error) {
    res.status(400).json(error);
  }
};

const saveMatchesToDB = async (req, res) => {
  try {
    const newMatches = new Match({
      photoId: req.result.photoId,
      result: req.result.result,
      createdAt: Date.now(),
    });
    const result = await newMatches.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const removeMatches = async (req, res) => {
  try {
    await dbConnect();
    const result = await Match.findByIdAndDelete(req.body.id);
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error);
  }
};

const deletePastMatches = async (req, res, next) => {
  try {
    await dbConnect();
    await Match.findByIdAndDelete(req.body.id);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
};

const getPhotos = async (id) => {
  try {
    const reportPhotos = await Photo.findById(id);
    return reportPhotos;
  } catch (error) {
    return error;
  }
};

const generateIndividualFaceID = async (req, res) => {
  try {
    const faceId = await createFaceID(`query-photos/${req.body.query}`);
    res.status(200).json({ result: faceId });
  } catch (error) {
    res.status(400).json(error);
  }
};

const generateMultipleFaceID = async (req, res, next) => {
  //This should be an array of images from a Photo object with type reference
  const { photoId } = req.query;
  try {
    const reportPhotos = await getPhotos(photoId);
    const faceIDs = [];
    for (let i = 0; i < reportPhotos.images.length; i++) {
      const faceID = await createFaceID(
        `report-photos/${reportPhotos.images[i].publicId}`
      );
      faceIDs.push(faceID);
    }
    req.newFaceIDs = { reportId: reportPhotos.reportId, faceIDs: faceIDs };
    next();
  } catch (error) {
    res.status(400).json(error);
  }
};

const indexFaceIDs = async (req, res, next) => {
  const faces = {
    faces: {
      people: {
        ...req.body.person,
      },
    },
  };
  try {
    await got.put(
      "http://api.imagga.com/v2/faces/recognition/missing_persons",
      {
        username: config.apiKey,
        password: config.apiSecret,
        json: faces.faces,
      }
    );
    next();
  } catch (error) {
    res.status(400).json(error);
  }
};

const trainFaceRecognition = async (req, res) => {
  try {
    const response = await got.post(
      "https://api.imagga.com/v2/faces/recognition/missing_persons",
      {
        username: config.apiKey,
        password: config.apiSecret,
      }
    );
    console.log(response.body);
    res.status(200).json(JSON.parse(response.body));
  } catch (error) {
    res.status(400).json(error.response.body);
  }
};

const trainingResult = async (req, res) => {
  const { ticketId } = req.query;
  try {
    const response = await got(
      `https://api.imagga.com/v2/tickets/${ticketId}`,
      {
        username: config.apiKey,
        password: config.apiSecret,
      }
    );
    res.status(200).json(JSON.parse(response.body));
  } catch (error) {
    res.status(400).json(error.response.body);
  }
};

const saveToDB = async (req, res) => {
  const { reportId, faceIDs } = req.newFaceIDs;
  try {
    const newFaceIDs = await FaceRecognition({
      reportId: reportId,
      faceIDs: faceIDs,
    });
    const result = await newFaceIDs.save();
    res.status(200).json({ message: "Saved.", result: result });
  } catch (error) {
    res.status(400).json(error);
  }
};

const removePerson = async (req, res) => {
  try {
    const indexId = "missing_persons";
    const url = `https://api.imagga.com/v2/faces/recognition/${indexId}/${req.body.personId}`;
    const response = await got.delete(url, {
      username: config.apiKey,
      password: config.apiSecret,
    });
    res.status(200).json(JSON.stringify(response.body));
  } catch (error) {
    res.status(400).json(error);
  }
};

export {
  saveToDB,
  findMatches,
  saveMatchesToDB,
  removePerson,
  indexFaceIDs,
  trainingResult,
  trainFaceRecognition,
  generateMultipleFaceID,
  generateIndividualFaceID,
  deletePastMatches,
  removeMatches
};
