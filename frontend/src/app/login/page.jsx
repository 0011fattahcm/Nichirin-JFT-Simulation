"use client";
import { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { API } from "../../../utils/api.js";
import Image from "next/image";
import Link from "next/link";
import PengumumanBar from "../../components/PengumumanBar.jsx";
import { Pen } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email dan kata sandi wajib diisi.");
      setShowError(true);
      return;
    }

    try {
      const response = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login gagal.");
        setShowError(true);
        return;
      }

      // Simpan data ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));

      window.location.href = `/dashboard`;
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
      setShowError(true);
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

        {/* ERROR NOTIF */}
        {showError && (
          <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-md z-50 transition-all duration-500">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="relative flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 lg:py-12">
          <div className="absolute inset-0 -z-10 animate-gradient-flow bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 blur-3xl opacity-20" />

          <div className="w-full max-w-md space-y-6 text-white z-10 bg-gray-900 bg-opacity-90 p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-md">
            <h2 className="text-2xl sm:text-3xl font-bold">Masuk Akun</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="relative">
                <label className="block mb-1">Kata Sandi</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Kata sandi Anda"
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
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 rounded"
              >
                Masuk
              </button>

              <p className="text-center text-sm text-gray-400">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-purple-400 hover:underline"
                >
                  Daftar sekarang
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
