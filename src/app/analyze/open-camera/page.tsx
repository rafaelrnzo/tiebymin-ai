"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useAnalysis } from "@/context/AnalysisContext";
import { useRive } from "@rive-app/react-canvas";
import { Button } from "@/components/ui/button";
import url from "@/lib/url";
import { Camera, Check, RotateCw } from "lucide-react";

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
    <path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.52-.17-1.04.22-1 .75c.03.35.25.65.57.8c2.32.93 3.97 3.19 3.97 5.95a6 6 0 1 1-7.23-5.45c.4-.19.68-.59.59-1.03c-.1-0.44-.52-.75-.97-.63C5.66 3.6 2 7.4 2 12a10 10 0 0 0 10 10z" />{" "}
    <path d="m15.58 12.5-1.08-2.5-2.5-1.08 1.08-2.5 2.5-1.08 1.08 2.5 2.5 1.08-1.08 2.5-2.5 1.08z" />{" "}
    <path d="m6.5 12.5-1-2-2-1 1-2 2-1 1 2 2 1-1 2-2 1z" />
  </svg>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-800"></div>
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

const RiveLoadingAnimation = () => {
  const { RiveComponent } = useRive({
    src: "/animations/Loading.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return (
    <div className="w-48 h-48 mx-auto">
      <RiveComponent />
    </div>
  );
};

function HalamanKameraWajahContent() {
  const router = useRouter();
  const { analysisData, setAnalysisData } = useAnalysis();
  const [analysisResultId, setAnalysisResultId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [appState, setAppState] = useState<AppState>("CAMERA");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [completedAnalyses, setCompletedAnalyses] = useState(0);
  const totalAnalyses = 4;

  const [loadingStep, setLoadingStep] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const handleCameraSwitch = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    if (appState !== "CAMERA" && appState !== "CONFIRM") return;
    let currentStream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        currentStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch {
        setError(
          "Kamera tidak dapat diakses. Mohon izinkan akses kamera di browser Anda."
        );
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
      // 1 minute 40 seconds
      const totalDuration = 100000;
      const stepDuration = Math.floor(totalDuration / stepCount);

      const stepTimer = setInterval(() => {
        setLoadingStep((prev) => (prev < stepCount - 1 ? prev + 1 : prev));
      }, stepDuration);

      const progressTimer = setInterval(() => {
        setProgress((prev) => (prev >= 99 ? 99 : prev + 1));
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
        setCompletedAnalyses((prev) =>
          prev >= totalAnalyses ? prev : prev + 1
        );
      }, 700);
      return () => clearInterval(animationTimer);
    }
  }, [appState]);

  useEffect(() => {
    if (completedAnalyses >= totalAnalyses && analysisResultId) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tiebymin-analysis-data");
        setAnalysisData({ tinggi: "", berat: "", umur: "", body_shape_id: "" });
      }

      const redirectTimer = setTimeout(() => {
        router.push(`/ai-overview?result_id=${analysisResultId}`);
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [
    completedAnalyses,
    analysisResultId,
    totalAnalyses,
    router,
    setAnalysisData,
  ]);

  // Helper function to convert data URL to Blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

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
    setApiError("");
  };

  const handleFullAnalysis = async () => {
    const { tinggi, berat, umur, body_shape_id } = analysisData;

    console.log("MENGIRIM PAYLOAD KE API:", {
      tinggi,
      berat,
      umur,
      body_shape_id,
      foto_wajah: "ada",
    });

    if (!capturedImage) {
      setApiError(
        "Informasi tidak lengkap. Foto atau tipe tubuh tidak ditemukan."
      );
      setAppState("API_ERROR");
      return;
    }

    const imageBlob = dataURLtoBlob(capturedImage);
    if (!imageBlob) {
      setApiError("Gagal memproses gambar.");
      setAppState("API_ERROR");
      return;
    }

    const tinggiParse = parseFloat(tinggi);
    const beratParse = parseFloat(berat);
    const umurParse = parseInt(umur, 10);

    const formData = new FormData();
    formData.append("user_id", "8a40ef18-1335-479e-8465-b63cdc3ebc88");
    formData.append("tinggi_badan", String(tinggiParse));
    formData.append("berat_badan", String(beratParse));
    formData.append("umur", String(umurParse));
    formData.append("body_shape_id", body_shape_id);
    formData.append("foto_wajah", imageBlob, "face-photo.png");

    setIsApiLoading(true);
    setApiError("");
    let endpoint = `${url}/v1/analysis/full-analysis`;
    endpoint = endpoint.replace(/([^:]\/)\/+/g, "$1");
    console.log("fetch endpoint:", endpoint);

    if (endpoint.startsWith("http://")) {
      endpoint = endpoint.replace("http://", "https://");
    }

    try {
      const response = await axios.post(
        endpoint,
        formData
      );

      if (response.status >= 200 && response.status < 300) {
        const resultId = response.data.analysis_result_id;
        if (resultId) {
          setAnalysisResultId(resultId);
          setAppState("ANALYZING");
        } else {
          throw new Error("API berhasil tapi tidak mengembalikan result ID.");
        }
      } else {
        throw new Error(
          response.data?.message || `HTTP error! status: ${response.status}`
        );
      }

      setAppState("ANALYZING");
    } catch (error) {
      const err = error as Error;
      console.error("API Error:", err);
      setApiError(
        err.message ||
          "Terjadi kesalahan saat menghubungi server. Silakan coba lagi."
      );
      setAppState("API_ERROR");
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleAnalyze = () => {
    handleFullAnalysis();
  };

  if (appState === "ANALYZING") {
    const step =
      LOADING_STEPS[loadingStep] || LOADING_STEPS[LOADING_STEPS.length - 1];
    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen bg-pink-100 text-gray-800 p-4 transition-colors duration-500">
        <div className="text-center max-w-lg mx-auto">
          <RiveLoadingAnimation />
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
          <RiveLoadingAnimation />
          <p className="text-2xl font-bold mt-4">99%</p>
        </div>
        <div className="mt-12 w-full max-w-sm flex flex-col gap-3">
          {analysesList.map((label, index) => {
            const isCompleted = index < completedAnalyses;
            return (
              <Button
                key={index}
                className={`w-full p-3 font-semibold rounded-xl flex items-center justify-between transition-all duration-500
                  ${
                    isCompleted
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-500 border border-gray-200"
                  }
                `}
              >
                <span>{label}</span>
                {isCompleted ? (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Check className="text-gray-800" />
                  </div>
                ) : (
                  <AnalysisIcon className="stroke-gray-400" />
                )}
              </Button>
            );
          })}
        </div>
      </main>
    );
  }

  if (appState === "API_ERROR") {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4">
          <h2 className="text-2xl font-bold text-red-600">Analisa Gagal</h2>
          <p className="text-gray-600 mt-2 mb-6">{apiError}</p>
          <Button
            onClick={handleRetake}
            className="w-full py-3 px-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
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
          <div className="relative z-20 text-center flex items-center gap-3 text-black bg-[#FFC6C6] mt-18 py-4 px-6 rounded-2xl">
            <Image
              src="/si_warning-fill.svg"
              alt="si-warning"
              width={25}
              height={25}
            />
            <h1 className="text-md">Letakan Wajah di dalam Frame</h1>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-sm aspect-[3/4] rounded-[50%/60%] shadow-[0_0_0_99vmax_rgba(0,0,0,0.5)] pointer-events-none"></div>

          {/* Bingkai Pemandu Hijau */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-sm aspect-[3/4] border-4 sm:border-[6px] border-dashed border-green-400 rounded-[50%/60%] animate-pulse pointer-events-none"
            style={{ animationDuration: "3s" }}
          ></div>
         <div className="relative z-20 w-full max-w-sm flex justify-center items-center gap-12">
            {/* Tombol Ganti Kamera */}
            <Button
                onClick={handleCameraSwitch}
                className="w-16 h-16 -ml-12 bg-white/30 mr-2 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Ganti Kamera"
            >
                <RotateCw className="text-white size-8" />
            </Button>

            {/* Tombol Ambil Gambar */}
            <Button
                onClick={handleCapture}
                className="w-20 h-20 -ml-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400"
            >
                <Camera className="text-white size-12 fill-black" />
            </Button>

        </div>
    </div>
      )}

      {appState === "CONFIRM" && capturedImage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4">
            <h2 className="font-oswald text-2xl font-bold text-gray-800">
              Gunakan Gambar Ini
            </h2>
            <p className="font-poppins text-gray-500 text-sm mt-1 mb-6">
              Kamu bisa ambil gambar beberapa kali
            </p>
            <Image
              src={capturedImage}
              alt="Hasil Foto"
              width={400}
              height={400}
              className="rounded-lg w-full h-auto object-cover mb-6"
            />
            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={handleRetake}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100"
              >
                <span className="font-poppins">Ambil gambar ulang</span>
              </Button>
              <Button
                onClick={handleAnalyze}
                className="w-full py-3 px-4 bg-[#FFC6C6] text-black font-bold rounded-xl hover:bg-pink-300 flex items-center justify-center gap-2"
                disabled={isApiLoading}
              >
                {isApiLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <span className="font-poppins">Mulai Analisa</span>{" "}
                    <AnalysisIcon className="stroke-black" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
          <p className="text-center text-red-400">{error}</p>
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
