import mongoose from 'mongoose';

const archiveSchema = new mongoose.Schema({
    report: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Report'
    },
    createdAt: Date,
    updatedAt: Date
})

const Archive = mongoose.models.Archive || mongoose.model('Archive', archiveSchema)

export default Archive