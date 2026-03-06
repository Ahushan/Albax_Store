import jwt from "jsonwebtoken";
import User from "../models/user/UserModel.js";

/**
 * PROTECT — verifies accessToken cookie and attaches req.user
 * Use on any route that requires a logged-in user.
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "User not found or deactivated" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * AUTHORIZE — role-based access control
 * Usage: authorize("admin", "superadmin")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
};
