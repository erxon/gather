import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Channel = mongoose.models.Channel || mongoose.model('Channel', channelSchema);

export default Channel;