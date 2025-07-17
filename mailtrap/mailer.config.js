import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,         // e.g., yourgmail@gmail.com
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (16-char)
  },
});
