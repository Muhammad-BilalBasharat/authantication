import jwt from "jsonwebtoken";
import User from "../models/user.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user from DB to get latest role and info
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    req.user = user; // Attach full user object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid." });
  }
};

export default verifyToken;