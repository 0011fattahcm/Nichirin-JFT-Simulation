"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { FaHome, FaFileAlt, FaHistory, FaCrown, FaCog } from "react-icons/fa";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", icon: <FaHome />, href: "/dashboard" },
  { label: "Tes", icon: <FaFileAlt />, href: "/tes" },
  { label: "Riwayat", icon: <FaHistory />, href: "/riwayat" },
  { label: "Subscription", icon: <FaCrown />, href: "/subscription" },
  { label: "Settings", icon: <FaCog />, href: "/settings" },
  { label: "Logout", icon: <FiLogOut />, action: "logout" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // default tertutup
  const [showConfirm, setShowConfirm] = useState(false);
  const sidebarRef = useRef(null); // Reference untuk Sidebar
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // Tutup sidebar jika klik di luar
      }
    };

    // Event listener untuk mendeteksi klik di luar sidebar
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="relative">
      {/* Overlay saat sidebar dibuka */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#1e1e2f] text-white shadow-lg z-40 transform transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-16"} md:block`}
      >
        <div className="relative">
          {/* Toggle button */}
          <div className="flex justify-end pr-3 pt-3">
            <button
              className="text-white bg-gray-800 p-2 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="p-4 flex items-center justify-center h-20">
            <Image
              src="/assets/img/logo2.png"
              alt="Logo"
              width={isOpen ? 150 : 30}
              height={30}
              className="transition-all duration-200"
            />
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map(({ href, icon, label, action }) => (
            <div key={label}>
              {action === "logout" ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-[#2e2e48] transition-colors w-full text-left"
                >
                  <span className="text-xl">{icon}</span>
                  {isOpen && <span>{label}</span>}
                </button>
              ) : (
                <Link
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-[#2e2e48] transition-colors"
                >
                  <span className="text-xl">{icon}</span>
                  {isOpen && <span>{label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
        {isOpen && (
          <div className="mt-auto p-4 hidden md:block">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-4 text-center text-sm">
              <p className="mb-2">Dapatkan akun Sensei sekarang!</p>
              <button className="bg-white text-black px-3 py-1 rounded">
                Upgrade akun
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Logout Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-80 text-center shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Keluar dari akun?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Apakah kamu yakin ingin logout sekarang?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
