import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, resetUILink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: false,
    auth: {
      user: config.nodemailer_email,
      pass: config.nodemailer_email_app_password,
    },
  });

  await transporter.sendMail({
    from: config.nodemailer_email,
    to,
    subject: "Reset your password within ten mins!",
    text: "Please click the link given to reset your password",
    html: `<div style="font-family: Verdana, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 2px solid #c8e6c9; border-radius: 12px; background-color: #f0f4f3;">
  <h2 style="color: #2e7d32; font-size: 24px;">Greetings,</h2>
  <p style="color: #333; font-size: 16px; line-height: 1.5;">
    We’ve received a request to change your password for your Garden Ally account.
  </p>
  <p style="color: #333; font-size: 16px; line-height: 1.5;">
    To proceed, please click the link below and follow the instructions:
  </p>
  <a href="${resetUILink}" style="display: inline-block; background-color: #2e7d32; color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 15px;">Change Password</a>
  <p style="margin-top: 30px; font-size: 14px; color: #555;">
    Sincerely,<br>The Garden Ally Support Team
  </p>
</div>
`,
  });
};
