import User from "@/db/user";
import dbConnect from "@/db/dbConnect";
//addContact
//deleteContact
//getContacts

export function addContact(currentUser, newContact){
    //currentUser is the logged in user's username
    //newContact is the id of the user to add as a contact
    const updateUser = dbConnect().then(async () => {
        const user = await User.findOne({username: currentUser})
        const contacts = user.contacts;
        contacts.push(newContact)
        user.contacts = contacts;
        user.save();
    });
    return updateUser;
}
export function getContacts(username) {
    const contacts = dbConnect().then(async () => {
        let user = await User.findOne({username: username})
        .populate('contacts').exec();
        return user.contacts;
    })
    return contacts;
}
export function deleteContact (username, id){
    const deleteContact = dbConnect().then(async () => {
        let user = await User.findOne({username: username})
        let contacts = user.contacts.filter((_id) => {
            return _id.toString() !== id
        }); 
        user.contacts = contacts
        user.save();
    })
    return deleteContact
}
