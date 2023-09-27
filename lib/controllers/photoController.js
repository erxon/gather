import dbConnect from "@/db/dbConnect";
import Photo from "@/db/photo";

//Create
export function uploadPhoto(data) {
  const result = dbConnect().then(async () => {
    const newPhoto = new Photo(data);
    try {
      const savedNewPhoto = await newPhoto.save();
      return { message: "Successfully saved", data: savedNewPhoto };
    } catch (error) {
      return error;
    }
  });
  return result;
}
//Read
export function findPhoto(id) {
  const result = dbConnect()
    .then(async () => {
      try {
        const photo = await Photo.findById(id);
        return photo;
      } catch (error) {
        return error;
      }
    })
    .catch((error) => {
      return error;
    });
  return result;
}
export async function findPhotoWithReportId(req, res) {
  const { reportId } = req.query;
  try {
    await dbConnect();
    const photo = await Photo.findOne({ reportId: reportId });

    res.status(200).json(photo);
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
}

export async function getPhotosByType(req, res) {
  const { type } = req.query;

  try {
    await dbConnect();

    const photos = await Photo.find({ type: type });

    res.status(200).json(photos);
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
}
//Update
//Delete
