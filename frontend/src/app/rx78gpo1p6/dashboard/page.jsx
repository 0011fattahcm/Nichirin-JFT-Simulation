"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import withAdminAuth from "../components/hoc/withAdminAuth";
import { Users, FileText, History, CreditCard } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Statistik dummy
const stats = [
  {
    label: "Total User",
    value: "1,234",
    icon: <Users size={28} />,
    color: "bg-blue-500/20 text-blue-500",
  },
  {
    label: "Total Soal",
    value: "320",
    icon: <FileText size={28} />,
    color: "bg-green-500/20 text-green-500",
  },
  {
    label: "Riwayat Tes",
    value: "2,860",
    icon: <History size={28} />,
    color: "bg-yellow-500/20 text-yellow-500",
  },
  {
    label: "Total Pembayaran",
    value: "Rp 12.340.000",
    icon: <CreditCard size={28} />,
    color: "bg-purple-500/20 text-purple-500",
  },
];

// Data dummy untuk grafik user per bulan
const userData = [
  { month: "Jan", user: 120 },
  { month: "Feb", user: 200 },
  { month: "Mar", user: 300 },
  { month: "Apr", user: 250 },
  { month: "Mei", user: 400 },
  { month: "Jun", user: 370 },
  { month: "Jul", user: 420 },
];

const AdminDashboard = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 w-full p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Dashboard Admin
        </h1>

        {/* Statistik Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 shadow-lg bg-white flex items-center justify-between border-l-4 ${stat.color}`}
            >
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-white shadow-inner">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Grafik + Kalender & Jam */}
        <div className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Grafik */}
          <div className="col-span-2 bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Grafik Pengguna Aktif per Bulan
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="user"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Kalender dan Jam (upgrade) */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center border border-slate-200">
            <div className="w-full bg-white rounded-lg p-4 shadow-inner border border-slate-100">
              <div className="flex items-center justify-center gap-2 mb-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3M16 7V3M4 11h16M5 19h14a2 2 0 002-2V7a2 2 0
                      00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Hari & Tanggal</p>
              </div>
              <p className="text-xl font-semibold text-gray-800">
                {currentDate}
              </p>
            </div>

            <div className="w-full bg-white rounded-lg p-4 shadow-inner border border-slate-100 mt-4">
              <div className="flex items-center justify-center gap-2 mb-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm">Waktu Sekarang</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{time}</p>
            </div>
          </div>
        </div>

        {/* Aktivitas terbaru */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Aktivitas Terbaru
          </h2>
          <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-600">
            Belum ada aktivitas terbaru.
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
