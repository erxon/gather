import User from "@/db/user";
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
export function addContactToOtherUser(currentUserId, newContact) {
  const updateUser = dbConnect().then(async () => {
    const user = await User.findByIdAndUpdate(newContact, {
      $push: { contacts: currentUserId },
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
      return result
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
