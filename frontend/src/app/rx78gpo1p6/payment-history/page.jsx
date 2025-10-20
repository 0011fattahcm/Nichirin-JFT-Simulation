"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import withAdminAuth from "../components/hoc/withAdminAuth";
// Dummy data pembayaran
const dummyPayments = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  user: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  date: `2025-07-${String((i % 28) + 1).padStart(2, "0")}`,
  amount: 25000 + (i % 3) * 10000,
  status: ["Sukses", "Gagal", "Pending"][i % 3],
}));

const PaymentHistoryPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    setData(dummyPayments);
  }, []);

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.user.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
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
          Riwayat Pembayaran Pengguna
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Semua Status</option>
            <option value="Sukses">Sukses</option>
            <option value="Pending">Pending</option>
            <option value="Gagal">Gagal</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-center">Tanggal</th>
                <th className="px-6 py-3 text-center">Jumlah</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                current.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 text-gray-700"
                  >
                    <td className="px-6 py-4">{item.user}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4 text-center">{item.date}</td>
                    <td className="px-6 py-4 text-center">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        item.status === "Sukses"
                          ? "text-green-600"
                          : item.status === "Pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
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

export default withAdminAuth(PaymentHistoryPage);
