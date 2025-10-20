"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import withAdminAuth from "../components/hoc/withAdminAuth";

const HistoryPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/simulations`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching riwayat:", err);
      }
    };

    fetchRiwayat();
  }, []);

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.userId?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesResult =
      resultFilter === "all" || item.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Riwayat Ujian Pengguna
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2"
          />
          <select
            className="border border-gray-300 rounded-md px-4 py-2"
            value={resultFilter}
            onChange={(e) => {
              setResultFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Semua Hasil</option>
            <option value="Lulus">Lulus</option>
            <option value="Tidak Lulus">Tidak Lulus</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Judul Tes</th>
                <th className="px-6 py-3 text-center">Tanggal</th>
                <th className="px-6 py-3 text-center">Skor</th>
                <th className="px-6 py-3 text-center">Hasil</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Tidak ada riwayat ditemukan.
                  </td>
                </tr>
              ) : (
                current.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 text-gray-700"
                  >
                    <td className="px-6 py-4">{item.userId?.name || "-"}</td>
                    <td className="px-6 py-4">{item.userId?.email || "-"}</td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4 text-center">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">{item.score}</td>
                    <td className="py-2 font-semibold">
                      <span
                        className={`px-2 py-1 rounded ${
                          item.score >= 200
                            ? "text-green-600 bg-green-100"
                            : "text-red-600 bg-red-100"
                        }`}
                      >
                        {item.score >= 200 ? "Lulus" : "Tidak Lulus"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default withAdminAuth(HistoryPage);
