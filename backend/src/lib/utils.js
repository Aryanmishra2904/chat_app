import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in production
    sameSite: "lax", // or "none" if frontend & backend on different domains
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
