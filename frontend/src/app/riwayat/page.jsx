"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function RiwayatTesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [user, setUser] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Gagal ambil data user:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p className="p-8 text-center">Memuat data...</p>;

  const history = user.testHistory || [];
  const filteredHistory = history
    .slice()
    .reverse()
    .filter((item) => {
      if (!searchDate) return true;
      const dateOnly = new Date(item.date).toISOString().slice(0, 10);
      return dateOnly === searchDate;
    });
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-100">
      <Sidebar />

      <main className="flex-1 p-6 ml-16 md:ml-16 transition-all">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          📄 Riwayat Tes
        </h1>

        {history.length === 0 ? (
          <div className="text-gray-500 text-center bg-white p-6 rounded-xl shadow">
            Belum ada riwayat tes yang tersimpan.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500 mb-4">
              Total tes mock-up yang telah kamu selesaikan:{" "}
              <span className="font-semibold text-purple-700">
                {history.length}
              </span>
            </p>
            <div className="mb-4 flex items-center gap-2">
              <label className="text-sm text-gray-700">
                Cari berdasarkan tanggal:
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setCurrentPage(1); // reset ke page pertama saat search
                }}
                className="border px-3 py-1 rounded text-sm"
              />
              {searchDate && (
                <button
                  onClick={() => setSearchDate("")}
                  className="text-blue-500 underline text-sm ml-2"
                >
                  Reset
                </button>
              )}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-purple-100 text-purple-800">
                <tr>
                  <th className="text-left px-4 py-2">Tanggal</th>
                  <th className="text-center px-4 py-2">Skor</th>
                  <th className="text-center px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((item, i) => {
                  const isPassed = item.score >= 200;
                  return (
                    <tr key={i} className="border-t text-gray-700">
                      <td className="px-4 py-2">
                        {item.date
                          ? new Date(item.date).toLocaleString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-center">{item.score}</td>
                      <td
                        className={`px-4 py-2 text-center font-semibold ${
                          isPassed ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {isPassed ? "Lulus ✅" : "Gagal ❌"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
