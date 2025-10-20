import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Terms = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-gray-800"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-xl font-bold text-purple-700">
                Syarat & Ketentuan JFT Simulation
              </h1>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-red-500 text-sm"
              >
                Tutup
              </button>
            </div>

            <p className="mb-4 text-sm">
              Harap membaca dengan saksama sebelum menggunakan layanan kami.
              Dengan mendaftar dan menggunakan aplikasi ini, Anda dianggap telah
              menyetujui semua ketentuan berikut:
            </p>

            <h2 className="text-base font-semibold mt-6 mb-2">
              1. Penggunaan Layanan
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Aplikasi ini menyediakan simulasi tes JFT dan SSW dalam format
                real.
              </li>
              <li>
                Pengguna wajib memiliki akun aktif untuk mengakses soal-soal
                simulasi.
              </li>
              <li>
                Setiap akun memiliki kuota penggunaan sesuai paket langganan.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">
              2. Data dan Privasi
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Data pribadi Anda hanya digunakan untuk keperluan autentikasi
                dan statistik penggunaan.
              </li>
              <li>
                Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa
                izin.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">
              3. Batasan Penggunaan
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Dilarang keras menyebarkan soal atau konten aplikasi tanpa izin.
              </li>
              <li>
                Pelanggaran dapat berakibat pada penonaktifan akun tanpa refund.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">
              4. Perubahan Layanan
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Tim developer berhak mengubah konten, fitur, dan struktur tanpa
                pemberitahuan terlebih dahulu.
              </li>
              <li>
                Perubahan akan diumumkan melalui halaman utama atau email
                terdaftar.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">5. Kontak</h2>
            <p className="text-sm">
              Jika ada pertanyaan, silakan hubungi kami melalui email:{" "}
              <strong>support@jft-simulation.com</strong>
            </p>

            <p className="text-sm mt-6 text-gray-600">
              Dengan menggunakan layanan ini, Anda menyetujui semua ketentuan
              yang tercantum di atas.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terms;
