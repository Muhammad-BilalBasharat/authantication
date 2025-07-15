import { mailtrapClient,sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
const recipient =[{email}];
  try {
    const response = await mailtrapClient.send({
      from:sender,
      to:recipient,
      subject:"verify your email",
      html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
      category:"Email Verification"
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error.data);
  }
};

export const welcomeEmail = async (email,name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Our Service",
      html: `<p>Thank you for signing up ${name}!</p>`,
      category: "Welcome Email",
    });
    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};


export const sendPasswordResetEmail = async (email, resetURL) => {
const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Password reset email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
    console.log("Password reset success email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
}