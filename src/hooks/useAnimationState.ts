"use client";

import { useEffect, useState } from "react";


export const useAnimationState = (
  visible: boolean,
  totalSteps: number,
  durationPerStep: number,
  onComplete: () => void
) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          onComplete();
          return prev;
        }
        return prev + 1;
      });
    }, durationPerStep);

    return () => clearInterval(interval);
  }, [visible, totalSteps, durationPerStep, onComplete]);

  return { currentStep };
};