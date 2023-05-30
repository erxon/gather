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
//Update
//Delete
