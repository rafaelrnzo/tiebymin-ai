"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
    if (currentValue > 0) {
      onChange((currentValue - 1).toString());
    }
  };

  return (
    <div className="flex flex-row w-full items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition">
      {/* Label on the far left */}
      <label
        htmlFor={id}
        className="text-gray-700 text-start font-medium text-xs sm:text-sm md:text-base flex-shrink-0"
      >
        {label}
      </label>

      {/* Input with unit in the center */}
      <div className="flex-1 flex justify-center items-center gap-x-1">
        <Input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 text-center border border-gray-300 rounded-md h-10 focus:ring-2 focus:ring-gray-800 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && (
          <span className="text-gray-300 font-medium text-sm">{unit}</span>
        )}
      </div>

      {/* Buttons on the far right */}
      <div className="flex items-center gap-x-2 flex-shrink-0">
        {/* Mobile: Plus/Minus buttons (horizontal) */}
        <div className="flex flex-row items-center justify-center gap-1 sm:hidden">
          <Button
            onClick={handleIncrement}
            className="w-6 h-6 flex items-center justify-center text-gray-600 rounded-sm hover:bg-gray-100 p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Button>
          <Button
            onClick={handleDecrement}
            className="w-6 h-6 flex items-center justify-center text-gray-600 rounded-sm hover:bg-gray-100 p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
            </svg>
          </Button>
        </div>

        {/* Desktop: Up/Down buttons (vertical) */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-1">
          <Button
            onClick={handleIncrement}
            className="w-5 h-4 flex items-center justify-center text-gray-600 rounded-sm hover:bg-gray-100 p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </Button>
          <Button
            onClick={handleDecrement}
            className="w-5 h-4 flex items-center justify-center text-gray-600 rounded-sm hover:bg-gray-100 p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Komponen Form Utama yang telah diperbarui untuk hanya berisi form
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
    <>
      <div className="flex flex-col lg:flex-row items-stretch md:items-center gap-y-4 md:gap-x-4 mb-8 w-full">
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
        <div className="flex flex-col">
          <NumberInputWithControls
            label="Umur"
            id="umur-input"
            value={formData.umur}
            onChange={(value) => onFormDataChange("umur", value)}
          />
        </div>
      </div>

      {/* Tombol Submit */}
      <Button
        onClick={onSubmit}
        className="w-full h-14 bg-[#323232] hover:bg-gray-700 text-[#ffc6c6] font-bold text-lg rounded-xl transition-colors"
      >
        Selanjutnya
      </Button>
    </>
  );
}
