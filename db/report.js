import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    reporter: mongoose.Schema.Types.ObjectId,
    status: String,
    username: {type: String, ref: 'User'},
    photo: {
        type: String,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    reportedAt: Date,
    updatedAt: Date,
    updatedByReporter: {type: mongoose.Schema.Types.ObjectId, ref: 'Reporter'},
    updatedByAuthority: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastSeen: {
        type: String,
        required: [true, 'Please indicate where the person was last seen']
    },
    age: {
        type: String,
        required: [true, 'Please indicate the age of the person']
    },
    gender: {
        type: String,
        required: [true, 'Please indicate the gender of the person']
    },
    features: [String],
    email: String,
    contactNumber: String,
    socialMediaAccount: [String]
});

const Report =  mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;