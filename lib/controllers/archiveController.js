import dbConnect from "@/db/dbConnect";
import Archive from "@/db/archive";

const getArchives = async (req, res) => {
  try {
    await dbConnect();
    const archives = await Archive.find({})
    res.status(200).json(archives)
  } catch (error) {
    res.status(400).json({error: error, message: 'Something went wrong.'})
  }
};

export {
    getArchives
}