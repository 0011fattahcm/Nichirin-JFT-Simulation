"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const API_URL = `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/announcements`;

const PengumumanPage = () => {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [list, setList] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await res.json();
      setList(data);
    } catch (err) {
      console.error("Gagal mengambil data pengumuman:", err);
    }
  };

  const showPopup = (msg, type = "success") => {
    setPopup({ show: true, message: msg, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 4000);
  };

  const handleSubmit = async () => {
    if (!judul || !isi) {
      showPopup("Judul dan isi wajib diisi", "error");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ title: judul, content: isi }),
      });

      if (res.ok) {
        setJudul("");
        setIsi("");
        fetchData();
        showPopup("Pengumuman berhasil dikirim");
      } else {
        showPopup("Gagal mengirim pengumuman", "error");
      }
    } catch (err) {
      console.error(err);
      showPopup("Terjadi kesalahan saat mengirim", "error");
    }
  };

  const editField = async (id, field, value) => {
    const item = list.find((item) => item._id === id);
    if (!item) return;

    const updated = { ...item, [field]: value };

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          title: updated.title,
          content: updated.content,
        }),
      });

      setList((prev) => prev.map((item) => (item._id === id ? updated : item)));
      showPopup("Pengumuman diperbarui");
    } catch (err) {
      console.error("Gagal update:", err);
    }
  };

  const hapus = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setList((prev) => prev.filter((item) => item._id !== id));
      showPopup("Pengumuman dihapus");
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pengumuman</h1>

        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Buat Pengumuman
          </h2>
          <input
            type="text"
            placeholder="Judul Pengumuman"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="border w-full px-3 py-2 mb-3 rounded text-gray-800 placeholder-gray-400"
          />
          <textarea
            placeholder="Isi Pengumuman"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            className="border w-full px-3 py-2 mb-3 rounded text-gray-800 placeholder-gray-400"
            rows={4}
          ></textarea>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kirim Pengumuman
          </button>
        </div>

        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-xl shadow flex flex-col gap-2"
            >
              <input
                type="text"
                value={item.title}
                onChange={(e) => editField(item._id, "title", e.target.value)}
                className="text-lg font-semibold text-gray-800 border rounded px-2 py-1"
              />
              <textarea
                value={item.content}
                onChange={(e) => editField(item._id, "content", e.target.value)}
                className="text-gray-700 border rounded px-2 py-1"
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => hapus(item._id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={18} /> Hapus
                </button>
                <span className="text-sm text-gray-400">
                  {new Date(item.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {popup.show && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 transition-all duration-500 ${
            popup.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default PengumumanPage;
