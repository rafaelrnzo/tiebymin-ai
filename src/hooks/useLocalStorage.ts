"use client";

import { useAnalysis } from "@/context/AnalysisContext";
import { useState } from "react";

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
      if (!item) {
        return initialValue;
      }

      // Validate that the item is a valid JSON string
      if (typeof item !== 'string' || item.trim() === '') {
        console.warn(`Invalid localStorage data for key "${key}": not a string or empty`);
        // Clear the corrupted data
        window.localStorage.removeItem(key);
        return initialValue;
      }

      // Try to parse the JSON
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      console.error(`Corrupted data:`, window.localStorage.getItem(key));

      // Clear the corrupted data to prevent future errors
      try {
        window.localStorage.removeItem(key);
        console.log(`Cleared corrupted localStorage data for key "${key}"`);
      } catch (clearError) {
        console.error(`Failed to clear corrupted data for key "${key}":`, clearError);
      }

      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Validate the value can be serialized to JSON
      const serializedValue = JSON.stringify(valueToStore);

      // Update state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      console.error(`Attempted to store value:`, value);

      // If JSON serialization fails, don't update the state
      // This prevents the component from entering an inconsistent state
      console.warn(`Failed to serialize value for localStorage key "${key}". State not updated.`);
    }
  };

  // Function to clear the stored value
  const clearValue = () => {
    try {
      // Update state first
      setStoredValue(initialValue);

      // Then clear from localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        console.log(`Successfully cleared localStorage key "${key}"`);
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
      // Even if clearing fails, we've already reset the state
      console.warn(`State has been reset to initial value despite localStorage clear failure`);
    }
  };

  return [storedValue, setValue, clearValue];
}

// Utility function to clear all corrupted localStorage data
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
        // Try to parse to check if it's valid JSON
        JSON.parse(item);
      }
    } catch (error) {
      // If parsing fails, clear the corrupted data
      try {
        window.localStorage.removeItem(key);
        clearedCount++;
        console.log(`Cleared corrupted localStorage data for key: ${key}`);
      } catch (clearError) {
        console.error(`Failed to clear corrupted data for key ${key}:`, clearError);
      }
    }
  });

  if (clearedCount > 0) {
    console.log(`Successfully cleared ${clearedCount} corrupted localStorage entries`);
  } else {
    console.log("No corrupted localStorage data found");
  }

  return clearedCount;
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