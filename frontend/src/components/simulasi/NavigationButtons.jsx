"use client";

export default function NavigationButtons({
  currentIndex,
  total,
  onPrev,
  onNext,
  onSubmitKeseluruhan,
  currentSession,
  sesiOrder,
  isSubmitting, // ✅ tambahkan di sini
}) {
  const isLastSession = currentSession === sesiOrder[sesiOrder.length - 1];
  const isLastSoal = currentIndex === total - 1;

  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={onPrev}
        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        disabled={currentIndex === 0}
      >
        〈 Sebelumnya
      </button>

      {isLastSession && isLastSoal ? (
        <button
          onClick={onSubmitKeseluruhan}
          disabled={isSubmitting}
          className={`${
            isSubmitting
              ? "bg-gray-400 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } font-semibold py-2 px-4 rounded`}
        >
          {isSubmitting ? "Menyimpan..." : "✅ Selesaikan Keseluruhan Tes"}
        </button>
      ) : (
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Selanjutnya 〉
        </button>
      )}
    </div>
  );
}
