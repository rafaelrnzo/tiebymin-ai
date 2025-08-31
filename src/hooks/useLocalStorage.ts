"use client";

import { useState, useEffect } from "react";
import { useAnalysis } from "@/context/AnalysisContext";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to clear the stored value
  const clearValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, clearValue];
}

// Hook specifically for registration flow persistence
export function useRegistrationFlow() {
  const [currentStep, setCurrentStep, clearCurrentStep] = useLocalStorage(
    "registration-current-step",
    1
  );

  const [userId, setUserId, clearUserId] = useLocalStorage(
    "userId",
    ""
  );

  // Use AnalysisContext instead of managing localStorage directly
  const { analysisData, setAnalysisData } = useAnalysis();

  const clearAll = () => {
    clearCurrentStep();
    clearUserId();
  };

  return {
    currentStep,
    setCurrentStep,
    // Use analysisData from context to avoid duplication
    formData: analysisData,
    setFormData: setAnalysisData,
    userId,
    setUserId,
    analysisData,
    setAnalysisData,
    clearAll,
  };
}