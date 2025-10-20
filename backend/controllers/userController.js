import bcrypt from "bcryptjs";
import User from "../models/Users.js";
import { logActivity } from "../utils/logActivity.js";

// Mendapatkan Profil Pengguna
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // Mendapatkan data pengguna dari middleware auth
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      birthdate: user.birthdate,
      gender: user.gender,
      languageLevel: user.languageLevel,
      accountType: user.accountType,
      mockupQuota: user.mockupQuota,
      testHistory: user.testHistory || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
};

// Memperbarui Profil Pengguna
export const updateUserProfile = async (req, res) => {
  const {
    newName,
    newEmail,
    newPhone,
    newAddress,
    newBirthdate,
    newGender,
    newLanguageLevel,
  } = req.body;

  try {
    const user = await User.findById(req.user.id); // Mendapatkan data pengguna berdasarkan ID

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Memperbarui data profil
    user.name = newName || user.name;
    user.email = newEmail || user.email;
    user.phone = newPhone || user.phone;
    user.address = newAddress || user.address;
    user.birthdate = newBirthdate || user.birthdate;
    user.gender = newGender || user.gender;
    user.languageLevel = newLanguageLevel || user.languageLevel;

    await user.save(); // Menyimpan perubahan
    await logActivity({
      user,
      action: "Update Profil",
    });

    res.status(200).json({ message: "Profil berhasil diperbarui!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui profil pengguna" });
  }
};

// Memperbarui Password Pengguna
export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id); // Mendapatkan data pengguna berdasarkan ID

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password); // Memeriksa apakah password lama cocok

    if (!isMatch) {
      return res.status(400).json({ message: "Password lama tidak cocok" });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // Mengupdate password pengguna

    await user.save(); // Menyimpan perubahan
    await logActivity({
      user,
      action: "Update Password",
    });

    res.status(200).json({ message: "Password berhasil diperbarui!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui password" });
  }
};

// Menghapus Akun Pengguna
export const deleteUserAccount = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user.id); // Mendapatkan data pengguna berdasarkan ID

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Memeriksa apakah password cocok

    if (!isMatch) {
      return res.status(400).json({ message: "Password tidak cocok" });
    }

    await User.findByIdAndDelete(req.user.id); // Menghapus akun pengguna

    await logActivity({
      user,
      action: "Hapus Akun",
    });

    res.status(200).json({ message: "Akun berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus akun" });
  }
};
