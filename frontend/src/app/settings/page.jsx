// components/SettingsPage.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../utils/api.js";
import Sidebar from "../../components/Sidebar.jsx";
import useAuthRedirect from "../hooks/useAuthRedirect.js";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaBirthdayCake,
} from "react-icons/fa";

export default function SettingsPage() {
  useAuthRedirect();[]
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newBirthdate, setNewBirthdate] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newLanguageLevel, setNewLanguageLevel] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordForAccountDeletion, setPasswordForAccountDeletion] =
    useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(API.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);

        // Set the initial values of the form with user data
        setNewName(res.data.name || "");
        setNewEmail(res.data.email || "");
        setNewPhone(res.data.phone || "");
        setNewAddress(res.data.address || "");
        setNewBirthdate(res.data.birthdate || "");
        setNewGender(res.data.gender || "");
        setNewLanguageLevel(res.data.languageLevel || "");
      } catch (err) {
        console.error("Gagal ambil data user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        API.UPDATE_PROFILE,
        {
          newName,
          newEmail,
          newPhone,
          newAddress,
          newBirthdate,
          newGender,
          newLanguageLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Profil berhasil diperbarui!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat memperbarui profil.");
      setSuccessMessage("");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Password baru dan konfirmasi password tidak cocok.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        API.UPDATE_PASSWORD,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Password berhasil diperbarui!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat memperbarui password.");
      setSuccessMessage("");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(API.DELETE_ACCOUNT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { password: passwordForAccountDeletion },
      });
      localStorage.clear();
      window.location.href = "/login";
      setSuccessMessage("Akun berhasil dihapus.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage("Password tidak sesuai atau terjadi kesalahan.");
      setSuccessMessage("");
    }
  };

  if (!user) return <p>Memuat data...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-200 text-gray-800 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 ml-16 md:ml-16 transition-all">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Pengaturan Akun
        </h1>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="bg-green-200 text-green-800 p-3 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profil Section */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 rounded-xl shadow-lg col-span-2 backdrop-blur-sm bg-opacity-50">
            <h2 className="text-xl font-semibold mb-6">Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Fields */}
              <div>
                <label className="block text-sm text-gray-600">Nama</label>
                <input
                  type="text"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="Nama"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  No. Telepon
                </label>
                <input
                  type="text"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="No. Telepon"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Alamat</label>
                <input
                  type="text"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="Alamat"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  value={newBirthdate}
                  onChange={(e) => setNewBirthdate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Jenis Kelamin
                </label>
                <select
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value)}
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Level Bahasa
                </label>
                <select
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  value={newLanguageLevel}
                  onChange={(e) => setNewLanguageLevel(e.target.value)}
                >
                  <option value="">Pilih Level Bahasa</option>
                  <option value="JLPT N1">JLPT N1</option>
                  <option value="JLPT N2">JLPT N2</option>
                  <option value="JLPT N3">JLPT N3</option>
                  <option value="JLPT N4">JLPT N4</option>
                  <option value="JLPT N5">JLPT N5</option>
                  <option value="JFT Basic A2">JFT Basic A2</option>
                </select>
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-md w-full hover:from-indigo-600 hover:to-pink-600 transition duration-200"
              onClick={handleUpdateProfile}
            >
              Perbarui Profil
            </button>
          </div>

          {/* Ubah Password dan Hapus Akun Section */}
          <div className="space-y-8">
            {/* Ubah Password */}
            <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-50">
              <h2 className="text-xl font-semibold mb-6">Ubah Password</h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-600">
                  Password Lama
                </label>
                <input
                  type="password"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="Password Lama"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600">
                  Password Baru
                </label>
                <input
                  type="password"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="Konfirmasi Password Baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-md w-full hover:from-indigo-600 hover:to-pink-600 transition duration-200"
                onClick={handleUpdatePassword}
              >
                Perbarui Password
              </button>
            </div>

            {/* Hapus Akun */}
            <div className="bg-gradient-to-br from-white via-red-50 to-pink-50 p-6 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-50">
              <h2 className="text-xl font-semibold mb-6">Hapus Akun</h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-600">
                  Masukkan password untuk menghapus akun
                </label>
                <input
                  type="password"
                  className="p-3 w-full border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder="Masukkan password"
                  value={passwordForAccountDeletion}
                  onChange={(e) =>
                    setPasswordForAccountDeletion(e.target.value)
                  }
                />
              </div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md w-full hover:bg-red-700 transition duration-200"
                onClick={handleDeleteAccount}
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
