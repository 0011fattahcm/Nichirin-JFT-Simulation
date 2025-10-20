"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function TesIntroPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Gagal ambil profil:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  const handleStart = () => {
    setShowModal(true);
  };

  const handleConfirmStart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/simulations/start`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      localStorage.setItem("simulasi_data", JSON.stringify(result.soal));
      router.push("/tes/simulasi");
    } catch (err) {
      alert("Gagal memulai simulasi");
    }
  };

  if (!user) return <p className="text-center p-8">Memuat...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-100 text-gray-800">
      <Sidebar />
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl space-y-4 text-center">
            <h2 className="text-xl font-bold text-purple-700">
              Mulai Tes Simulasi?
            </h2>
            <p className="text-gray-700">
              Setelah dimulai, kamu tidak bisa kembali ke halaman ini dan kuota
              tes akan terpakai 1 kesempatan. Pastikan kamu sudah siap!
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmStart}
                className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Ya, Mulai Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 ml-16 md:ml-16 transition-all">
        <div className="w-full max-w-none bg-white shadow-lg rounded-xl p-8 space-y-8">
          {/* Judul dan kuota */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-purple-700">
              Simulation JFT-Sample
            </h1>
            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Kuota Tersisa: {user.mockupQuota}
            </span>
          </div>

          {/* Tombol mulai */}
          <button
            onClick={handleStart}
            disabled={user.mockupQuota <= 0}
            className={`w-full py-3 rounded-lg font-semibold text-white transition
    ${
      user.mockupQuota > 0
        ? "bg-purple-600 hover:bg-purple-700"
        : "bg-gray-400 cursor-not-allowed"
    }`}
          >
            {user.mockupQuota > 0
              ? "Mulai Tes Mock Up Sekarang"
              : "Kuota Habis"}
          </button>

          {/* Struktur tes */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">
              📚 Struktur Tes:
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded-md overflow-hidden">
                <thead className="bg-purple-100 text-purple-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Sesi</th>
                    <th className="px-4 py-2 text-left">Topik</th>
                    <th className="px-4 py-2 text-center">Jumlah Soal</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t">
                    <td className="px-4 py-2">Sesi 1</td>
                    <td className="px-4 py-2">Moji to Goi</td>
                    <td className="px-4 py-2 text-center">15</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Sesi 2</td>
                    <td className="px-4 py-2">Kaiwa to Hyōgen</td>
                    <td className="px-4 py-2 text-center">15</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Sesi 3</td>
                    <td className="px-4 py-2">Dokkai</td>
                    <td className="px-4 py-2 text-center">10</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Sesi 4</td>
                    <td className="px-4 py-2">Choukai</td>
                    <td className="px-4 py-2 text-center">10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tolong dibaca */}
          <section>
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              🚨 Tolong Baca Ini Sebelum Tes!
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                Dilarang mengcopy, screenshoot, dan record soal selama simulasi
                berlangsung. Semua tindakan Anda di awasi.
              </li>
              <li>
                Jika ketahuan melakukan pelanggaran tersebut diatas akan
                perdampak pada penghapusan akun dan blacklist.
              </li>
              <li>
                Pastikan jaringan internet baik, refresh halaman ini 1–2x untuk
                memastikan koneksi.
              </li>
              <li>Untuk jaga-jaga, hapus cache browser sebelum login.</li>
              <li>Nonaktifkan fitur auto-translate browser kamu.</li>
              <li>
                Disarankan jangan refresh halaman website saat tes berlangsung!
              </li>
              <li>
                Sangat disarankan menggunakan headset untuk sesi{" "}
                <strong>Choukai</strong>
              </li>
              <li>
                Rekaman audio hanya dapat diputar <strong>2 kali</strong>.
              </li>
              <li>Tidak bisa menjeda audio saat sedang diputar.</li>
            </ul>
          </section>

          {/* Cara penggunaan */}
          <section>
            <h2 className="text-lg font-semibold text-purple-600 mb-2">
              🛠️ Cara Penggunaan
            </h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              <li>
                Soal memiliki indikator waktu, dan akan otomatis selesai jika
                waktu habis.
              </li>
              <li>Icon 🪟 membuka daftar soal per sesi.</li>
              <li>
                Klik salah satu dari empat opsi jawaban (A–D). Jawaban terpilih
                akan berwarna{" "}
                <span className="text-green-600 font-semibold">HIJAU</span>.
              </li>
            </ul>
          </section>

          {/* Navigasi soal */}
          <section>
            <h2 className="text-lg font-semibold text-purple-600 mb-2">
              📑 Navigasi Soal
            </h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              <li>🪟 Menampilkan daftar soal dalam satu sesi.</li>
              <li>
                〈 Tombol panah kiri untuk soal sebelumnya, 〉 panah kanan untuk
                soal selanjutnya.
              </li>
              <li>Nomor soal yang sudah dijawab akan berwarna hijau.</li>
              <li>
                Di akhir sesi 4 (Dokkai), kamu akan diminta konfirmasi untuk
                menyelesaikan tes.
              </li>
            </ul>
          </section>

          {/* Hasil */}
          <section>
            <h2 className="text-lg font-semibold text-purple-600 mb-2">
              📊 Hasil Tes
            </h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              <li>Hasil akan langsung muncul setelah semua sesi selesai.</li>
              <li>
                Warna hijau: <strong>Lulus</strong>, Warna merah:{" "}
                <strong>Gagal</strong>.
              </li>
              <li>
                <strong>Batas kelulusan: 200 poin.</strong>
              </li>
              <li>Hasil tersimpan otomatis. Silakan lihat di Riwayat Anda.</li>
              <li>Kunci jawaban tersedia dengan tombol "Kunci Jawaban 🔑"</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
