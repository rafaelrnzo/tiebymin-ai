"use client";

import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

// Tipe data tidak berubah
interface AnalysisData {
  tinggi: string;
  berat: string;
  umur: string;
  bodyType: string;
}

// Tipe context tidak berubah
interface AnalysisContextType {
  analysisData: AnalysisData;
  setAnalysisData: Dispatch<SetStateAction<AnalysisData>>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Nama key untuk localStorage
const LOCAL_STORAGE_KEY = 'tiebymin-analysis-data';

export function AnalysisProvider({ children }: { children: ReactNode }) {
  // Inisialisasi state dari localStorage hanya di client
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    tinggi: '',
    berat: '',
    umur: '',
    bodyType: 'pear',
  });

  // Ambil data dari localStorage saat komponen mount (hanya di client)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item) {
          setAnalysisData(JSON.parse(item));
        }
      } catch (error) {
        console.error("Failed to parse analysis data from localStorage", error);
      }
    }
  }, []); // hanya dijalankan sekali saat mount

  // Simpan ke localStorage setiap analysisData berubah
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(analysisData));
      } catch (error) {
        console.error("Failed to save analysis data to localStorage", error);
      }
    }
  }, [analysisData]);

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  );
}

// Custom hook tidak berubah
export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}