import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,        // Must be true in production for HTTPS
    sameSite: "None",    // Allow cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
