import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    reporter: {type: mongoose.Schema.Types.ObjectId, ref: 'Reporter'},
    status: String,
    username: {type: String, ref: 'User'},
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    photo: {
        type: String,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    reportedAt: Date,
    updatedAt: Date,
    updatedByReporter: {type: mongoose.Schema.Types.ObjectId, ref: 'Reporter'},
    updatedByAuthority: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastSeen: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String
    },
    features: [String],
    email: String,
    contactNumber: String,
    socialMediaAccounts: {
        facebook: String,
        twitter: String
    }
});

const Report =  mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;