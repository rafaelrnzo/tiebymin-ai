"use client";

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAnalysis } from '@/context/AnalysisContext';

// --- Komponen Utama ---
export default function PrepareFacePage() {
    // State dari Context untuk menyimpan dan mengubah pilihan pengguna
    const { analysisData, setAnalysisData } = useAnalysis();
    
    const [allBodyTypes, setAllBodyTypes] = useState<any[]>([]); // Menyimpan semua data bentuk tubuh dari API
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(false); // Untuk modal "Scan Wajah"
    
    const router = useRouter();

    // useEffect untuk mengambil semua data bentuk tubuh dari API saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchAllBodyShapes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://b70ab926860b.ngrok-free.app/v1/body-shapes/`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });

                if (response.data && response.data.length > 0) {
                    setAllBodyTypes(response.data);
                    
                    // Jika belum ada pilihan bentuk tubuh di context, set pilihan default
                    // Pilihan default diambil dari item pertama yang diterima dari API
                    if (!analysisData.body_shape_id) {
                      setAnalysisData(prev => ({ ...prev, body_shape_id: response.data[0].id }));
                    }
                } else {
                    setError("Tidak ada data bentuk tubuh yang ditemukan.");
                }

            } catch (err) {
                setError("Gagal memuat data bentuk tubuh. Silakan coba lagi nanti.");
                console.error("Fetch error in PrepareFacePage:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllBodyShapes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Dependency array kosong agar hanya berjalan sekali saat mount

    // Fungsi untuk mengubah pilihan bentuk tubuh di context
    const handleSelectBodyType = (typeId: string) => {
        setAnalysisData(prev => ({ ...prev, bodyType: typeId }));
    };

    // Navigasi ke halaman selanjutnya
    const handleNext = () => {
        router.push(`/analyze/take-face`);
    };

    const handleShowOverlay = () => setShowOverlay(true);
    const handleCloseOverlay = () => setShowOverlay(false);
    
    // --- Variabel turunan untuk mempermudah rendering ---
    const selectedTypeId = analysisData.bodyType;
    const selectedType = allBodyTypes.find((type) => type.id === selectedTypeId);

    // Membagi data secara dinamis untuk tampilan dua baris
    const topRow = allBodyTypes.slice(0, Math.ceil(allBodyTypes.length / 2));
    const bottomRow = allBodyTypes.slice(Math.ceil(allBodyTypes.length / 2));

    const bodyImageWidth = 100;
    const bodyImageHeight = 220;
    const bodyImageClass = "w-[100px] h-[220px] object-contain";

    // --- Tampilan Loading dan Error ---
    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-pink-100"><p>Loading body shapes...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-pink-100 text-red-500"><p>{error}</p></div>;

    // --- Tampilan Utama ---
    return (
        <div className="min-h-screen w-full px-2 sm:px-4 md:px-4 lg:px-12 py-8 md:py-16 lg:py-24 flex flex-col items-center justify-center relative bg-[url('/login-bg.png')] bg-cover bg-center">
            
            {/* Overlay Scan Wajah (Modal) */}
            {showOverlay && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseOverlay} />
                    <div className="relative bg-white/90 rounded-2xl shadow-xl p-8 max-w-md w-full">
                        <div className="flex justify-end">
                            <button onClick={handleCloseOverlay} className="text-gray-500 hover:text-gray-700 text-2xl font-bold -mt-4 -mr-2" aria-label="Tutup">×</button>
                        </div>
                        <div className="flex flex-col items-center">
                            <Image src="/scan-face-illustration.png" alt="Scan Wajah" width={120} height={120} className="mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan Wajah Kamu</h2>
                            <p className="text-gray-600 text-center mb-4">Fitur scan wajah akan segera tersedia! <br /> Nantikan update dari kami.</p>
                            <button onClick={handleCloseOverlay} className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl px-6 py-2 transition-colors">Tutup</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center justify-center">
                    
                    {/* Kolom Kiri - Kontrol */}
                    <div className="space-y-8 w-full max-w-md mx-auto flex flex-col items-center">
                        <div className="mb-8 flex justify-center w-full">
                            <Image src="/tie-by-min-logo.png" alt="Tiebymin Logo" width={250} height={80} priority className="mx-auto" />
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center justify-between w-full max-w-xs mx-auto">
                            <span className="text-gray-700 font-medium">Analisa</span>
                            <span className="text-gray-700 font-bold">03</span>
                        </div>
                        <div className="bg-[#EF789B] rounded-2xl p-6 text-white w-full max-w-xs mx-auto">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-bold">Pilih Bentuk Tubuh Kamu</h2>
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                    <Image src="/stars.png" alt="stars" width={20} height={20} />
                                </div>
                            </div>
                            <p className="text-white/90 text-sm leading-relaxed">Dengan mengetahui bentuk tubuhmu, kami bisa memberikan rekomendasi pakaian yang sesuai.</p>
                        </div>
                        <button className="w-full border-gray-600/60 border backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center justify-between hover:bg-white/80 transition-colors max-w-xs mx-auto" onClick={handleShowOverlay}>
                            <span className="text-gray-700 font-medium">Scan Wajah Kamu</span>
                            <div className="w-6 h-6 rounded flex items-center justify-center">
                                <Image src="/stars.png" alt="stars" width={20} height={20} style={{ filter: "brightness(0) saturate(100%)" }} />
                            </div>
                        </button>
                    </div>

                    {/* Kolom Tengah - Pilihan Bentuk Tubuh (Dinamis dari API) */}
                    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0">
                        <div className="flex flex-col gap-8 md:gap-12 w-full">
                            <div className="flex flex-row gap-4 md:gap-8 lg:gap-12 justify-center w-full">
                                {topRow.map((type) => (
                                    <button key={type.id} type="button" onClick={() => handleSelectBodyType(type.id)} className="focus:outline-none">
                                        <div className="flex flex-col items-center">
                                            <div className={`mb-4 flex justify-center items-center transition-all ${selectedTypeId === type.id ? "rounded-2xl p-4 bg-white/80 backdrop-blur-sm" : ""}`}>
                                                <Image src={type.link_picture} alt={`${type.name} body type`} width={bodyImageWidth} height={bodyImageHeight} className={bodyImageClass} />
                                            </div>
                                            <p className={`${selectedTypeId === type.id ? "text-gray-800 font-bold" : "text-gray-500"} text-sm text-center`}>{type.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-row gap-4 md:gap-8 lg:gap-12 justify-center w-full">
                                {bottomRow.map((type) => (
                                    <button key={type.id} type="button" onClick={() => handleSelectBodyType(type.id)} className="focus:outline-none">
                                        <div className="flex flex-col items-center">
                                            <div className={`mb-4 flex justify-center items-center transition-all ${selectedTypeId === type.id ? "rounded-2xl p-4 bg-white/80 backdrop-blur-sm" : ""}`}>
                                                <Image src={type.link_picture} alt={`${type.name} body type`} width={bodyImageWidth} height={bodyImageHeight} className={bodyImageClass} />
                                            </div>
                                            <p className={`${selectedTypeId === type.id ? "text-gray-800 font-bold" : "text-gray-500"} text-sm text-center`}>{type.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan - Detail Pilihan (Dinamis dari API) */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl py-8 px-4 sm:px-6 w-full max-w-xs md:max-w-sm mx-auto flex flex-col justify-between items-center">
                        {selectedType ? (
                            <>
                                <div className="w-full">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 font-oswald text-left">{selectedType.name}</h2>
                                    <div className="flex justify-center mb-8">
                                        <Image src={selectedType.link_picture} alt={`${selectedType.name} body type`} width={60} height={90} className="w-auto h-24 object-contain" />
                                    </div>
                                    <p className="text-gray-600 text-sm mb-8 leading-relaxed text-left">{selectedType.penjelasan_body_shape}</p>
                                    <div className="mb-8">
                                        <h3 className="font-bold text-gray-800 mb-3 text-left">Karakteristik</h3>
                                        <ul className="space-y-2 text-sm text-gray-600 text-left">
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                {selectedType.karakteristik}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <button className="w-full bg-[#323232] text-center text-white rounded-xl py-3 px-6 font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-4 mt-4" onClick={handleNext}>
                                    <span>Selanjutnya</span>
                                    <span>→</span>
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-gray-500">Pilih bentuk tubuh untuk melihat detail.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}