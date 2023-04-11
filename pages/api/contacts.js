import nextConnect from "next-connect";
import { addContact, getContacts, deleteContact } from "@/lib/controllers/contactController";
import auth from "@/middleware/auth";

const handler = nextConnect();

handler.use(auth)
.get((req, res) => {
    //get all the users' contact
    const user = req.user;
    user.then((data) => {
        getContacts(data.username).then((data) => {
            res.json(data)
        }).catch(err => {
            res.json(err);
        })
    });

}).post((req, res) => {
    //add a contact
    const {currentUser, newContact} = req.body;
    addContact(currentUser, newContact).then((response) => {
        res.json(response);
    }).catch(err => {
        res.json(err);
    })

}).put((req, res) => {
    const { id } = req.body;
    const user = req.user;
    user.then((data) => {
        deleteContact(data.username, id).then(() => {
            res.json(data);
        });
    });
})

export default handler;