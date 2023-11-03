import dbConnect from "@/db/dbConnect";
import Report from "@/db/report";
import User from "@/db/user";
import _ from "lodash";

const getDataSummary = async (req, res) => {
  try {
    const allReports = await Report.find();
    const activeReports = await Report.find({ status: "active" });
    const closedReports = await Report.find({ status: "close" });
    const foundMissingPersons = await Report.find({ result: "found" });
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

const count = (collection, condition) => {
  const filterCollection = _.filter(collection, condition);

  const filterCollectionCount = filterCollection.length;
  return filterCollectionCount;
};

const reportsSummary = async (req, res) => {
  try {
    await dbConnect();

    const reports = await Report.find();

    const pending = count(reports, { status: "pending" });
    const active = count(reports, { status: "active" });
    const close = count(reports, { status: "close" });
    const found = count(reports, {result: "found"});

    const summary = {
      total: reports.length,
      pending: pending,
      active: active,
      close: close,
      found: found
    };

    return res.status(200).json(summary);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error, message: "Something went wrong." });
  }
};

const timeInsight = async (req, res) => {
  try {
    await dbConnect();

    const reports = await Report.find({status: "close", result: "found"});
    const closeReports = await Report.find({status: "close"});

    const timeRange = reports.map((report) => {
      const reportDate = new Date(report.reportedAt)
      const lastUpdateDate = new Date(report.updatedAt)
      const elapsedTime = lastUpdateDate - reportDate;
      const elapsedTimeInSeconds = elapsedTime / 1000;
      return elapsedTimeInSeconds;
    })

    const personsFoundWithinADay = timeRange.filter((time) => {
      return time < 86400
    }).length
    
    const personsNotFoundWithinADay = closeReports.length - personsFoundWithinADay

    res.status(200).json({
      withinADay: personsFoundWithinADay,
      notFoundWithinADay: personsNotFoundWithinADay
    })
  } catch (error) {
    res.status(400).json({error, message: "something went wrong."})
  }
}

export { getDataSummary, reportsSummary, timeInsight };
