import mongoose from "mongoose";

const userSchema = mongoose.Schema({
   photo: {
      data: Buffer,
      contentType:String
   },
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
   socialMediaAccounts:{
      facebook: String,
      twitter: String,
      instagram: String
   },
   type: String,
   contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
   firstName: String,
   lastName: String,
   MiddleName: String,
   createdAt: Date,
   updatedAt: Date,
   salt: String,
   hash: String
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;