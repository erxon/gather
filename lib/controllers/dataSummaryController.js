import Report from "@/db/report";
import User from "@/db/user";

const getDataSummary = async (req, res) => {
  try {
    const allReports = await Report.find();
    const activeReports = await Report.find({ status: "active" });
    const closedReports = await Report.find({status: "closed"})
    const foundMissingPersons = await Report.find({ found: true });
    const users = await User.find({ status: "verified" });

    res.status(200).json({
      allReports: allReports.length,
      closedReports: closedReports.length,
      activeReports: activeReports.length,
      foundMissingPersons: foundMissingPersons.length,
      users: users.length,
    });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
};

export { getDataSummary };
