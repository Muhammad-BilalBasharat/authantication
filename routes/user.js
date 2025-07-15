import express from "express";
import {signup,verifyEmail,logout,login,forgotPassword,resetPassword,getUser,getUserById,changePassword}from "../controllers/user.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";


const router = express.Router();
// User signup route

router.get("/get-user", verifyToken, verifyAdmin, getUser);
// Only admin can access get-user

router.get("/me", verifyToken, getUserById);
// Any authenticated user can access their own info

router.post("/verify-email", verifyEmail);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token", resetPassword); 
router.put("/change-password/:id", verifyToken, changePassword);
// Any authenticated user can change their password



export default router;