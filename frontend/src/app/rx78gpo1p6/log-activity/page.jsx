"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import withAdminAuth from "../components/hoc/withAdminAuth";
import axios from "axios";
import moment from "moment";

const itemsPerPage = 100;

const LogActivityPage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/log`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => setLogs(res.data)) // ✅ ini yang kurang
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckboxChange = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    if (selectedLogs.includes(actualIndex)) {
      setSelectedLogs(selectedLogs.filter((i) => i !== actualIndex));
    } else {
      setSelectedLogs([...selectedLogs, actualIndex]);
    }
  };

  const handleDeleteSelected = () => {
    const confirm = window.confirm("Yakin ingin menghapus log yang dipilih?");
    if (!confirm) return;

    const filtered = logs.filter((_, i) => !selectedLogs.includes(i));
    setLogs(filtered);
    setSelectedLogs([]);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.email?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === "timestamp") {
      return sortAsc
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    } else {
      return sortAsc
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    }
  });

  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

  const getBadgeClass = (action) => {
    if (action.includes("Login")) return "bg-blue-100 text-blue-800";
    if (action.includes("Registrasi")) return "bg-green-100 text-green-800";
    if (action.includes("Mulai Simulasi"))
      return "bg-purple-100 text-purple-800";
    if (action.includes("Submit Simulasi"))
      return "bg-yellow-100 text-yellow-800";
    if (action.includes("Lihat Hasil")) return "bg-indigo-100 text-indigo-800";
    if (action.includes("Kunci Jawaban")) return "bg-teal-100 text-teal-800";
    if (action.includes("Update Profil"))
      return "bg-orange-100 text-orange-800";
    if (action.includes("Update Password")) return "bg-pink-100 text-pink-800";
    if (action.includes("Hapus Akun")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      <Sidebar />
      <main className="ml-64 w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Log Aktivitas User
        </h1>

        <input
          type="text"
          placeholder="Cari berdasarkan email atau aktivitas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded-md"
        />

        <button
          onClick={handleDeleteSelected}
          disabled={selectedLogs.length === 0}
          className={`mb-3 px-4 py-2 rounded-md text-white ${
            selectedLogs.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Hapus yang dipilih ({selectedLogs.length})
        </button>

        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2"></th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => {
                    setSortBy("timestamp");
                    setSortAsc(!sortAsc);
                  }}
                >
                  Waktu {sortBy === "timestamp" && (sortAsc ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => {
                    setSortBy("email");
                    setSortAsc(!sortAsc);
                  }}
                >
                  Email User {sortBy === "email" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="px-4 py-2">Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-red-500">
                    Gagal memuat data log dari server.
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    Tidak ada log aktivitas.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log, i) => {
                  const isRecent =
                    moment().diff(moment(log.timestamp), "hours") < 1;
                  return (
                    <tr
                      key={i}
                      className={`border-b ${isRecent ? "bg-gray-50" : ""}`}
                    >
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(
                            (currentPage - 1) * itemsPerPage + i
                          )}
                          onChange={() => handleCheckboxChange(i)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        {moment(log.timestamp).format("M/D/YYYY, h:mm:ss A")}
                      </td>
                      <td className="px-4 py-2">{log.email}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getBadgeClass(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default withAdminAuth(LogActivityPage);
