import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logActivity } from "../utils/logActivity.js";

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, accountType } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      accountType,
      mockupQuota: 0,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // ✅ Tambahkan log aktivitas
    await logActivity({
      user,
      action: "Registrasi",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      mockupQuota: user.mockupQuota,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Akun Anda telah dinonaktifkan oleh admin." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Tambahkan log aktivitas
    await logActivity({
      user,
      action: "Login",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      mockupQuota: user.mockupQuota,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// backend/controllers/userController.js
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      name: user.name,
      accountType: user.accountType,
      mockupQuota: user.mockupQuota,
      testHistory: user.testHistory || [], // kalau belum ada, kosong
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data profil user" });
  }
};
