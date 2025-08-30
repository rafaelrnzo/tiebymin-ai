"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeftSideSection from "@/components/component-login/left-side-section";
import BodyMeasurementsStep from "./BodyMeasurementsStep";
import BodyShapeStep from "./BodyShapeStep";
import FaceScanStep from "./FaceScanStep";
import { useAnalysis } from "@/context/AnalysisContext";
import { useRegistrationFlow } from "@/hooks/useLocalStorage";
import { useStepsProgress } from "@/hooks/useStepsProgress";

export type RegistrationStep =
  | "register"
  | "measurements"
  | "body-shape"
  | "face-scan";

interface RegistrationFlowProps {
  currentStep: RegistrationStep;
  onStepChange: (step: RegistrationStep) => void;
}

export default function RegistrationFlow({
  currentStep,
  onStepChange,
}: RegistrationFlowProps) {
  const router = useRouter();
  const { analysisData, setAnalysisData } = useAnalysis();
  const {
    currentStep: persistedStep,
    setCurrentStep: setPersistedStep,
    formData: persistedFormData,
    setFormData: setPersistedFormData,
    analysisData: persistedAnalysisData,
    setAnalysisData: setPersistedAnalysisData,
  } = useRegistrationFlow();
  const [animateStep, setAnimateStep] = useState<number | undefined>();
  const [previousStep, setPreviousStep] = useState<number | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case "register":
        return 1;
      case "measurements":
        return 2;
      case "body-shape":
        return 4;
      case "face-scan":
        return 5;
      default:
        return 1;
    }
  };

  const currentStepNumber = getCurrentStepNumber();
  const { steps, markStepCompleted, getCurrentStepFromStorage } =
    useStepsProgress(currentStepNumber);

  // Initialize step from localStorage only once on mount
  useEffect(() => {
    if (!isInitialized) {
      const savedStep = getCurrentStepFromStorage();
      const savedStepFromRegistration = persistedStep;

      // Use the higher step value between the two storage mechanisms
      const stepToUse = Math.max(savedStep, savedStepFromRegistration);

      if (stepToUse > 1) {
        const stepMap: { [key: number]: RegistrationStep } = {
          1: "register",
          2: "measurements",
          3: "body-shape",
          4: "body-shape",
          5: "face-scan",
        };
        const savedStepName = stepMap[stepToUse];
        if (savedStepName && savedStepName !== currentStep) {
          onStepChange(savedStepName);
        }
      }

      // Analysis data is now managed by AnalysisContext, no need for separate initialization

      setIsInitialized(true);
    }
  }, [
    isInitialized,
    getCurrentStepFromStorage,
    persistedStep,
    onStepChange,
    currentStep,
  ]);

  const handleFormDataChange = (field: string, value: string) => {
    // Update analysis data - this will automatically sync to localStorage via AnalysisContext
    setAnalysisData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update persisted data for step tracking
    setPersistedFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMeasurementsNext = () => {
    setPreviousStep(currentStepNumber);
    setAnimateStep(3);
    markStepCompleted(currentStepNumber);

    setPersistedStep(4); // Set to step 4 instead of 3

    onStepChange("body-shape");
  };

  const handleBodyShapeNext = () => {
    setPreviousStep(currentStepNumber);
    setAnimateStep(5);
    markStepCompleted(currentStepNumber);

    setPersistedStep(5);

    onStepChange("face-scan");
  };

  const handleFaceScanComplete = () => {
    markStepCompleted(currentStepNumber);

    setPersistedStep(currentStepNumber);
  };

  const getStepsForDisplay = () => {
    return steps.map((step) => ({
      number: step.number,
      title: step.title,
      active: step.active,
    }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "body-shape":
        return "Pilih Bentuk Tubuh Kamu";
      case "face-scan":
        return "Scan Wajah Kamu";
      default:
        return undefined;
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "body-shape":
        return "Dengan mengetahui bentuk tubuhmu, kami bisa memberikan rekomendasi pakaian yang sesuai dengan proporsi tubuhmu";
      case "face-scan":
        return "Kami butuh foto selfie-mu biar bisa analisis bentuk wajah dan warna kulit dengan akurat. Dengan begitu, rekomendasi hijab yang kami kasih bisa lebih sesuai.";
      default:
        return undefined;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "measurements":
        return (
          <BodyMeasurementsStep
            formData={{
              tinggi: analysisData.tinggi,
              berat: analysisData.berat,
              umur: analysisData.umur,
            }}
            onFormDataChange={handleFormDataChange}
            onNext={handleMeasurementsNext}
          />
        );
      case "body-shape":
        return <BodyShapeStep onNext={handleBodyShapeNext} />;
      case "face-scan":
        return <FaceScanStep onComplete={handleFaceScanComplete} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center">
      <div className="container mx-auto w-full max-w-[85rem] flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-16">
        <LeftSideSection
          steps={getStepsForDisplay()}
          currentStepNumber={currentStepNumber}
          showExtendedSteps={currentStepNumber >= 3}
          animateStep={animateStep}
          previousStep={previousStep}
          title={getStepTitle()}
          description={getStepDescription()}
        />
        {renderCurrentStep()}
      </div>
    </main>
  );
}
