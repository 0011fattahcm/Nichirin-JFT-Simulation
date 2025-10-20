"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import withAdminAuth from "../components/hoc/withAdminAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusCircle, Trash2 } from "lucide-react";

const kategoriList = ["Moj i to goi", "Kaiwa to hyōgen", "Dokkai", "Choukai"];

const InputQuestionPage = () => {
  const [soalList, setSoalList] = useState([
    {
      id: Date.now(),
      kategori: "",
      pertanyaan: "",
      opsi: ["", "", "", ""],
      jawabanBenar: null,
      image: null,
      audio: null,
      explanation: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...soalList];
    updated[index][field] = value;
    setSoalList(updated);
  };

  const handleOpsiChange = (index, opsiIndex, value) => {
    const updated = [...soalList];
    updated[index].opsi[opsiIndex] = value;
    setSoalList(updated);
  };

  const pilihJawabanBenar = (index, opsiIndex) => {
    const updated = [...soalList];
    updated[index].jawabanBenar = opsiIndex;
    setSoalList(updated);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.filePath;
  };

  const handleFileChange = async (index, field, file) => {
    const fileUrl = await uploadFile(file);
    const updated = [...soalList];
    updated[index][field] = fileUrl;
    setSoalList(updated);
  };

  const tambahForm = () => {
    setSoalList([
      ...soalList,
      {
        id: Date.now(),
        kategori: "",
        pertanyaan: "",
        opsi: ["", "", "", ""],
        jawabanBenar: null,
        image: null,
        audio: null,
        explanation: "",
      },
    ]);
  };

  const hapusForm = (index) => {
    const updated = soalList.filter((_, i) => i !== index);
    setSoalList(updated);
  };

  const inputSoal = async (index) => {
    const soal = soalList[index];

    // Pastikan opsi terdiri dari tepat 4 dan tidak ada yang kosong
    const opsi = soal.opsi;
    if (opsi.length !== 4 || opsi.some((o) => !o || o.trim() === "")) {
      toast.error(
        `Soal ${
          index + 1
        } harus memiliki 4 opsi jawaban dan tidak boleh kosong.`
      );
      return;
    }
    if (opsi.length !== 4) {
      toast.error(`Soal ${index + 1} harus memiliki 4 opsi jawaban.`);
      return;
    }

    // Validasi jawaban benar harus dalam range
    const jawabanBenar = soal.jawabanBenar;
    if (jawabanBenar < 0 || jawabanBenar > 3) {
      toast.error(`Jawaban benar soal ${index + 1} tidak valid.`);
      return;
    }

    const payload = {
      topic: soal.kategori,
      number: soal.id,
      questionText: soal.pertanyaan,
      options: opsi,
      correctAnswer: jawabanBenar,
      explanation: soal.explanation,
      mediaImageUrl: soal.image || "",
      mediaAudioUrl: soal.audio || "",
    };

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Soal ${index + 1} berhasil diinput.`);
      } else {
        toast.error(`Gagal input soal ${index + 1}: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error saat mengirim soal ${index + 1}`);
      console.error(error);
    }
  };

  const inputSemua = async () => {
    for (let i = 0; i < soalList.length; i++) {
      await inputSoal(i);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Input Soal</h1>

        {soalList.map((soal, index) => (
          <div
            key={soal.id}
            className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg text-gray-700">
                Soal {index + 1}
              </h2>
              {soalList.length > 1 && (
                <button
                  onClick={() => hapusForm(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Kategori Soal
              </label>
              <select
                value={soal.kategori}
                onChange={(e) =>
                  handleChange(index, "kategori", e.target.value)
                }
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

            <div>
              <label className="text-sm font-medium text-gray-600">
                Pertanyaan
              </label>
              <textarea
                value={soal.pertanyaan}
                onChange={(e) =>
                  handleChange(index, "pertanyaan", e.target.value)
                }
                className="mt-1 border border-gray-300 px-3 py-2 rounded w-full text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Pilihan Jawaban (Pilih salah satu yang benar)
              </label>
              {["A", "B", "C", "D"].map((label, j) => (
                <div key={j} className="mb-2 flex items-center gap-2">
                  <input
                    type="radio"
                    name={`jawaban-${index}`}
                    checked={soal.jawabanBenar === j}
                    onChange={() => pilihJawabanBenar(index, j)}
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={soal.opsi[j]}
                    onChange={(e) => handleOpsiChange(index, j, e.target.value)}
                    placeholder={`Pilihan ${label}`}
                    className="border border-gray-300 px-3 py-2 rounded w-full text-gray-800"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Upload Gambar (JPG/PNG)
              </label>
              <label className="cursor-pointer inline-block bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) =>
                    handleFileChange(index, "image", e.target.files[0])
                  }
                />
                Pilih File Gambar
              </label>
            </div>

            {soal.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_API}${soal.image}`}
                alt="Preview Gambar"
                className="max-h-40 mt-2 mb-2 border rounded"
              />
            )}

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Upload Suara (MP3)
              </label>
              <label className="cursor-pointer inline-block bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50">
                <input
                  type="file"
                  accept="audio/mpeg"
                  onChange={(e) =>
                    handleFileChange(index, "audio", e.target.files[0])
                  }
                />
                Pilih File Audio
              </label>
            </div>
            {soal.audio && (
              <audio controls>
                <source src={`${process.env.NEXT_PUBLIC_API}${soal.audio}`} />
              </audio>
            )}
            {/* Preview Media */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Preview Media
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Penjelasan (Opsional)
              </label>
              <textarea
                value={soal.explanation || ""}
                onChange={(e) =>
                  handleChange(index, "explanation", e.target.value)
                }
                placeholder="Masukkan penjelasan untuk soal ini"
                className="border border-gray-300 px-3 py-2 rounded w-full text-gray-800"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => inputSoal(index)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Input Soal Ini
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={tambahForm}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <PlusCircle size={18} />
            Tambah Form Soal
          </button>

          <button
            onClick={inputSemua}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Input Semua Soal
          </button>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default withAdminAuth(InputQuestionPage);
