import jwt from "jsonwebtoken";

/* ADMIN AUTH MIDDLEWARE (cookie-based) */
export const adminAuth = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ROLE CHECK */
    if (!decoded || !["admin", "superadmin"].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    /* ATTACH ADMIN TO REQUEST */
    req.admin = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
