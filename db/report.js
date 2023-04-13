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
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    reportedAt: Date,
    updatedAt: Date,
    updatedByReporter: {type: mongoose.Schema.Types.ObjectId, ref: 'Reporter'},
    updatedByAuthority: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastSeen: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    features: [String],
    email: String,
    contactNumber: String,
    socialMediaAccount: [String]
});

const Report =  mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;