"use client";
import { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Image from "next/image";
import Terms from "../../components/Terms.jsx";
import bcrypt from "bcryptjs";
import { API } from "../../../utils/api.js";
import PengumumanBar from "../../components/PengumumanBar.jsx";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
    agree: false,
  });

  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "error", // "success" or "error"
  });

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup({ show: false, message: "", type: "error" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPopup({
        show: true,
        message: "Konfirmasi kata sandi tidak cocok.",
        type: "error",
      });
      return;
    }

    if (!formData.accountType || !formData.agree) {
      setPopup({
        show: true,
        message: "Harap isi semua field dan setujui ketentuan.",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(API.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          accountType: formData.accountType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPopup({
          show: true,
          message: data.message || "Email sudah terdaftar.",
          type: "error",
        });
        return;
      }

      setPopup({
        show: true,
        message: "Registrasi berhasil! Silakan login.",
        type: "success",
      });

      // reset form jika perlu
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "",
        agree: false,
      });
    } catch (err) {
      setPopup({
        show: true,
        message: "Terjadi kesalahan koneksi.",
        type: "error",
      });
    }
  };

  return (
    <>
      <PengumumanBar />
      <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-gray-900 relative">
        {/* BAGIAN ATAS untuk mobile */}
        <div className="flex lg:hidden flex-col items-center text-center px-6 py-8">
          <Image
            src="/assets/img/logo2.png"
            alt="Logo JFT Simulation"
            width={100}
            height={100}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
            Tes JFT dan SSW Online dengan Simulasi Asli
          </h2>
          <p className="text-sm text-purple-100 leading-relaxed mb-4">
            Platform ini menyediakan tes latihan JFT dan SSW yang akurat seperti
            aslinya. Cocok untuk pemula maupun yang ingin memperdalam persiapan
            tes.
          </p>
        </div>

        {/* BAGIAN KIRI (desktop) */}
        <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 animate-gradient-flow bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 z-0" />
          <Image
            src="/assets/img/bgmask.jpg"
            alt="Background Mask"
            fill
            className="object-cover opacity-20 z-10"
          />
          <div className="relative z-10 flex flex-col justify-start w-full h-full px-16 py-10">
            <div className="mb-10">
              <Image
                src="/assets/img/logo2.png"
                alt="Logo JFT Simulation"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="flex flex-1 items-center">
              <div className="max-w-[500px]">
                <h2 className="text-4xl font-bold text-white leading-snug mb-4">
                  Tes JFT dan SSW Online dengan Simulasi Asli
                </h2>
                <p className="text-base mb-10 text-purple-100 leading-relaxed">
                  Platform ini menyediakan tes latihan JFT dan SSW yang akurat
                  seperti aslinya. Cocok untuk pemula maupun yang ingin
                  memperdalam persiapan tes.
                </p>
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded shadow transition duration-300">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="relative flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 lg:py-12">
          <div className="absolute inset-0 -z-10 animate-gradient-flow bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 blur-3xl opacity-20" />
          <div className="w-full max-w-md space-y-6 text-white z-10 bg-gray-900 bg-opacity-90 p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-md">
            <h2 className="text-2xl sm:text-3xl font-bold">Daftar Akun</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama lengkap Anda"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Jenis Akun</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Pilih Jenis Akun</option>
                  <option value="kouhai">Kouhai</option>
                  <option value="senpai">Senpai</option>
                  <option value="sensei">Sensei</option>
                </select>
              </div>
              <div>
                <div className="relative">
                  <label className="block mb-1">Kata Sandi</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>

                <div className="relative mt-4">
                  <label className="block mb-1">Konfirmasi Kata Sandi</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Ulangi kata sandi"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm">
                  Saya setuju dengan{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-purple-400 hover:underline"
                  >
                    Syarat & Ketentuan
                  </button>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 rounded"
              >
                Daftar
              </button>
              <p className="text-center text-sm text-gray-400">
                Sudah punya akun?{" "}
                <a href="/login" className="text-purple-400 hover:underline">
                  Masuk di sini
                </a>
              </p>
            </form>
          </div>
        </div>

        {popup.show && (
          <div
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-md transition-all duration-300 ${
              popup.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {popup.message}
          </div>
        )}

        <Terms isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </>
  );
}
