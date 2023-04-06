import mongoose from "mongoose";

const userSchema = mongoose.Schema({
   photo:  Buffer,
   username: {
    type: String,
    required: true
   },
   password: {
    type: String,
   },
   email: {
    type: String,
    required: true
   },
   contactNumber: String,
   socialMediaAccounts: [String],
   type: String,
   contacts: [mongoose.Schema.Types.ObjectId],
   firstName: String,
   lastName: String,
   MiddleName: String,
   createdAt: Date,
   salt: String,
   hash: String
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;