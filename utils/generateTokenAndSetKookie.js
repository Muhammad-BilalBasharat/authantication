import jwt from "jsonwebtoken";

const generateTokenAndSetKookie = (res, userId, role) => {
  const token = jwt.sign(
    { id: userId, role:role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1day",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
    maxAge: 360000000,
  });
};
export { generateTokenAndSetKookie };


