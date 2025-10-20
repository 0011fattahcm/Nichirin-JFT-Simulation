"use client";

export default function ConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-center text-red-600">
          Konfirmasi Selesai Tes
        </h2>
        <p className="mb-6 text-center">
          Apakah kamu yakin ingin menyelesaikan sesi ini? Jawaban kamu akan
          langsung dikirim dan tidak bisa kembali ke sesi ini.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            Ya, Selesaikan
          </button>
        </div>
      </div>
    </div>
  );
}
