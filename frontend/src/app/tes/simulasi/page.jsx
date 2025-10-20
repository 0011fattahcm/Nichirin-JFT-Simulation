"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import TimerBar from "@/components/simulasi/TimerBar";
import QuestionCard from "@/components/simulasi/QuestionCard";
import SessionSidebar from "@/components/simulasi/SessionSidebar";
import NavigationButtons from "@/components/simulasi/NavigationButtons";
import ConfirmModal from "@/components/simulasi/ConfirmModal";

export default function SimulationPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [audioPlays, setAudioPlays] = useState({});
  const [answers, setAnswers] = useState({
    S1: [],
    S2: [],
    S3: [],
    S4: [],
  });
  const [sesiProgress, setSesiProgress] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [currentSession, setCurrentSession] = useState("S1");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5400);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHasil, setShowHasil] = useState(false);

  const sesiOrder = ["S1", "S2", "S3", "S4"];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data)); // simpan jika ingin pakai ulang
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSoal = async () => {
      const token = localStorage.getItem("token");

      // Cek apakah soal sudah tersimpan di localStorage
      const cachedSoal = JSON.parse(localStorage.getItem("simulasi_data"));
      const savedAnswers = JSON.parse(localStorage.getItem("jawaban_simulasi"));
      const savedSession = localStorage.getItem("currentSession_simulasi");
      const savedIndex = localStorage.getItem("currentIndex_simulasi");
      const savedTime = localStorage.getItem("timeLeft_simulasi");

      if (cachedSoal) {
        setData(cachedSoal);
        if (savedAnswers) {
          setAnswers(savedAnswers);
          setCurrentSession(savedSession || "S1");
          setCurrentIndex(parseInt(savedIndex) || 0);
          setTimeLeft(parseInt(savedTime) || 5400);
        } else {
          const initAnswer = {};
          for (let sesi in cachedSoal) {
            initAnswer[sesi] = Array(cachedSoal[sesi].length).fill(null);
          }
          setAnswers(initAnswer);
        }
      } else {
        // Jika belum ada di localStorage, panggil API
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/simulations/start`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const result = await res.json();

          if (!result.soal || Object.keys(result.soal).length === 0) {
            alert("Tidak ada simulasi yang sedang berlangsung.");
            router.push("/dashboard");
            return;
          }

          setData(result.soal);
          localStorage.setItem("simulasi_data", JSON.stringify(result.soal));

          const initAnswer = {};
          for (let sesi in result.soal) {
            initAnswer[sesi] = Array(result.soal[sesi].length).fill(null);
          }
          setAnswers(initAnswer);
        } catch (err) {
          console.error("Gagal fetch soal:", err);
          alert("Terjadi kesalahan. Silakan kembali dan mulai ulang tes.");
        }
      }
    };

    fetchSoal();
  }, []);

  useEffect(() => {
    if (!data) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Tes kamu akan hilang jika halaman ditutup.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitSimulation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("jawaban_simulasi", JSON.stringify(answers));
      localStorage.setItem("currentSession_simulasi", currentSession);
      localStorage.setItem("currentIndex_simulasi", currentIndex);
      localStorage.setItem("timeLeft_simulasi", timeLeft);
    }
  }, [answers, currentSession, currentIndex, timeLeft]);

  const handleAnswer = (index) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      updated[currentSession] = [...updated[currentSession]];
      updated[currentSession][currentIndex] = index;
      return updated;
    });
  };

  const handleSubmitSimulation = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/simulations/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      }
    );

    const result = await res.json();

    if (res.ok) {
      // Ambil kunci jawaban
      try {
        const detailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/simulations/result-detail`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (detailRes.ok) {
          const detail = await detailRes.json();
        }
      } catch (err) {
        console.error("Gagal mengambil kunci:", err);
      }

      // Bersihkan session localStorage
      localStorage.removeItem("jawaban_simulasi");
      localStorage.removeItem("currentSession_simulasi");
      localStorage.removeItem("currentIndex_simulasi");
      localStorage.removeItem("timeLeft_simulasi");

      router.push("/hasil");
    } else {
      alert(result.message || "Gagal menyimpan hasil simulasi.");
    }

    setIsSubmitting(false);
  };

  const handleSubmitKeseluruhan = () => {
    setShowModal(true);
  };

  const handleAudioPlay = (sessionKey, index) => {
    const key = `${sessionKey}_${index}`;
    const current = audioPlays[key] || 0;

    if (current >= 2) return false;

    setAudioPlays((prev) => ({
      ...prev,
      [key]: current + 1,
    }));

    return true;
  };

  const handleNext = () => {
    const sesiSoal = data[currentSession];
    const isLastSoal = currentIndex === sesiSoal.length - 1;

    if (isLastSoal) {
      const sesiIdx = sesiOrder.indexOf(currentSession);
      setSesiProgress((prev) => {
        const copy = [...prev];
        copy[sesiIdx] = true;
        return copy;
      });
      if (sesiIdx < sesiOrder.length - 1) {
        setCurrentSession(sesiOrder[sesiIdx + 1]);
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!data) return <div className="p-6">Memuat soal...</div>;

  const sesiSoal = data[currentSession];
  const soal = sesiSoal[currentIndex];
  const jawabanUser = answers[currentSession]?.[currentIndex] ?? null;
  toast.success("Tes berhasil disimpan. Mengarahkan ke hasil...");

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <SessionSidebar
        data={data}
        answers={answers}
        currentSession={currentSession}
        currentIndex={currentIndex}
        setCurrentSession={setCurrentSession}
        setCurrentIndex={setCurrentIndex}
        sesiProgress={sesiProgress}
      />

      <main className="flex-1 p-6">
        {/* <AntiCheatProtector userEmail={user?.email} /> */}
        <ConfirmModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleSubmitSimulation}
        />

        <TimerBar timeLeft={timeLeft} />

        <h2 className="text-xl font-bold mb-3">
          Sesi {currentSession} – Soal {currentIndex + 1}
        </h2>

        {soal && (
          <QuestionCard
            soal={soal}
            jawabanUser={jawabanUser}
            onPilih={handleAnswer}
            sessionKey={currentSession}
            index={currentIndex}
            handleAudioPlay={handleAudioPlay}
            playCount={audioPlays[`${currentSession}_${currentIndex}`] || 0}
          />
        )}

        <NavigationButtons
          currentIndex={currentIndex}
          total={sesiSoal.length}
          onPrev={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))}
          onNext={handleNext}
          onSubmitKeseluruhan={handleSubmitKeseluruhan}
          currentSession={currentSession}
          sesiOrder={sesiOrder}
          isSubmitting={isSubmitting} // ✅ tambahkan ini
        />
      </main>
    </div>
  );
}
