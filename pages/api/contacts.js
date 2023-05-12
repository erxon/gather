import nextConnect from "next-connect";
import {
  addContactToCurrentUser,
  getContacts,
  removeContact,
  removeUserFromContact,
  addToOtherUser,
} from "@/lib/controllers/contactController";
import auth from "@/middleware/auth";

const handler = nextConnect();

handler
  .use(auth)
  .get((req, res) => {
    //get all the users' contact
    const user = req.user;
    user.then((data) => {
      getContacts(data.username)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json(err);
        });
    });
  })
  .post((req, res, next) => {
    //add a contact
    const { currentUserId, newContact } = req.body;
    addContactToCurrentUser(currentUserId, newContact)
      .then(() => {
        next();
      })
      .catch((err) => {
        res.json(err);
      });
  })
  .post((req, res) => {
    const { currentUserId, newContact } = req.body;
    addToOtherUser(currentUserId, newContact)
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.json(err);
      });
  })
  .put(async (req, res, next) => {
    req.currentUser = await req.user;
    try {
      await removeContact(req.currentUser._id, req.body.contactId);
      next();
    } catch (error) {
      res.json(error);
    }
  })
  .put(async (req, res) => {
    try {
      let result = await removeUserFromContact(
        req.currentUser._id,
        req.body.contactId
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  });

export default handler;
