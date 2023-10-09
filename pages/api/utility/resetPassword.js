import nextConnect from "next-connect";
import crypto from "crypto";
import { updateUserByUsername } from "@/lib/db";

const handler = nextConnect();

handler.post((req, res) => {
  const { username, newPassword } = req.body;

  const newPasswordSalt = crypto.randomBytes(16).toString("hex");
  const newPasswordHash = crypto
    .pbkdf2Sync(newPassword, newPasswordSalt, 1000, 64, "sha512")
    .toString("hex");

  updateUserByUsername(req, username, {
    salt: newPasswordSalt,
    hash: newPasswordHash,
  }).then((data) => {
    if (data && data.errors) {
      res.status(400).json({ error: "Something went wrong" });
    }
    res.status(200).json({ message: "Password changed" });
  });
});

export default handler;
