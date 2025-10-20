"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import withAdminAuth from "../components/hoc/withAdminAuth";
import { Eye, Trash2, X } from "lucide-react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const kategoriList = ["Moj i to goi", "Kaiwa to hyōgen", "Dokkai", "Choukai"];

const ManageQuestionsPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [filterKategori, setFilterKategori] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const perPage = 50;

  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement(document.body); // atau gunakan "#__next" kalau yakin sudah ada
    }
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/questions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        const result = await res.json();
        setData(Array.isArray(result) ? result : result.data || []);
      } catch (error) {
        console.error("Gagal mengambil data soal:", error);
      }
    };

    fetchQuestions();
  }, []);

  const filtered = data.filter(
    (q) =>
      ((q.questionText || "").toLowerCase().includes(search.toLowerCase()) ||
        (q.topic || "").toLowerCase().includes(search.toLowerCase())) &&
      (filterKategori === "" || q.topic === filterKategori)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleEditChange = (field, value) => {
    setSelectedQuestion({ ...selectedQuestion, [field]: value });
  };

  const handleEditOpsiChange = (index, value) => {
    const newOpsi = [...selectedQuestion.options];
    newOpsi[index] = value;
    setSelectedQuestion({ ...selectedQuestion, options: newOpsi });
  };

  const handleImageChange = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    setSelectedQuestion((prev) => ({
      ...prev,
      mediaImageUrl: result.filePath,
    }));
  };

  const handleAudioChange = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    setSelectedQuestion((prev) => ({
      ...prev,
      mediaAudioUrl: result.filePath,
    }));
  };

  const simpanPerubahan = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/questions/${selectedQuestion._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            topic: selectedQuestion.topic,
            questionText: selectedQuestion.questionText,
            mediaImageUrl: selectedQuestion.mediaImageUrl || "",
            mediaAudioUrl: selectedQuestion.mediaAudioUrl || "",
            options: selectedQuestion.options,
            correctAnswer: selectedQuestion.correctAnswer,
            explanation: selectedQuestion.explanation,
          }),
        }
      );

      if (res.ok) {
        const updated = data.map((q) =>
          q._id === selectedQuestion._id ? selectedQuestion : q
        );
        setData(updated);
        setSelectedQuestion(null);
        toast.success("✅ Soal berhasil diperbarui!");
      } else {
        const error = await res.json();
        alert(`Gagal menyimpan: ${error.message}`);
      }
    } catch (err) {
      console.error("Gagal menyimpan perubahan:", err);
    }
  };

  const confirmHapusSoal = (id) => {
    setIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleHapusConfirmed = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/questions/${idToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (res.ok) {
        setData(data.filter((q) => q._id !== idToDelete));
        toast.success("🗑️ Soal berhasil dihapus!");
      } else {
        const error = await res.json();
        alert(`Gagal menghapus: ${error.message}`);
      }
    } catch (err) {
      console.error("Gagal hapus soal:", err);
    } finally {
      setShowDeleteModal(false);
      setIdToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar Soal</h1>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari pertanyaan atau kategori..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
          />

          <select
            value={filterKategori}
            onChange={(e) => {
              setFilterKategori(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Pertanyaan</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-center">Jumlah Opsi</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Tidak ada soal ditemukan.
                  </td>
                </tr>
              ) : (
                current.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 text-gray-700"
                  >
                    <td className="px-6 py-4">{item.questionText}</td>
                    <td className="px-6 py-4">{item.topic}</td>
                    <td className="px-6 py-4 text-center">
                      {item.options.length}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-3">
                      <button
                        onClick={() => setSelectedQuestion(item)}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Eye size={16} /> Lihat
                      </button>
                      <button
                        onClick={() => confirmHapusSoal(item._id)}
                        className="text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

        <Modal
          isOpen={!!selectedQuestion}
          onRequestClose={() => setSelectedQuestion(null)}
          className="bg-white w-[90vw] max-w-5xl mx-auto my-10 max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-8 outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
        >
          {selectedQuestion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Soal</h2>
                <button onClick={() => setSelectedQuestion(null)}>
                  <X />
                </button>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Kategori
                </label>
                <select
                  value={selectedQuestion.topic}
                  onChange={(e) => handleEditChange("topic", e.target.value)}
                  className="mt-1 border border-gray-300 px-3 py-2 rounded w-full text-gray-800"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {kategoriList.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Pertanyaan
                </label>
                <textarea
                  value={selectedQuestion.questionText}
                  onChange={(e) =>
                    handleEditChange("questionText", e.target.value)
                  }
                  className="mt-1 border border-gray-300 px-3 py-2 rounded w-full text-gray-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Pilihan Jawaban (Pilih salah satu yang benar)
                </label>
                {selectedQuestion.options.map((opsi, j) => (
                  <div key={j} className="mb-2 flex items-center gap-2">
                    <input
                      type="radio"
                      name="jawaban-edit"
                      checked={selectedQuestion.correctAnswer === j}
                      onChange={() => handleEditChange("correctAnswer", j)}
                      className="text-blue-600"
                    />
                    <input
                      type="text"
                      value={opsi || ""}
                      onChange={(e) => handleEditOpsiChange(j, e.target.value)}
                      placeholder={`Pilihan ${String.fromCharCode(65 + j)}`}
                      className="border border-gray-300 px-3 py-2 rounded w-full text-gray-800"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Upload Gambar (JPG/PNG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kosongkan jika tidak ingin mengganti media.
              </p>
              {!selectedQuestion.mediaImageUrl &&
                !selectedQuestion.mediaAudioUrl && (
                  <p className="text-sm text-gray-500 italic">
                    Tidak ada media yang terlampir.
                  </p>
                )}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Upload Suara (MP3)
                </label>
                <input
                  type="file"
                  accept="audio/mpeg"
                  onChange={(e) => handleAudioChange(e.target.files[0])}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kosongkan jika tidak ingin mengganti media.
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Penjelasan (Opsional)
                </label>
                <textarea
                  value={selectedQuestion.explanation || ""}
                  onChange={(e) =>
                    handleEditChange("explanation", e.target.value)
                  }
                  placeholder="Masukkan penjelasan untuk soal ini"
                  className="border border-gray-300 px-3 py-2 rounded w-full text-gray-800"
                />
              </div>

              {/* Preview Media */}
              <div className="col-span-2 mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Preview Media
                </p>

                {selectedQuestion.mediaImageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API}${selectedQuestion.mediaImageUrl}`}
                    alt="Preview"
                    className="max-h-40 mt-2 mb-2 border rounded"
                  />
                )}

                {selectedQuestion.mediaAudioUrl && (
                  <audio controls>
                    <source
                      src={`${process.env.NEXT_PUBLIC_API}${selectedQuestion.mediaAudioUrl}`}
                    />
                  </audio>
                )}

                {!selectedQuestion.mediaImageUrl &&
                  !selectedQuestion.mediaAudioUrl && (
                    <p className="text-sm text-gray-500 italic">
                      Tidak ada media yang terlampir.
                    </p>
                  )}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={simpanPerubahan}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-auto mt-40 shadow-lg outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Konfirmasi Hapus
          </h2>
          <p className="text-gray-600 mb-6">
            Apakah kamu yakin ingin menghapus soal ini?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              onClick={handleHapusConfirmed}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </Modal>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </main>
    </div>
  );
};

export default withAdminAuth(ManageQuestionsPage);
