"use client";

import React, { useState } from "react";
import withAdminAuth from "../components/hoc/withAdminAuth";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  History,
  FilePlus2,
  ListTodo,
  CreditCard,
  Megaphone,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/rx78gpo1p6/dashboard",
  },

  {
    name: "Input Soal",
    icon: <FilePlus2 />,
    path: "/rx78gpo1p6/input-question",
  },
  {
    name: "Daftar Soal",
    icon: <ListTodo />,
    path: "/rx78gpo1p6/manage-questions",
  },
  { name: "User", icon: <Users />, path: "/rx78gpo1p6/users" },
  { name: "Riwayat Tes", icon: <History />, path: "/rx78gpo1p6/riwayat" },
  {
    name: "Riwayat Pembayaran",
    icon: <CreditCard />,
    path: "/rx78gpo1p6/payment-history",
  },
  {
    name: "Log Aktivitas",
    icon: <Activity />,
    path: "/rx78gpo1p6/log-activity",
  },
  {
    name: "Pengumuman",
    icon: <Megaphone />,
    path: "/rx78gpo1p6/announcements",
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/rx78gpo1p6/login");
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle button (mobile only) */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full shadow-lg hover:scale-105 transition"
        >
          {isOpen ? (
            <X className="text-white" />
          ) : (
            <Menu className="text-white" />
          )}
        </button>
      </div>

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-50 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-2xl border-r border-white/10 transform transition-transform duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:fixed`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wide">JFT Admin</h1>
        </div>

        {/* Menu navigasi */}
        <nav className="mt-4 flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigation(item.path)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-white/10 transition font-medium"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout + copyright */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/10 transition font-medium"
          >
            <LogOut className="text-lg" />
            <span>Logout</span>
          </button>
          <p className="text-xs text-white/40 mt-4 text-center">
            © 2025 JFT Simulation
          </p>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Konfirmasi Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah kamu yakin ingin keluar dari akun admin?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  setShowLogoutModal(false);
                  router.replace("/rx78gpo1p6/login");
                }}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withAdminAuth(Sidebar);
