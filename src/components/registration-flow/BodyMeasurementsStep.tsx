"use client";

import React from "react";
import BodyMeasurementsForm from "@/components/component-login/body-measurements-form";

interface BodyMeasurementsStepProps {
  formData: {
    tinggi: string;
    berat: string;
    umur: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onNext: () => void;
}

export default function BodyMeasurementsStep({
  formData,
  onFormDataChange,
  onNext,
}: BodyMeasurementsStepProps) {
  return (
    <div className="w-full lg:flex-1 lg:max-w-[60%] lg:mr-[50px]">
      <BodyMeasurementsForm
        formData={formData}
        onFormDataChange={onFormDataChange}
        onSubmit={onNext}
      />
    </div>
  );
}
