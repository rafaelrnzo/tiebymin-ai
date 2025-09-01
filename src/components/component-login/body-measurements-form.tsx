"use client";

import { ChevronDown, ChevronUp, MinusCircle, PlusCircle } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

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
  React.useEffect(() => {
    console.log("BodyMeasurementsForm formData updated:", formData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Input changed: ${field} = ${value}`);
    onFormDataChange(field, value);
  };

  return (
    <div className="bg-[#f0f0f0] lg:min-h-full min-h-[73vh] backdrop-blur-sm shadow-xl rounded-t-2xl lg:rounded-2xl border-0 py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-8 lg:px-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#323232] mb-6 font-oswald text-left">
        Lengkapi Data Diri
      </h2>
      <p className="mb-4 font-poppins">
        Semakin lengkap data kamu akan membuat hasil analisa kami jauh lebih
        tepat, jangan lupa di isi ya....
      </p>
      <hr className="bg-[#323232] lg:hidden block my-4" />
      <div className="mb-32 lg:mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:justify-between items-center gap-x-2 gap-y-4 mb-8 w-full">
          {/* new compo tinggi badan */}
          <div className="grid grid-cols-7 items-center">
            <p className="col-span-3">Tinggi Badan</p>
            <Input
              className="col-span-1 lg:col-span-2"
              type="number"
              value={formData.tinggi}
              onChange={(e) => handleInputChange("tinggi", e.target.value)}
              placeholder="0"
            />
            <p className="col-span-1 text-center">cm</p>
            <div className="flex col-span-2 lg:hidden justify-end gap-2">
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.tinggi, 10) || 0;
                  handleInputChange("tinggi", (currentValue + 1).toString());
                }}
                className="text-[#323232] hover:text-gray-600"
              >
                <PlusCircle size={20} />
              </button>
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.tinggi, 10) || 0;
                  if (currentValue > 0) {
                    handleInputChange("tinggi", (currentValue - 1).toString());
                  }
                }}
                className="text-[#323232] hover:text-gray-600"
              >
                <MinusCircle size={20} />
              </button>
            </div>
            <div className="lg:flex hidden flex-col col-span-1 items-center gap-1">
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.tinggi, 10) || 0;
                  handleInputChange("tinggi", (currentValue + 1).toString());
                }}
                className="text-[#323232] hover:text-gray-600 p-1"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.tinggi, 10) || 0;
                  if (currentValue > 0) {
                    handleInputChange("tinggi", (currentValue - 1).toString());
                  }
                }}
                className="text-[#323232] hover:text-gray-600 p-1"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
          {/* new compo berat badan */}
          <div className="grid grid-cols-7 items-center">
            <p className="col-span-3">Berat Badan</p>
            <Input
              className="col-span-1 lg:col-span-2"
              type="number"
              value={formData.berat}
              onChange={(e) => handleInputChange("berat", e.target.value)}
              placeholder="0"
            />
            <p className="col-span-1 text-center">kg</p>
            <div className="flex col-span-2 lg:hidden justify-end gap-2">
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.berat, 10) || 0;
                  handleInputChange("berat", (currentValue + 1).toString());
                }}
                className="text-[#323232] hover:text-gray-600"
              >
                <PlusCircle size={20} />
              </button>
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.berat, 10) || 0;
                  if (currentValue > 0) {
                    handleInputChange("berat", (currentValue - 1).toString());
                  }
                }}
                className="text-[#323232] hover:text-gray-600"
              >
                <MinusCircle size={20} />
              </button>
            </div>
            <div className="lg:flex hidden flex-col col-span-1 items-center gap-1">
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.berat, 10) || 0;
                  handleInputChange("berat", (currentValue + 1).toString());
                }}
                className="text-[#323232] hover:text-gray-600 p-1"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.berat, 10) || 0;
                  if (currentValue > 0) {
                    handleInputChange("berat", (currentValue - 1).toString());
                  }
                }}
                className="text-[#323232] hover:text-gray-600 p-1"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
          {/* new compo umur */}
          <div className="grid grid-cols-7 items-center justify-between">
            <p className="col-span-3">Umur</p>
            <Input
              className="col-span-1 lg:col-span-2"
              type="number"
              value={formData.umur}
              onChange={(e) => handleInputChange("umur", e.target.value)}
              placeholder="0"
            />
            <p className="col-span-1"></p>
            <div className="flex col-span-2 lg:hidden justify-end gap-2">
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.umur, 10) || 0;
                  handleInputChange("umur", (currentValue + 1).toString());
                }}
                className="text-[#323232] hover:text-gray-600"
              >
                <PlusCircle size={20} />
              </button>
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.umur, 10) || 0;
                  if (currentValue > 0) {
                    handleInputChange("umur", (currentValue - 1).toString());
                  }
                }}
                className="text-[#323232] hover:text-gray-600"
              >
                <MinusCircle size={20} />
              </button>
            </div>
            <div className="lg:flex hidden flex-col col-span-1 items-center gap-1">
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.umur, 10) || 0;
                  handleInputChange("umur", (currentValue + 1).toString());
                }}
                className="text-[#323232] hover:text-gray-600 p-1"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => {
                  const currentValue = parseInt(formData.umur, 10) || 0;
                  if (currentValue > 0) {
                    handleInputChange("umur", (currentValue - 1).toString());
                  }
                }}
                className="text-[#323232] hover:text-gray-600 p-1"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onSubmit}
          className="w-full h-14 bg-[#323232] hover:bg-gray-700 text-[#ffc6c6] font-bold text-lg rounded-xl transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
