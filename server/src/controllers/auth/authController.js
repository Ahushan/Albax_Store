import jwt from "jsonwebtoken";
import User from "../../models/user/UserModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getAccessCookieOptions,
  getRefreshCookieOptions,
} from "../../utils/token.js";

/* ─── REGISTER ─── */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, password });

    const payload = { userId: user._id, role: user.role };

    res.cookie(
      "accessToken",
      generateAccessToken(payload),
      getAccessCookieOptions(),
    );
    res.cookie(
      "refreshToken",
      generateRefreshToken(payload),
      getRefreshCookieOptions(),
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

/* ─── LOGIN ─── */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id, role: user.role };

    res.cookie(
      "accessToken",
      generateAccessToken(payload),
      getAccessCookieOptions(),
    );
    res.cookie(
      "refreshToken",
      generateRefreshToken(payload),
      getRefreshCookieOptions(),
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/* ─── REFRESH TOKEN ─── */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or deactivated" });
    }

    const payload = { userId: user._id, role: user.role };

    res.cookie(
      "accessToken",
      generateAccessToken(payload),
      getAccessCookieOptions(),
    );
    res.cookie(
      "refreshToken",
      generateRefreshToken(payload),
      getRefreshCookieOptions(),
    );

    res.json({ success: true, message: "Token refreshed" });
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

/* ─── LOGOUT ─── */
export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
  });

  res.json({ success: true, message: "Logged out successfully" });
};
