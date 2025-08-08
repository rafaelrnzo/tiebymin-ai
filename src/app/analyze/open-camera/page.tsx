'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import flower from '/flower.png';

// --- Helper Components (SVG Icons) - Tidak ada perubahan di sini ---
const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /> <circle cx="12" cy="13" r="3" /> </svg> );
const AnalysisIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.52-.17-1.04.22-1 .75c.03.35.25.65.57.8c2.32.93 3.97 3.19 3.97 5.95a6 6 0 1 1-7.23-5.45c.4-.19.68-.59.59-1.03c-.1-0.44-.52-.75-.97-.63C5.66 3.6 2 7.4 2 12a10 10 0 0 0 10 10z"/> <path d="m15.58 12.5-1.08-2.5-2.5-1.08 1.08-2.5 2.5-1.08 1.08 2.5 2.5 1.08-1.08 2.5-2.5 1.08z"/> <path d="m6.5 12.5-1-2-2-1 1-2 2-1 1 2 2 1-1 2-2 1z"/> </svg> );
const LoadingSpinnerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <image
      href="@flower.png"
      x="2"
      y="2"
      width="20"
      height="20"
    />
  </svg>
);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}> <polyline points="20 6 9 17 4 12"></polyline> </svg> );


type AppState = 'CAMERA' | 'CONFIRM' | 'ANALYZING' | 'RESULTS';

export default function HalamanKameraWajah() {
  const router = useRouter(); // <-- 2. Inisialisasi router
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [appState, setAppState] = useState<AppState>('CAMERA');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  
  // <-- 3. State baru untuk animasi hasil
  const [completedAnalyses, setCompletedAnalyses] = useState(0);
  const totalAnalyses = 4; // Jumlah item hasil analisa

  // Effect untuk mengontrol kamera
  useEffect(() => {
    if (appState !== 'CAMERA' && appState !== 'CONFIRM') return;
    let currentStream: MediaStream | null = null;
    const startCamera = async () => { /* ... logika kamera sama ... */ try { const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } }); currentStream = mediaStream; if (videoRef.current) { videoRef.current.srcObject = mediaStream; } } catch (err) { setError('Kamera tidak dapat diakses.'); } };
    startCamera();
    return () => { if (currentStream) currentStream.getTracks().forEach((track) => track.stop()); };
  }, [appState]);

  // Effect untuk simulasi loading
  useEffect(() => {
    if (appState === 'ANALYZING') {
      const timer = setInterval(() => setProgress(prev => { if (prev >= 100) { clearInterval(timer); setAppState('RESULTS'); return 100; } return prev + 1; }), 40);
      return () => clearInterval(timer);
    }
  }, [appState]);

  // <-- 4. Effect baru untuk animasi hasil dan redirect
  useEffect(() => {
    if (appState === 'RESULTS') {
      // Animasikan item satu per satu
      const animationTimer = setInterval(() => {
        setCompletedAnalyses(prev => {
          if (prev >= totalAnalyses) {
            clearInterval(animationTimer);
            return prev;
          }
          return prev + 1;
        });
      }, 700); // Jeda 700ms antar item

      return () => clearInterval(animationTimer);
    }
  }, [appState]);
  
  // <-- 5. Effect baru KHUSUS untuk redirect setelah animasi selesai
  useEffect(() => {
      if (completedAnalyses >= totalAnalyses) {
          // Setelah semua animasi selesai, tunggu 1 detik lalu redirect
          const redirectTimer = setTimeout(() => {
              router.push('/ai-overview');
          }, 1000);

          return () => clearTimeout(redirectTimer);
      }
  }, [completedAnalyses, router, totalAnalyses]);


  const handleCapture = () => { /* ... logika sama ... */ if (videoRef.current && canvasRef.current) { const video = videoRef.current; const canvas = canvasRef.current; canvas.width = video.videoWidth; canvas.height = video.videoHeight; const context = canvas.getContext('2d'); if (!context) return; context.translate(canvas.width, 0); context.scale(-1, 1); context.drawImage(video, 0, 0, canvas.width, canvas.height); const imageDataUrl = canvas.toDataURL('image/png'); setCapturedImage(imageDataUrl); setAppState('CONFIRM'); } };
  
  const handleRetake = () => {
    setCapturedImage(null);
    setProgress(0);
    setCompletedAnalyses(0); // <-- 6. Reset state animasi
    setAppState('CAMERA');
  };

  const handleAnalyze = () => {
    setAppState('ANALYZING');
  };

  // --- Render Berdasarkan State ---

  if (appState === 'ANALYZING' || appState === 'RESULTS') {
    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen bg-pink-100 text-gray-800 p-4 transition-colors duration-500">
        <div className="text-center">
            {appState === 'ANALYZING' ? (
                <LoadingSpinnerIcon className="mx-auto animate-spin text-gray-700" />
            ) : (
                <LoadingSpinnerIcon className="mx-auto text-gray-700" />
            )}
            
            <p className="text-2xl font-bold mt-4">
                {appState === 'ANALYZING' ? `${progress}%` : '99%'}
            </p>
            <p className="text-gray-600 mt-1">AI lagi lihat kecantikan kamu...</p>
        </div>
        
        {/* <-- 7. Tampilan Hasil yang sudah dianimasikan --> */}
        {appState === 'RESULTS' && (
            <div className="mt-12 w-full max-w-sm flex flex-col gap-3">
                {Array.from({ length: totalAnalyses }).map((_, index) => {
                    const isCompleted = index < completedAnalyses;
                    return (
                        <button
                            key={index}
                            className={`w-full p-3 font-semibold rounded-xl flex items-center justify-between transition-all duration-500
                                ${isCompleted
                                    ? "bg-gray-800 text-white"
                                    : "bg-white text-gray-500 border border-gray-200"
                                }
                            `}
                        >
                            <span>Analisa bentuk wajahmu</span>
                            {isCompleted ? (
                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                    <CheckIcon className="text-gray-800" />
                                </div>
                            ) : (
                                <AnalysisIcon className="stroke-gray-400"/>
                            )}
                        </button>
                    )
                })}
            </div>
        )}
      </main>
    )
  }

  // --- Tampilan Kamera & Konfirmasi (Tidak ada perubahan) ---
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover transform scale-x-[-1]" />
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {appState === 'CAMERA' && ( <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-6"> <div className="text-center text-white"> <h1 className="text-2xl font-bold [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">Verifikasi Wajah</h1> <p className="[text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">Posisikan wajah Anda di dalam bingkai</p> </div> <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-sm aspect-square border-4 sm:border-[6px] border-dashed border-green-400 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div> <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400"> <div className="w-[72px] h-[72px] bg-white rounded-full border-2 border-black flex items-center justify-center"> <CameraIcon className="text-black w-9 h-9" /> </div> </button> </div> )}

      {appState === 'CONFIRM' && capturedImage && ( <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-lg"> <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4"> <h2 className="text-2xl font-bold text-gray-800">Gunakan Gambar Ini</h2> <p className="text-gray-500 text-sm mt-1 mb-6">Kamu bisa ambil gambar beberapa kali</p> <img src={capturedImage} alt="Hasil Foto" className="rounded-lg w-full h-auto object-cover mb-6" /> <div className="w-full flex flex-col gap-3"> <button onClick={handleRetake} className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100">Ambil gambar ulang</button> <button onClick={handleAnalyze} className="w-full py-3 px-4 bg-pink-200 text-pink-800 font-bold rounded-xl hover:bg-pink-300 flex items-center justify-center gap-2"> Mulai Analisa <AnalysisIcon className="stroke-pink-800"/> </button> </div> </div> </div> )}

      {error && ( <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4"> <p className="text-center text-red-400">{error}</p> </div> )}
    </main>
  );
}