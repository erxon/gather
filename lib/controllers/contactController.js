import User from "@/db/user";
import Channel from "@/db/channel";
import dbConnect from "@/db/dbConnect";
//addContact
//deleteContact
//getContacts

export function addContactToCurrentUser(currentUserId, newContact) {
  //currentUser is the logged in user's username
  //newContact is the id of the user to add as a contact
  const updateUser = dbConnect().then(async () => {
    const user = await User.findByIdAndUpdate(currentUserId, {
      $push: { contacts: newContact },
    });
    return user;
  });
  return updateUser;
}
export function addToOtherUser(currentUserId, newContact) {
  const updateUser = dbConnect().then(async () => {
    const user = await User.findByIdAndUpdate(newContact, {
      $push: { contacts: currentUserId },
      $pull: { contactRequests: currentUserId },
    });
    return user;
  });
  return updateUser;
}

export function getContacts(username) {
  const contacts = dbConnect().then(async () => {
    let user = await User.findOne({ username: username })
      .populate("contacts")
      .exec();
    return user.contacts;
  });
  return contacts;
}
export function removeContact(userId, contactId) {
  const contact = dbConnect().then(async () => {
    try {
      let result = await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { contacts: contactId } }
      );
      return result;
    } catch (error) {
      return error;
    }
  });
  return contact;
}

export function removeUserFromContact(userId, contactId) {
  const contact = dbConnect().then(async () => {
    try {
      let result = await User.findByIdAndUpdate(
        { _id: contactId },
        { $pull: { contacts: userId } }
      );
      return result;
    } catch (error) {
      return error;
    }
  });
  return contact;
}

//channels
export function createChannel(userId1, userId2) {
  const channel = dbConnect().then(async () => {
    try {
      const newChannel = new Channel({
        members: [userId1, userId2],
      });
      await newChannel.save();
      return;
    } catch (error) {
      return error;
    }
  });
  return channel;
}
export function getChannel(userId1, userId2) {
  const channel = dbConnect()
    .then(async () => {
      try {
        const result = await Channel.find({
          members: { $all: [userId1, userId2] },
        });
        return result;
      } catch (error) {
        return error;
      }
    })
    .catch((err) => {
      return `error connecting to database`;
    });
  return channel;
}
export function deleteChannel(channelId) {
  const channel = dbConnect()
    .then(async () => {
      try {
        const result = await Channel.findByIdAndDelete(channelId);
        return result;
      } catch (error) {
        return error;
      }
    })
    .catch((error) => {
      return "error connecting to database";
    });
  return channel;
}
export function saveConversation(channelId, message, from) {
  const channel = dbConnect()
    .then(async () => {
      await Channel.findByIdAndUpdate(
        { _id: channelId },
        { $push: { conversation: { message, from, createdAt: new Date() } } }
      );
      return;
    })
    .catch((err) => {
      return "error connecting to database";
    });
  return channel;
}
