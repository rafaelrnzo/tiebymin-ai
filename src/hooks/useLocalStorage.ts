"use client";

import { useAnalysis } from "@/context/AnalysisContext";
import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      if (typeof item !== 'string' || item.trim() === '') {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      try {
        window.localStorage.removeItem(key);
      } catch (clearError) {
      }

      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      const serializedValue = JSON.stringify(valueToStore);

      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, serializedValue);
      }
    } catch (error) {
    }
  };

  const clearValue = () => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
    }
  };

  return [storedValue, setValue, clearValue];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function clearCorruptedLocalStorage() {
  if (typeof window === "undefined") return;

  const keysToCheck = [
    "registration-current-step",
    "registration-steps-progress",
    "tiebymin-analysis-data",
    "userToken",
    "accessToken",
    "userId",
    "user_id",
    "id",
    "userEmail",
    "firstName",
    "lastName",
    "analysisResultId",
    "paymentOrderId",
    "capturedImage",
    "uploadedImage",
    "uploadedFaceImage",
    "feedbackSubmitted",
    "feedbackDismissed",
  ];

  let clearedCount = 0;

  keysToCheck.forEach(key => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        JSON.parse(item);
      }
    } catch (error) {
      try {
        window.localStorage.removeItem(key);
        clearedCount++;
      } catch (clearError) {
      }
    }
  });

  return clearedCount;
}

export function useRegistrationFlow() {
  const [currentStep, setCurrentStep, clearCurrentStep] = useLocalStorage(
    "registration-current-step",
    1
  );

  const [userId, setUserId, clearUserId] = useLocalStorage(
    "userId",
    ""
  );

  const { analysisData, setAnalysisData } = useAnalysis();

  const clearAll = () => {
    clearCurrentStep();
    clearUserId();
  };

  return {
    currentStep,
    setCurrentStep,
    formData: analysisData,
    setFormData: setAnalysisData,
    userId,
    setUserId,
    analysisData,
    setAnalysisData,
    clearAll,
  };
}