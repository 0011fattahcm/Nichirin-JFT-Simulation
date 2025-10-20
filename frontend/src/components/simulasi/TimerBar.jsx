// components/simulasi/TimerBar.jsx
"use client";

export default function TimerBar({ timeLeft }) {
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="text-lg font-semibold text-red-600 border-b pb-2 mb-4 flex justify-between items-center">
      <span className="text-gray-800 font-bold text-xl">🕒 Waktu Tersisa:</span>
      <span className="bg-red-100 px-3 py-1 rounded text-red-700">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
