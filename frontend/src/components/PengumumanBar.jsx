"use client";
import { useEffect, useState } from "react";

export default function PengumumanBar() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/announcements`
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncement(data[0]);
        }
      } catch (err) {
        console.error("Gagal fetch pengumuman:", err);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!announcement) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm px-4 py-2 text-center font-medium shadow z-50">
      📢 <b>{announcement.title}</b> — <span>{announcement.content}</span>
    </div>
  );
}
