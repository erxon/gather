import dbConnect from "@/db/dbConnect";
import Reporter from "@/db/reporter";

export function addReporter(reporter){
    const data = dbConnect().then(async () => {
        let newReporter = {
            photoUploaded: reporter.photoUploaded,
            firstName: reporter.firstName,
            lastName: reporter.lastName,
            contactNumber: reporter.contactNumber,
            email: reporter.email,
            relationToMissing: reporter.relationToMissing,
            createdAt: new Date()
        }

        let saveReporter = new Reporter(newReporter);

        const returnSaveReporter = await saveReporter.save();
        return returnSaveReporter;

    }).catch(err => {
        return err;
    })

    return data;
}
export function getReporters(){
    const data = dbConnect().then(async () => {
        const reporter = await Reporter.find();
        return reporter

    }).catch(err => {
        return err;
    })
    return data;
}
export function getReporterById(id) {
    const data = dbConnect().then(async () => {
        const reporter = await Reporter.findById(id)
        return reporter;
    }).catch(err => {
        return err
    });
    return data;
}
export function editReporter(id, update){
    const data = dbConnect().then(async () => {
        const reporter = await Reporter.findByIdAndUpdate(id, update)
        return reporter
    }).catch(err => {
        return err
    })

    return data;
}
export function deleteReporter(id) {
    const data = dbConnect().then(async () => {
        const reporter = await Reporter.findByIdAndRemove(id)
        return reporter;
    }).catch(err => {
        return err;
    })
    return data;
}
