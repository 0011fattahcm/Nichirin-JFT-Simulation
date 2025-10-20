"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HasilPage() {
  const [user, setUser] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [kunci, setKunci] = useState([]);
  const [kunciFetched, setKunciFetched] = useState(false);

  const router = useRouter();

  // Ambil profil user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  // Ambil hasil
  useEffect(() => {
    const fetchHasil = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/simulations/result`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setHasil(data.result);
    };

    fetchHasil();
  }, []);

  useEffect(() => {
    const fetchKunci = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/simulations/result-detail`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setKunci(data.result);
      } else {
        console.log("Kunci jawaban tidak tersedia.");
        setKunci([]);
      }

      setKunciFetched(true);
    };

    if (user && !kunciFetched) {
      fetchKunci();
    }
  }, [user]);

  if (!hasil) return <p className="p-6">Memuat hasil tes...</p>;

  const isPass = hasil.score >= 200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-purple-700">
          🎉 Hasil Tes Kamu
        </h1>
        <p className="text-gray-600 mb-6">
          {hasil.date ? new Date(hasil.date).toLocaleString("id-ID") : "-"}
        </p>

        <div className="text-6xl font-extrabold mb-2 text-gray-800">
          {hasil.score} / 250
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Minimal skor kelulusan: <strong>200</strong>
        </p>
        <p
          className={`text-xl font-semibold mb-4 ${
            isPass ? "text-green-600" : "text-red-500"
          }`}
        >
          {isPass ? "✅ Lulus" : "❌ Gagal"}
        </p>

        <p className="mb-6 text-gray-600">
          {isPass
            ? "Selamat! Kamu dinyatakan lulus simulasi tes JFT."
            : "Jangan khawatir, kamu bisa mencoba lagi. Tetap semangat ya!"}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            🔙 Kembali ke Dashboard
          </button>
          <button
            onClick={() => router.push("/riwayat")}
            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
          >
            📄 Lihat Riwayat
          </button>
        </div>

        {kunci.length > 0 && (
          <div className="mt-12 text-left">
            <h2 className="text-xl font-bold text-purple-700 mb-4">
              📘 Kunci Jawaban & Jawaban Kamu
            </h2>
            <div className="space-y-6">
              {kunci.map((item, idx) => (
                <div key={idx} className="bg-gray-50 border p-4 rounded shadow">
                  <p className="mb-2 text-black font-semibold">
                    {idx + 1}. {item.questionText}
                  </p>
                  <ul className="pl-4 list-disc text-black space-y-1 text-sm">
                    {(item.options || []).map((opt, i) => {
                      const isCorrect = i === item.correctAnswer;
                      const isUser = i === item.userAnswer;
                      return (
                        <li
                          key={i}
                          className={`
                            ${isCorrect ? "text-green-700 font-bold" : ""}
                            ${
                              isUser && !isCorrect
                                ? "text-red-500 underline"
                                : ""
                            }
                          `}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
