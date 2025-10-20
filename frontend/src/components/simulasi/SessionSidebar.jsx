"use client";

const sesiLabel = {
  S1: "Moji to Goi",
  S2: "Kaiwa",
  S3: "Choukai",
  S4: "Dokkai",
};

export default function SessionSidebar({
  data,
  answers,
  currentSession,
  currentIndex,
  setCurrentSession,
  setCurrentIndex,
  sesiProgress,
}) {
  const sesiOrder = ["S1", "S2", "S3", "S4"];

  const bisaKlikNomor = (sesiKey, i) => {
    return (
      sesiKey === currentSession ||
      sesiProgress[sesiOrder.indexOf(sesiKey)] ||
      answers[sesiKey]?.[i] != null
    );
  };

  const handleKlikNomor = (sesiKey, i) => {
    if (bisaKlikNomor(sesiKey, i)) {
      setCurrentSession(sesiKey);
      setCurrentIndex(i);
    }
  };

  const handleKlikSesi = (sesiKey) => {
    const sesiIndex = sesiOrder.indexOf(sesiKey);
    if (sesiIndex === -1) return;

    // Hanya bisa akses sesi saat ini atau sesi yang sudah selesai
    if (
      sesiIndex === sesiOrder.indexOf(currentSession) ||
      sesiProgress[sesiIndex]
    ) {
      setCurrentSession(sesiKey);
      setCurrentIndex(0); // reset ke soal pertama sesi baru
    }
  };

  return (
    <div className="w-60 bg-white border-r p-4 space-y-6 shadow-inner min-h-screen">
      <h2 className="text-xl font-bold text-purple-700">🧭 Navigasi</h2>

      {["S1", "S2", "S3", "S4"].map((sesiKey, sesiIdx) => (
        <div key={sesiKey}>
          <button
            onClick={() => handleKlikSesi(sesiKey)}
            className={`font-semibold mb-2 w-full text-left ${
              sesiKey === currentSession
                ? "text-purple-700"
                : sesiProgress[sesiIdx]
                ? "text-gray-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {sesiKey} – {sesiLabel[sesiKey]}
          </button>

          <div className="grid grid-cols-5 gap-1 mb-4">
            {data[sesiKey]?.map((_, i) => {
              const sudahJawab = answers[sesiKey]?.[i] != null;
              const aktif = sesiKey === currentSession && i === currentIndex;

              return (
                <button
                  key={i}
                  onClick={() => handleKlikNomor(sesiKey, i)}
                  disabled={!bisaKlikNomor(sesiKey, i)}
                  className={`text-sm px-2 py-1 rounded-lg font-semibold border text-center ${
                    aktif
                      ? "bg-blue-600 text-white"
                      : sudahJawab
                      ? "bg-green-100 text-green-800"
                      : bisaKlikNomor(sesiKey, i)
                      ? "bg-gray-100 text-gray-500"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
