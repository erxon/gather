//report of an authenticated user
//report of an anonymous user
//the status of the report should be for verification first
//file upload
import dbConnect from "@/db/dbConnect";
import Report from "@/db/report";

export function createReport(report) {
    //first name, last name, age, gender, last seen
    const reportToSave = dbConnect().then(async () => {
        let data = {
            reporter: report.reporterId,
            firstName: report.firstName,
            lastName: report.lastName,
            lastSeen: report.lastSeen,
            gender: report.gender,
            age: report.age,
            reportedAt: report.reportedAt
        }

        let newReport = new Report(data);

        await newReport.save();
        return;

    }).catch(err => {
        return err;
    })

    return reportToSave;
}

export function getReports(){
    const data = dbConnect().then(async () => {
        const getReports = await Report.find();
        return getReports;
    }).catch(err => {
        return err
    });

    return data;
}

export function getReportById(id){
    const data = dbConnect().then(async () => {
        const getReport = await Report.findById(id);
        return getReport
    }).catch(err => {
        return err
    });

    return data

}

export function updateReport(id, update){
    const data = dbConnect().then(async () => {
        const getReport = await Report.findByIdAndUpdate({_id: id}, update)
        return getReport
    }).catch(err => {
        return err
    });

    return data;

}
export function deleteReport(id){
    const data = dbConnect().then(async () => {
        const deleteReport = await Report.findByIdAndRemove(id)
        return deleteReport
    }).catch(err => {
        return err
    });
    return data;
}




