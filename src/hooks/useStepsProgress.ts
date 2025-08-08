import { useState, useEffect, useMemo } from 'react';

export interface Step {
    number: string;
    title: string;
    active: boolean;
    completed: boolean;
}

export function useStepsProgress(currentStep: number) {
    const initialSteps: Step[] = useMemo(() => [
        { number: "01", title: "Buat Akun", active: false, completed: false },
        { number: "02", title: "Lengkapi Data", active: false, completed: false },
        { number: "03", title: "Analisa", active: false, completed: false },
    ], []);

    const [steps, setSteps] = useState<Step[]>(initialSteps);

    useEffect(() => {
        const updatedSteps = initialSteps.map((step, index) => {
            const stepNumber = index + 1;
            return {
                ...step,
                active: stepNumber === currentStep,
                completed: stepNumber < currentStep,
            };
        });
        setSteps(updatedSteps);
    }, [currentStep, initialSteps]);

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

    return { steps, markStepCompleted };
} 