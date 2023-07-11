//report of an authenticated user
//report of an anonymous user
//the status of the report should be for verification first
//file upload
import dbConnect from "@/db/dbConnect";
import Report from "@/db/report";

export function createReport(report) {
  //first name, last name, age, gender, last seen
  const reportToSave = dbConnect()
    .then(async () => {
      let data = {
        ...report,
      };

      let newReport = new Report(data);

      try {
        const saveReport = await newReport.save();
        return saveReport;
      } catch (err) {
        return err;
      }
    })
    .catch((err) => {
      return err;
    });

  return reportToSave;
}

export function getReports() {
  const data = dbConnect()
    .then(async () => {
      const getReports = await Report.find();
      return getReports;
    })
    .catch((err) => {
      return err;
    });

  return data;
}

export function getReportsByUsername(username) {
  const data = dbConnect()
    .then(async () => {
      const getReports = await Report.find({ username: username });

      return getReports;
    })
    .catch((err) => {
      return err;
    });

  return data;
}

export function getReportById(id) {
  const data = dbConnect()
    .then(async () => {
      const getReport = await Report.findById(id).populate("reporter").exec();
      return getReport;
    })
    .catch((err) => {
      return err;
    });

  return data;
}

export function updateReport(id, update) {
  const data = dbConnect()
    .then(async () => {
      try {
        const updatedReport = await Report.findByIdAndUpdate(
          { _id: id },
          update
        );
        return updatedReport;
      } catch (err) {
        return err;
      }
    })
    .catch((err) => {
      return err;
    });

  return data;
}
export function deleteReport(id) {
  const data = dbConnect()
    .then(async () => {
      const deleteReport = await Report.findByIdAndRemove(id);
      return deleteReport;
    })
    .catch((err) => {
      return err;
    });
  return data;
}

export function findReportWithReporter(id) {
  const data = dbConnect()
    .then(async () => {
      const report = await Report.findById(id).populate("reporter").exec();
      return report;
    })
    .catch((err) => {
      return err;
    });
  return data;
}

export function getActiveReports() {
  const data = dbConnect()
    .then(async () => {
      const activeReports = await Report.find({ status: "active" });
      return activeReports;
    })
    .catch((err) => {
      return err;
    });
  return data;
}
