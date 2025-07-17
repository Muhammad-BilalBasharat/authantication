// emails.js
import { transporter } from "./mailer.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

const fromEmail = `"no reply" <${process.env.EMAIL_USER}>`;

export const sendVerificationEmail = async (email, verificationToken) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
  try {
    const response = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Verify Your Email",
      html,
    });
    console.log("Verification email sent:", response.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const welcomeEmail = async (email, name) => {
  const html = `<p>Thank you for signing up ${name}!</p>`;
  try {
    const response = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Welcome to Our Service",
      html,
    });
    console.log("Welcome email sent:", response.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
  try {
    const response = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Password Reset Request",
      html,
    });
    console.log("Password reset email sent:", response.messageId);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent:", response.messageId);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
};
