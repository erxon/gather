import nextConnect from "next-connect";
import * as sgMail from "@sendgrid/mail";

const handler = nextConnect();

handler.post((req, res) => {
  const url = process.env.API_URL || "http://localhost:3000";
  const passwordResetLink = `${url}/authentication/reset-password/${req.body.id}`;
  const body = `This is your password reset link ${passwordResetLink}`;

  sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

  const msg = {
    to: req.body.to, // Change to your recipient
    from: "gatherformissingpersons@outlook.com", // Change to your verified sender
    subject: "Forgot password link",
    text: body,
  };

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).json({ message: "Email sent" });
    })
    .catch((error) => {
      console.error(error);
    });
});

export default handler;
