"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Rive from "@rive-app/react-canvas";

const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {" "}
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />{" "}
    <circle cx="12" cy="13" r="3" />{" "}
  </svg>
);
const AnalysisIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {" "}
    <path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.52-.17-1.04.22-1 .75c.03.35.25.65.57.8c2.32.93 3.97 3.19 3.97 5.95a6 6 0 1 1-7.23-5.45c.4-.19.68-.59.59-1.03c-.1-0.44-.52-.75-.97-.63C5.66 3.6 2 7.4 2 12a10 10 0 0 0 10 10z" />{" "}
    <path d="m15.58 12.5-1.08-2.5-2.5-1.08 1.08-2.5 2.5-1.08 1.08 2.5 2.5 1.08-1.08 2.5-2.5 1.08z" />{" "}
    <path d="m6.5 12.5-1-2-2-1 1-2 2-1 1 2 2 1-1 2-2 1z" />{" "}
  </svg>
);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {" "}
    <polyline points="20 6 9 17 4 12"></polyline>{" "}
  </svg>
);

type AppState = "CAMERA" | "CONFIRM" | "ANALYZING" | "RESULTS" | "API_ERROR";

const LOADING_STEPS = [
  {
    title: "Sedang mengenali kecantikan unikmu...",
    desc: "Kami memproses foto selfie-mu dengan teknologi AI yang terlatih menggunakan ribuan data dari berbagai bentuk wajah dan tone kulit.",
  },
  {
    title: "Menganalisis bentuk wajahmu...",
    desc: "Deteksi proporsi wajah sedang berjalan—dari lebar dahi hingga garis rahang, kami perhatikan semuanya.",
  },
  {
    title: "Mendeteksi tone kulit secara akurat...",
    desc: "Kami menganalisis undertone-mu (cool, warm, atau neutral) untuk memastikan rekomendasi warna hijab yang paling glowing untukmu.",
  },
  {
    title: "Menyesuaikan dengan karakteristik tubuhmu...",
    desc: "Berdasarkan pilihan bentuk tubuhmu, kami menyesuaikan rekomendasi gaya hijab yang menyeimbangkan siluetmu secara alami.",
  },
  {
    title: "Mencocokkan dengan gaya selebriti favorit...",
    desc: "Apakah kamu mirip dengan selebriti idola? Kami sedang mencari kemiripan gaya untuk memberimu inspirasi styling.",
  },
  {
    title: "Menggabungkan semua data untuk rekomendasi personal...",
    desc: "Setiap detail—dari wajah, kulit, hingga tubuh—sedang kami padukan untuk memberimu hasil yang benar-benar khusus untukmu.",
  },
  {
    title: "Hampir selesai... Hasil personalmu sedang dikurasi!",
    desc: "Kami percaya setiap wanita unik. Maka dari itu, analisis ini bukan sekadar algoritma—tapi perayaan atas keindahanmu.",
  },
  {
    title: "Versi terbaik dari gaya hijabmu sedang dibuat...",
    desc: "Sabar ya, kami ingin hasilnya sempurna buat kamu. Sebentar lagi, kamu akan melihat versi stylishmu yang sesungguhnya.",
  },
];

function HalamanKameraWajahContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [appState, setAppState] = useState<AppState>("CAMERA");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [completedAnalyses, setCompletedAnalyses] = useState(0);
  const totalAnalyses = 4;
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (appState !== "CAMERA" && appState !== "CONFIRM") return;
    let currentStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        currentStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch {
        setError("Kamera tidak dapat diakses.");
      }
    };
    startCamera();
    return () => {
      if (currentStream)
        currentStream.getTracks().forEach((track) => track.stop());
    };
  }, [appState]);
  useEffect(() => {
    if (appState === "ANALYZING") {
      setLoadingStep(0);
      setProgress(0);
      const stepCount = LOADING_STEPS.length;
      const totalDuration = 4000 + stepCount * 1200;
      const stepDuration = 1200;
      const stepTimer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < stepCount - 1) {
            return prev + 1;
          } else {
            clearInterval(stepTimer);
            return prev;
          }
        });
      }, stepDuration);
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            clearInterval(progressTimer);
            return 99;
          }
          return prev + 1;
        });
      }, Math.max(20, totalDuration / 100));
      const finishTimer = setTimeout(() => {
        setProgress(100);
        setAppState("RESULTS");
      }, totalDuration);
      return () => {
        clearInterval(stepTimer);
        clearInterval(progressTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [appState]);

  useEffect(() => {
    if (appState === "RESULTS") {
      const animationTimer = setInterval(() => {
        setCompletedAnalyses((prev) => {
          if (prev >= totalAnalyses) {
            clearInterval(animationTimer);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
      return () => clearInterval(animationTimer);
    }
  }, [appState]);
  useEffect(() => {
    if (completedAnalyses >= totalAnalyses) {
      const redirectTimer = setTimeout(() => {
        router.push("/ai-overview");
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [completedAnalyses, router, totalAnalyses]);
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);
      setAppState("CONFIRM");
    }
  };
  const handleRetake = () => {
    setCapturedImage(null);
    setProgress(0);
    setCompletedAnalyses(0);
    setAppState("CAMERA");
  };
  const handleAnalyze = () => {
    setAppState("ANALYZING");
  };

  if (appState === "ANALYZING") {
    const step =
      LOADING_STEPS[loadingStep] || LOADING_STEPS[LOADING_STEPS.length - 1];
    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen bg-pink-100 text-gray-800 p-4 transition-colors duration-500">
        <div className="text-center max-w-lg mx-auto">
          <Rive src="/animations/animation.riv" className="w-48 h-48 mx-auto" />
          <p className="text-2xl font-bold mt-4">
            {progress < 100 ? `${progress}%` : "99%"}
          </p>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">{step.title}</h2>
            <p className="text-gray-600 text-base">{step.desc}</p>
          </div>
        </div>
      </main>
    );
  }

  if (appState === "RESULTS") {
    const analysesList = [
      "Analisa bentuk wajahmu",
      "Analisa tone kulitmu",
      "Analisa kecocokan gaya selebriti",
      "Rekomendasi hijab personal",
    ];
    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen bg-pink-100 text-gray-800 p-4 transition-colors duration-500">
        <div className="text-center">
          <Rive
            src="/animations/animation.riv"
            stateMachines="State Machine 1"
            className="w-48 h-48 mx-auto"
          />
          <p className="text-2xl font-bold mt-4">99%</p>
        </div>
        <div className="mt-12 w-full max-w-sm flex flex-col gap-3">
          {analysesList.map((label, index) => {
            const isCompleted = index < completedAnalyses;
            return (
              <button
                key={index}
                className={`w-full p-3 font-semibold rounded-xl flex items-center justify-between transition-all duration-500 ${
                  isCompleted
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                <span>{label}</span>
                {isCompleted ? (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <CheckIcon className="text-gray-800" />
                  </div>
                ) : (
                  <AnalysisIcon className="stroke-gray-400" />
                )}
              </button>
            );
          })}
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover transform scale-x-[-1]"
      />
      <canvas ref={canvasRef} className="hidden"></canvas>
      {appState === "CAMERA" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-6">
          {" "}
          <div className="text-center text-white">
            {" "}
            <h1 className="text-2xl font-bold [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
              Scanning Wajah
            </h1>{" "}
            <p className="[text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">
              Posisikan wajah Anda di dalam bingkai
            </p>{" "}
          </div>{" "}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-sm aspect-square border-4 sm:border-[6px] border-dashed border-green-400 rounded-full animate-pulse"
            style={{ animationDuration: "3s" }}
          ></div>{" "}
          <button
            onClick={handleCapture}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400"
          >
            {" "}
            <div className="w-[72px] h-[72px] bg-white rounded-full border-2 border-black flex items-center justify-center">
              {" "}
              <CameraIcon className="text-black w-9 h-9" />{" "}
            </div>{" "}
          </button>{" "}
        </div>
      )}
      {appState === "CONFIRM" && capturedImage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          {" "}
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4">
            {" "}
            <h2 className="text-2xl font-bold text-gray-800">
              Gunakan Gambar Ini
            </h2>{" "}
            <p className="text-gray-500 text-sm mt-1 mb-6">
              Kamu bisa ambil gambar beberapa kali
            </p>{" "}
            <Image
              src={capturedImage}
              alt="Hasil Foto"
              width={400}
              height={400}
              className="rounded-lg w-full h-auto object-cover mb-6"
            />{" "}
            <div className="w-full flex flex-col gap-3">
              {" "}
              <button
                onClick={handleRetake}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100"
              >
                {" "}
                Ambil gambar ulang{" "}
              </button>{" "}
              <button
                onClick={handleAnalyze}
                className="w-full py-3 px-4 bg-pink-200 text-pink-800 font-bold rounded-xl hover:bg-pink-300 flex items-center justify-center gap-2"
              >
                {" "}
                Mulai Analisa <AnalysisIcon className="stroke-pink-800" />{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
          {" "}
          <p className="text-center text-red-400">{error}</p>{" "}
        </div>
      )}
    </main>
  );
}

export default function HalamanKameraWajah() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <HalamanKameraWajahContent />
    </Suspense>
  );
}
