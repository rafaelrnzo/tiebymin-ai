"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LeftSideSection from "@/components/component-login/left-side-section";
import BodyMeasurementsForm from "@/components/component-login/body-measurements-form";
import { useStepsProgress } from "@/hooks/useStepsProgress";
import { useAnalysis } from "@/context/AnalysisContext";
import { useEffect } from "react";

export default function Step2Page() {
  const router = useRouter();
  const { steps } = useStepsProgress(2);
  const { analysisData, setAnalysisData } = useAnalysis();

  useEffect(() => {
    console.log("analysisData in Step2Page updated:", analysisData);
  }, [analysisData]);

  const handleFormDataChange = (field: string, value: string) => {
    console.log(
      `handleFormDataChange in Step2Page called: ${field} = ${value}`
    );
    setAnalysisData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    try {
      console.log("Saving data to localStorage:", analysisData);
      localStorage.setItem(
        "tiebymin-analysis-data",
        JSON.stringify(analysisData)
      );
      console.log("Data saved, navigating to /analyze/prepare-face");
      router.push("/analyze/prepare-face");
    } catch (error) {
      console.error("Failed to save analysis data to localStorage", error);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center">
      <div className="mx-auto container w-full flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-16">
        <div className="w-full max-w-[85rem] lg:flex-1">
          <LeftSideSection
            steps={steps}
            currentStepNumber={2}
            showExtendedSteps={false}
          />
        </div>
        <div className="w-full lg:flex-1 lg:mr-[50px] mr-0">
          <BodyMeasurementsForm
            formData={analysisData}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
