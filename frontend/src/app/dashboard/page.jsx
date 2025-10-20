// components/DashboardPage.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../utils/api.js";
import Sidebar from "../../components/Sidebar.jsx";
import useAuthRedirect from "../hooks/useAuthRedirect.js";
import {
  FaPlayCircle,
  FaCrown,
  FaHistory,
  FaUserCheck,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

export default function DashboardPage() {
  useAuthRedirect();
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(new Date());

  // pages/dashboard/page.js atau komponen lain
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);
        setUser(data);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return <p>Memuat data...</p>;
  if (!user.accountType) return <p>Data akun tidak lengkap</p>;

  const isQuotaEmpty = user.mockupQuota <= 0;

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const weeks = [];
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < startDay) || day > daysInMonth) {
          week.push(
            <td key={j} className="text-gray-300">
              -
            </td>
          );
        } else {
          const today = new Date().getDate();
          week.push(
            <td key={j} className="text-center">
              <div
                className={`${
                  day === today
                    ? "bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                    : ""
                }`}
              >
                <span className="block">{day++}</span>
              </div>
            </td>
          );
        }
      }
      weeks.push(<tr key={i}>{week}</tr>);
    }

    return (
      <table className="w-full text-sm mt-2">
        <thead>
          <tr className="text-purple-600">
            <th>Min</th>
            <th>Sen</th>
            <th>Sel</th>
            <th>Rab</th>
            <th>Kam</th>
            <th>Jum</th>
            <th>Sab</th>
          </tr>
        </thead>
        <tbody>{weeks}</tbody>
      </table>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-pink-100 to-purple-200 text-gray-800">
      <Sidebar />

      <main className="flex-1 p-6 ml-16 md:ml-16 transition-all">
        <h1 className="text-4xl font-extrabold mb-2">
          ✨ Selamat datang, {user.name}!
        </h1>
        <div className="bg-white rounded-xl p-4 shadow mb-6">
          <p className="text-md text-purple-700 font-semibold">
            Kami senang kamu kembali. Siap menaklukkan tes JFT dan SSW hari ini?
            💪
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gradient-to-r from-green-400 to-blue-400 p-6 rounded-xl shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Status Akun</h2>
                  <p className="text-sm">{user.accountType.toUpperCase()}</p>
                </div>
                <FaUserCheck className="text-3xl" />
              </div>
            </div>

            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Kuota Tes</h2>
                  <p className="text-sm">{user.mockupQuota} Tes Tersisa</p>
                </div>
                <FaCrown className="text-3xl" />
              </div>
            </div>

            <div className="h-48 bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-xl shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Mulai Tes</h2>
                  <p className="text-sm">Klik untuk memulai simulasi</p>
                </div>
                <FaPlayCircle className="text-3xl" />
              </div>
              {!isQuotaEmpty && (
                <button className="mt-4 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-100">
                  Mulai Tes
                </button>
              )}
            </div>

            <div className="h-48 bg-gradient-to-r from-red-400 to-pink-400 p-6 rounded-xl shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Subscription</h2>
                  <p className="text-sm">Perpanjang untuk akses lebih luas</p>
                </div>
                <FaCrown className="text-3xl" />
              </div>
              {isQuotaEmpty && (
                <button className="mt-4 bg-white text-red-600 font-semibold px-4 py-2 rounded-md hover:bg-gray-100">
                  Perbarui Sekarang
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-pink-500 text-3xl" />
                <div>
                  <p className="text-sm text-gray-500">Hari ini</p>
                  <p className="text-md font-semibold">{formatDate(time)}</p>
                </div>
              </div>
              {renderCalendar()}
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-purple-500 text-3xl" />
                <div>
                  <p className="text-md text-gray-500">Jam sekarang</p>
                  <p className="text-4xl font-bold text-purple-700 leading-tight">
                    {formatTime(time)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-700">Riwayat Tes</h2>
            <FaHistory className="text-gray-400" />
          </div>
          <ul className="text-sm space-y-2 max-h-48 overflow-y-auto">
            {user.testHistory && user.testHistory.length > 0 ? (
              user.testHistory.map((tes, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>{tes.date}</span>
                  <span className="font-bold text-indigo-600">
                    Skor: {tes.score}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-400">Belum ada riwayat tes.</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
