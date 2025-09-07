"use client";

// React imports
import { Suspense, useEffect, useRef, useState } from "react";

// Next.js imports
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { ErrorModal } from "@/components/sections/error-modal";

// Icons
import { Camera, Check, File, RotateCw } from "lucide-react";

// Animation
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

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

type AppState =
  | "CAMERA"
  | "CONFIRM"
  | "ANALYZING"
  | "LOADING_UI"
  | "COMPLETION_MODAL"
  | "API_ERROR";

// Constants
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

const TOTAL_LOADING_DURATION = 30000; // 30 seconds
const CARDS_TO_SHOW = 4;

const RiveLoadingAnimation = () => {
  const { RiveComponent } = useRive({
    src: "/animations/Loading.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="w-80 h-[10rem] sm:w-96 sm:h-[10rem] lg:w-[30rem] lg:h-[20rem] xl:w-[35rem] xl:h-[15rem] flex justify-center items-center">
      <RiveComponent />
    </div>
  );
};

const LoadingStepCard = ({
  step,
  actualIndex,
  isCompleted,
  isActive,
  isPending,
}: {
  step: (typeof LOADING_STEPS)[0];
  actualIndex: number;
  isCompleted: boolean;
  isActive: boolean;
  isPending: boolean;
}) => (
  <div
    key={`step-${actualIndex}`}
    className={`p-4 rounded-2xl border-2 transition-all duration-500 font-poppins ${
      isCompleted
        ? "bg-[#323232] border-[#323232] text-[#f0f0f0] w-full"
        : "bg-transparent border-[#323232] text-[#323232] w-full"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        {isCompleted && <Check className="w-5 h-5 text-[#f0f0f0]" />}
        {isActive && (
          <div className="w-5 h-5 border-2 border-[#323232] border-t-transparent rounded-full animate-spin" />
        )}
        {isPending && (
          <div className="w-5 h-5 border-2 border-[#323232] rounded-full" />
        )}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium leading-tight">{step.title}</p>
      </div>
    </div>
  </div>
);

// Custom hooks
function useCameraState() {
  const searchParams = useSearchParams();
  const fromGallery = searchParams.get("fromGallery") === "true";
  const skipCamera = searchParams.get("skipCamera") === "true";

  const getInitialState = (): AppState => {
    if (fromGallery && skipCamera) {
      return "LOADING_UI";
    }
    return "CAMERA";
  };

  const [appState, setAppState] = useState<AppState>(getInitialState());
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const handleCameraSwitch = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return {
    appState,
    setAppState,
    capturedImage,
    setCapturedImage,
    facingMode,
    handleCameraSwitch,
    fromGallery,
    skipCamera,
  };
}

function useLoadingState(
  appState: AppState,
  setAppState: (state: AppState) => void
) {
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (appState === "LOADING_UI") {
      setLoadingStep(0);
      setProgress(0);

      const stepCount = LOADING_STEPS.length;
      const stepDuration = Math.floor(TOTAL_LOADING_DURATION / stepCount);

      const stepTimer = setInterval(() => {
        setLoadingStep((prev) => (prev < stepCount - 1 ? prev + 1 : prev));
      }, stepDuration);

      const progressTimer = setInterval(() => {
        setProgress((prev) => (prev >= 99 ? 99 : prev + 1));
      }, Math.max(20, TOTAL_LOADING_DURATION / 100));

      const finishTimer = setTimeout(() => {
        setProgress(100);
        setAppState("COMPLETION_MODAL");
      }, TOTAL_LOADING_DURATION);

      return () => {
        clearInterval(stepTimer);
        clearInterval(progressTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [appState, setAppState]);

  return { progress, loadingStep };
}

function HalamanKameraWajahContent() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // State management
  const {
    appState,
    setAppState,
    capturedImage,
    setCapturedImage,
    facingMode,
    handleCameraSwitch,
    fromGallery,
    skipCamera,
  } = useCameraState();

  const { progress, loadingStep } = useLoadingState(appState, setAppState);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);

  // Effects
  useEffect(() => {
    if (appState === "LOADING_UI") {
      // Set captured image from either camera or gallery
      const uploadedImage = localStorage.getItem("uploadedFaceImage");
      const capturedImageData = localStorage.getItem("capturedImage");

      if (uploadedImage) {
        setCapturedImage(uploadedImage);
      } else if (capturedImageData) {
        setCapturedImage(capturedImageData);
      }
    }
  }, [appState]);

  // Camera management effect
  useEffect(() => {
    if (appState !== "CAMERA" && appState !== "CONFIRM") return;

    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());
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
        setErrorModalMessage(
          "Kamera tidak dapat diakses. Mohon izinkan akses kamera di browser Anda."
        );
        setIsErrorModalOpen(true);
      }
    };

    if (!fromGallery || !skipCamera) {
      startCamera();
    }

    return () => {
      if (currentStream)
        currentStream.getTracks().forEach((track) => track.stop());
    };
  }, [fromGallery, skipCamera, appState, facingMode]);

  // Event handlers
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
    setAppState("CAMERA");
    setErrorModalMessage("");
    setIsErrorModalOpen(false);
  };

  const handleAnalyze = () => {
    if (capturedImage) {
      localStorage.setItem("capturedImage", capturedImage);
    }
    setAppState("LOADING_UI");
  };

  if (appState === "LOADING_UI") {
    const currentStepData =
      LOADING_STEPS[loadingStep] || LOADING_STEPS[LOADING_STEPS.length - 1];

    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen bg-[#FFC6C6] text-gray-800 p-4 transition-colors duration-500">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <RiveLoadingAnimation />

          {/* Current Step Description */}
          <div className="text-center max-w-2xl">
            <p className="text-[#323232] text-sm sm:text-base font-poppins leading-relaxed">
              {currentStepData.desc}
            </p>
          </div>

          {/* Loading Steps Cards */}
          <div className="mt-8 flex flex-col gap-3 w-full max-w-lg">
            {(() => {
              const totalSteps = LOADING_STEPS.length;
              const startIndex = Math.max(0, loadingStep - (CARDS_TO_SHOW - 1));
              const endIndex = Math.min(totalSteps, startIndex + CARDS_TO_SHOW);
              const visibleSteps = LOADING_STEPS.slice(startIndex, endIndex);

              return visibleSteps.map((step, index) => {
                const actualIndex = startIndex + index;
                const isCompleted = actualIndex < loadingStep;
                const isActive = actualIndex === loadingStep;
                const isPending = actualIndex > loadingStep;

                return (
                  <LoadingStepCard
                    key={`step-${actualIndex}`}
                    step={step}
                    actualIndex={actualIndex}
                    isCompleted={isCompleted}
                    isActive={isActive}
                    isPending={isPending}
                  />
                );
              });
            })()}
          </div>
        </div>
      </main>
    );
  }

  if (appState === "COMPLETION_MODAL") {
    return (
      <main className="relative h-screen w-screen overflow-hidden bg-[#FFC6C6]">
        <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#323232] rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-xl text-left flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#f0f0f0] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-7 h-7 text-[#323232]" />
              </div>
              <h1 className="text-2xl sm:text-3xl text-[#f0f0f0] font-oswald font-bold">
                Analisa Selesai!
              </h1>
            </div>

            <p className="text-gray-300 text-base font-poppins leading-relaxed">
              Klik Tombol{" "}
              <span className="font-bold text-[#E97099]">
                &ldquo;Lihat Hasil&rdquo;
              </span>{" "}
              Untuk Membuka Laporan Personal Yang Telah Kami Siapkan Khusus
              Untukmu.
            </p>

            <Button
              onClick={() => {
                router.push("/ai-overview");
              }}
              className="bg-[#E97099] w-full text-[#f0f0f0] font-bold py-7 px-6 rounded-xl hover:bg-[#d8668c] transition-colors text-lg flex items-center justify-center gap-3"
            >
              <File />
              Lihat Hasil
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (appState === "API_ERROR") {
    return (
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleRetake}
        errorMessage={errorModalMessage}
      />
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#323232]">
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
          <div className="relative z-20 text-center flex items-center gap-3 text-[#323232] bg-[#FFC6C6] mt-18 py-4 px-6 rounded-2xl">
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
              className="w-16 h-16 -ml-12 bg-[#f0f0f0]/30 mr-2 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#f0f0f0]/50 focus:outline-none focus:ring-2 focus:ring-[#f0f0f0]"
              aria-label="Ganti Kamera"
            >
              <RotateCw className="text-[#f0f0f0] size-8" />
            </Button>

            {/* Tombol Ambil Gambar */}
            <Button
              onClick={handleCapture}
              className="w-20 h-20 -ml-12 bg-[#f0f0f0] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400"
            >
              <Camera className="text-[#f0f0f0] size-12 fill-[#323232]" />
            </Button>
          </div>
        </div>
      )}

      {appState === "CONFIRM" && capturedImage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#323232]/50 backdrop-blur-lg">
          <div className="bg-[#f0f0f0] rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4">
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
                className="w-full py-3 px-4 bg-[#FFC6C6] text-[#323232] font-bold rounded-xl hover:bg-pink-300 flex items-center justify-center gap-2"
                disabled={isApiLoading}
              >
                {isApiLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <span className="font-poppins">Mulai Analisa</span>{" "}
                    <AnalysisIcon className="stroke-[#323232]" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage={errorModalMessage}
      />
    </main>
  );
}

export default function HalamanKameraWajah() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-[#323232] text-[#f0f0f0]">
          <div className="animate-pulse rounded-full h-16 w-16 bg-gray-700"></div>
        </div>
      }
    >
      <HalamanKameraWajahContent />
    </Suspense>
  );
}
