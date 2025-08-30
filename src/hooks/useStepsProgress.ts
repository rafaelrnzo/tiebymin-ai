import { useState, useEffect, useMemo } from 'react';

export interface Step {
    number: string;
    title: string;
    active: boolean;
    completed: boolean;
}

const STORAGE_KEY = 'registration-steps-progress';

export function useStepsProgress(currentStep: number) {
    const initialSteps: Step[] = useMemo(() => [
        { number: "01", title: "Buat Akun", active: false, completed: false },
        { number: "02", title: "Lengkapi Data", active: false, completed: false },
        { number: "03", title: "Analisa", active: false, completed: false },
        {
      number: "04",
      title: "Pilih Bentuk Tubuh Kamu",
      active: false,
      completed: false,
    },
    { number: "05", title: "Scan Wajah Kamu", active: false, completed: false },
    ], []);

    const [steps, setSteps] = useState<Step[]>(initialSteps);

    // Load progress from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedProgress = localStorage.getItem(STORAGE_KEY);
                if (savedProgress) {
                    const parsedProgress = JSON.parse(savedProgress);
                    if (parsedProgress.steps && Array.isArray(parsedProgress.steps)) {
                        setSteps(parsedProgress.steps);
                        return;
                    }
                }
            } catch (error) {
                console.error('Error loading steps progress from localStorage:', error);
            }
        }

        // If no saved progress, initialize with current step
        const updatedSteps = initialSteps.map((step, index) => {
            const stepNumber = index + 1;
            return {
                ...step,
                active: stepNumber === currentStep,
                completed: stepNumber < currentStep,
            };
        });
        setSteps(updatedSteps);
    }, []);

    // Save progress to localStorage whenever steps change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ steps, currentStep }));
            } catch (error) {
                console.error('Error saving steps progress to localStorage:', error);
            }
        }
    }, [steps, currentStep]);

    // Update steps when currentStep changes
    useEffect(() => {
        setSteps(prev => prev.map((step, index) => {
            const stepNumber = index + 1;
            return {
                ...step,
                active: stepNumber === currentStep,
                completed: stepNumber < currentStep,
            };
        }));
    }, [currentStep]);

    const markStepCompleted = (stepNumber: number) => {
        setSteps(prev => prev.map((step, index) => {
            const stepIndex = index + 1;
            return {
                ...step,
                completed: stepIndex <= stepNumber,
                active: stepIndex === stepNumber + 1,
            };
        }));
    };

    const resetProgress = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
        const resetSteps = initialSteps.map((step, index) => ({
            ...step,
            active: index === 0,
            completed: false,
        }));
        setSteps(resetSteps);
    };

    const getCurrentStepFromStorage = (): number => {
        if (typeof window !== 'undefined') {
            try {
                const savedProgress = localStorage.getItem(STORAGE_KEY);
                if (savedProgress) {
                    const parsedProgress = JSON.parse(savedProgress);
                    return parsedProgress.currentStep || 1;
                }
            } catch (error) {
                console.error('Error getting current step from localStorage:', error);
            }
        }
        return 1;
    };

    return {
        steps,
        markStepCompleted,
        resetProgress,
        getCurrentStepFromStorage
    };
}