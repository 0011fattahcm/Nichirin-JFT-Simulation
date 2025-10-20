"use client";

import { useEffect, useRef, useState } from "react";

export default function QuestionCard({
  soal,
  jawabanUser,
  onPilih,
  sessionKey,
  index,
  handleAudioPlay,
  playCount,
}) {
  const [showAudioLimit, setShowAudioLimit] = useState(false);
  const audioRef = useRef(null); // ⬅️ Tambah audioRef

  useEffect(() => {
    console.log("Soal saat ini:", soal);
    // Saat soal berganti, reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [soal]);

  const handlePlay = (e) => {
    const allowed = handleAudioPlay(sessionKey, index);
    if (!allowed) {
      e.preventDefault();
      e.target.pause();
      setShowAudioLimit(true);
      setTimeout(() => setShowAudioLimit(false), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6 border border-gray-200">
      {/* ✅ Media Gambar */}
      {soal.mediaImageUrl && (
        <img
          src={`${process.env.NEXT_PUBLIC_API}${soal.mediaImageUrl}`}
          alt="Gambar soal"
          className="mb-4 max-h-[300px] w-auto mx-auto rounded shadow"
        />
      )}

      {/* ✅ Media Audio */}
      {soal.mediaAudioUrl && (
        <div className="mb-4 text-center">
          <audio
            ref={audioRef}
            controls
            controlsList="nodownload"
            onPlay={handlePlay}
            className="w-full max-w-md mx-auto block border rounded"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_API}${soal.mediaAudioUrl}`}
              type="audio/mpeg"
            />
            Browser tidak mendukung audio.
          </audio>

          <p className="text-sm text-gray-600 mt-2">
            Sisa kesempatan memutar audio:{" "}
            <span className="font-semibold">{2 - playCount} kali</span>
          </p>

          {showAudioLimit && (
            <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm shadow">
              Audio hanya bisa diputar maksimal 2 kali.
            </div>
          )}
        </div>
      )}

      <p className="text-lg font-semibold mb-4">{soal.questionText}</p>

      <div className="space-y-3 mt-4">
        {(soal.choices || soal.options)?.map((opt, i) => (
          <button
            key={i}
            onClick={() => onPilih(i)}
            className={`w-full text-left px-4 py-2 rounded-lg border transition-all duration-150 font-medium ${
              jawabanUser === i
                ? "bg-green-500 text-white border-green-600"
                : "bg-gray-50 hover:bg-gray-100 border-gray-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
