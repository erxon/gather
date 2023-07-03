import nextConnect from "next-connect";
import auth from "@/middleware/auth";
import { getAllUsers, createUser, findUserByUsername } from "@/lib/db";

const handler = nextConnect();

handler
  .use(auth)
  .get((req, res) => {
    // For demo purpose only. You will never have an endpoint which returns all users.
    // Remove this in production
    getAllUsers(req).then((response) => {
      res.json({ users: response });
    });
  })
  .post((req, res) => {
    const { firstName, lastName, username, password, email, type, status } =
      req.body;
    if (!username || !password || !email) {
      return res.status(400).send("Missing fields");
    }
    // Here you check if the username has already been used
    // const usernameExisted = !!findUserByUsername(req, username).then((data) => {return data});
    // if (usernameExisted) {
    //   return res.status(409).send('The username has already been used')
    // }
    findUserByUsername(req, username).then(async (data) => {
      const usernameExisted = !!data;
      
      if (usernameExisted) {
        res.status(409).send("The username has already been used");
      } else {
        const userLogin = { username, password, email };
        const userSignup = {
          username,
          password,
          email,
          type,
          status,
          firstName,
          lastName,
        };
        const user = await createUser(req, userSignup);
        req.logIn(userLogin, (err) => {
          if (err) throw err;
          // Log the signed up user in
          res.status(201).json({
            username: userLogin.username,
            email: userLogin.email,
            userId: user._id,
          });
        });
      }
    });

    // Security-wise, you must hash the password before saving it
    // const hashedPass = await argon2.hash(password);
    // const user = { username, password: hashedPass, name }
  });

export default handler;
