"use client";

import React from "react";

// Komponen baru untuk input angka dengan tombol kontrol
interface NumberInputWithControlsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string; // Satuan seperti 'cm' atau 'kg' (opsional)
  id: string;
}

function NumberInputWithControls({
  label,
  value,
  onChange,
  unit,
  id,
}: NumberInputWithControlsProps) {
  const handleIncrement = () => {
    const currentValue = parseInt(value, 10) || 0;
    onChange((currentValue + 1).toString());
  };

  const handleDecrement = () => {
    const currentValue = parseInt(value, 10) || 0;
    // Mencegah nilai negatif jika tidak diinginkan
    if (currentValue > 0) {
      onChange((currentValue - 1).toString());
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={id} className="text-gray-700 font-medium whitespace-nowrap">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-md">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          // Menghilangkan panah default dari input number
          className="w-16 text-center border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && <span className="text-gray-500 pr-2">{unit}</span>}
        <div className="flex flex-col items-center justify-center h-full border-l border-gray-300 p-1">
          <button onClick={handleIncrement} className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-sm">
            {/* SVG untuk panah atas */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <button onClick={handleDecrement} className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-sm">
            {/* SVG untuk panah bawah */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}


// Komponen Form Utama yang telah diperbarui
interface BodyMeasurementsFormProps {
  formData: {
    tinggi: string;
    berat: string;
    umur: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export default function BodyMeasurementsForm({
  formData,
  onFormDataChange,
  onSubmit,
}: BodyMeasurementsFormProps) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Lengkapi Data Diri</h1>
        <p className="text-gray-500 mt-2 mb-8">
            Semakin lengkap data kamu akan membuat hasil analisa kami jauh lebih tepat, jangan lupa diisi ya....
        </p>
      
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-around space-y-6 md:space-y-0 md:space-x-4 mb-8">
        <NumberInputWithControls
          label="Tinggi Badan"
          id="tinggi-input"
          value={formData.tinggi}
          onChange={(value) => onFormDataChange("tinggi", value)}
          unit="cm"
        />
        <NumberInputWithControls
          label="Berat Badan"
          id="berat-input"
          value={formData.berat}
          onChange={(value) => onFormDataChange("berat", value)}
          unit="kg"
        />
        <NumberInputWithControls
          label="Umur"
          id="umur-input"
          value={formData.umur}
          onChange={(value) => onFormDataChange("umur", value)}
        />
      </div>

      {/* Tombol Submit */}
      <button
        onClick={onSubmit}
        className="w-full h-14 bg-gray-800 hover:bg-gray-700 text-[#ffc6c6] font-bold text-lg rounded-xl transition-colors"
      >
        Selanjutnya
      </button>
    </div>
  );
}
