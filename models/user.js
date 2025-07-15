import e from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {   type: String, required: true },
  email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Default role is 'user'
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetPasswordToken:  String ,   
    resetPasswordExpires:  Date ,
    lastLogin: { type: Date, default: Date.now },
  
},{ timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;