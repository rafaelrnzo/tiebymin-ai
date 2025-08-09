"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

// --- Komponen Utama ---
interface CelebrityMatchSectionProps {
  celebrityId: string | null;
}

const CelebrityMatchSection: React.FC<CelebrityMatchSectionProps> = ({ celebrityId }) => {
    const [matchData, setMatchData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [matchPercentage] = useState(() => Math.floor(Math.random() * (95 - 80 + 1)) + 80);

    useEffect(() => {
        if (!celebrityId) {
            setIsLoading(false);
            return; // Berhenti jika tidak ada ID, akan menampilkan pesan "Belum Ada Kecocokan"
        }
        const fetchCelebrityMatch = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Endpoint untuk mengambil detail selebriti berdasarkan ID
                const response = await axios.get(`https://b70ab926860b.ngrok-free.app/v1/celebrities/${celebrityId}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                setMatchData(response.data);
            } catch (err) {
                setError("Gagal memuat data kecocokan selebriti.");
                console.error("Fetch error in CelebrityMatchSection:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCelebrityMatch();
    }, [celebrityId]);

    if (isLoading) return <div className="text-center p-8">Finding your celebrity match...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    // Tampilan jika tidak ada kecocokan (celebrityId null atau fetch gagal)
    if (!matchData) {
        return (
            <div className="text-center p-8 border border-dashed rounded-2xl">
                <h3 className="font-bold text-lg text-gray-800">Belum Ada Kecocokan</h3>
                <p className="text-gray-600 mt-2 text-sm">Saat ini kami belum menemukan selebriti yang cocok denganmu. Nantikan update dari kami!</p>
            </div>
        );
    }

    // Tampilan jika ada kecocokan
    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-6 w-full md:w-2/5">
                <div className="border-[1px] border-neutral-600 rounded-2xl p-6">
                    <p className="font-handlee text-[#ED80A7] text-lg mb-1">Artis yang mirip kamu</p>
                    <h3 className="text-3xl font-bold text-gray-800 font-oswald">{matchData.name}</h3>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">{matchData.similarity_text}</p>
                </div>
                <div className="bg-[#FCE9EC] rounded-2xl p-6">
                    <h4 className="font-bold font-handlee text-gray-800 text-md mb-2">Tentang Artis Ini</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{matchData.description}</p>
                </div>
            </div>
            <div className="relative w-full md:w-3/5 min-h-[400px]">
                <Image src={matchData.picture_url || "/default-celebrity.png"} alt={matchData.name} fill style={{ objectFit: "cover" }} className="rounded-2xl" />
                <span className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Image src="/overview-ai/icons/ai-generate.svg" width={16} height={16} alt="Match Icon" />
                    {matchPercentage}% Match
                </span>
            </div>
        </div>
    );
};

export default CelebrityMatchSection;