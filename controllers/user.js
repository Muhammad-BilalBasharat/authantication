import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetKookie } from "../utils/generateTokenAndSetKookie.js";
import {
  sendVerificationEmail,
  welcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // OTP VERIFICATION
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 DAY from now
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });
    await user.save();
    // jwt
    generateTokenAndSetKookie(res, user._id, user.role);
    // Send verification email (assuming you have a function to send emails)
    await sendVerificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined, // Exclude password from response
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpires: { $gt: new Date() }, // Check if token is still valid
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }
    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the verification token
    user.verificationTokenExpires = undefined; // Clear the expiration date
    await user.save();

    await welcomeEmail(user.email, user.name); // Assuming you have a function to send welcome emails

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined, // Exclude password from response
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // Check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }
    // Generate JWT and set cookie
    generateTokenAndSetKookie(res, user._id,user.role);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...user._doc,
        password: undefined, // Exclude password from response
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Generate a password reset token
    const resetToken = crypto.randomBytes(22).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Check if token is still valid
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration date
    await user.save();
    // Send success email
    await sendResetSuccessEmail(user.email);
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(400).json({
        message: "No user found",
        error: "No user found",
      });
    }
    // Exclude password from each user
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return { ...rest };
    });
    res.status(200).json({
      success: true,
      message: "Users fetched",
      users: usersWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    // Make sure req.user.userId exists
    if (!req.user || !req.user.userId) {
      return res.status(400).json({
        message: "User ID not provided",
        error: "User ID not provided",
      });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({
        message: "No user found",
        error: "No user found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
 try {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Find the user by ID from the token
 const user= await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Check if the old password is correct
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid old password" });
  }
  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  // Update the user's password
  user.password = hashedNewPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    user: {
      ...user._doc,
      password: undefined, // Exclude password from response
    },
  });
  
 } catch (error) {
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
 }
};




export {
  signup,
  verifyEmail,
  logout,
  login,
  forgotPassword,
  resetPassword,
  getUser,
  getUserById,
  changePassword,
};
