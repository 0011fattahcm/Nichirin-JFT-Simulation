"use client";

import { useEffect, useState } from "react";

export default function AntiCheatProtector({ userEmail = "" }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("userEmail");
    setEmail(userEmail || stored || "user@example.com");

    const preventAction = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("copy", preventAction);
    document.addEventListener("cut", preventAction);
    document.addEventListener("paste", preventAction);
    document.addEventListener("contextmenu", preventAction);

    const preventShortcut = (e) => {
      const key = e.key.toLowerCase();
      if (
        (e.ctrlKey && ["c", "x", "v", "u", "s"].includes(key)) ||
        key === "f12"
      ) {
        e.preventDefault();
        alert("Akses ini tidak diizinkan. Aktivitas Anda sedang diawasi.");
      }

      if (key === "printscreen") {
        alert(
          "📸 Screenshot tidak diperbolehkan. Admin memantau aktivitas Anda."
        );
      }
    };
    document.addEventListener("keydown", preventShortcut);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      alert("📱 Deteksi ponsel: Hindari screenshot dan screen recording.");
    }

    const checkDevtools = setInterval(() => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > 160 || heightDiff > 160) {
        alert("🚨 Developer Tools terdeteksi. Halaman akan dimuat ulang.");
        window.location.reload();
      }
    }, 1500);

    return () => {
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("cut", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("contextmenu", preventAction);
      document.removeEventListener("keydown", preventShortcut);
      clearInterval(checkDevtools);
    };
  }, [userEmail]);

  return (
    <>
      {/* Overlay watermark global */}
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(200,0,0,0.05) 0, rgba(200,0,0,0.05) 1px, transparent 1px, transparent 40px),
                            repeating-linear-gradient(-45deg, rgba(200,0,0,0.05) 0, rgba(200,0,0,0.05) 1px, transparent 1px, transparent 40px)`,
        }}
      >
        <div
          className="w-full h-full flex flex-wrap justify-center items-center opacity-10 text-red-600 text-sm"
          style={{
            fontSize: "12px",
            transform: "rotate(-20deg)",
            gap: "80px",
            padding: "80px",
          }}
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <span key={i}>{email} | Anda diawasi</span>
          ))}
        </div>
      </div>

      {/* Display warning aktif (opsional) */}
      <div className="fixed bottom-2 right-2 text-xs text-red-600 opacity-70 z-50 pointer-events-none">
        ⚠️ Aktivitas Anda sedang diawasi.
      </div>
    </>
  );
}
