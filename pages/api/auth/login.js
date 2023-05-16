import nextConnect from "next-connect";
import auth from "@/middleware/auth";
import passport from "@/lib/passport";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res) => {
    if (req.body.username === "" && req.body.password === "") {
      res.status(400).json({ field: "all", error: "Empty fields" });
    } else if (req.body.username === "") {
      res.status(400).json({ field: "username", error: "Username is empty" });
    } else if (req.body.password === "") {
      res.status(400).json({ field: "password", error: "Password is empty" });
    } else {
      next();
    }
  })
  .post(passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });

export default handler;
