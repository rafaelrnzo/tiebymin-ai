'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LeftSideSection from '@/components/component-login/left-side-section';
import BodyMeasurementsForm from '@/components/component-login/body-measurements-form';
import { useStepsProgress } from '@/hooks/useStepsProgress';
import { useAnalysis } from '@/context/AnalysisContext'; 


export default function Step2Page() {
    const router = useRouter();
    const { steps } = useStepsProgress(2);
    const { analysisData, setAnalysisData } = useAnalysis();


    const handleFormDataChange = (field: string, value: string) => {
        setAnalysisData(prev => ({
            ...prev,
            [field]: value,
        }));    
    }

    const handleSubmit = () => {
        console.log('Data dari context:', analysisData); 
        router.push('/analyze/prepare-face');
    };

    return (
        <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center p-4">
            <div className="w-full max-w-[85rem] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
                <LeftSideSection steps={steps} />
                <div className="w-full lg:flex-1 lg:max-w-[65%]">
                    <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-0 py-8 px-4 sm:py-12 sm:px-6 md:px-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-oswald text-center lg:text-left">
                            Lengkapi Data Diri
                        </h2>
                        <p className='mb-4'>
                           Semakin lengkap data kamu akan membuat hasil analisa kami jauh lebih tepat, jangan lupa di isi ya....                  
                       </p>
                        <BodyMeasurementsForm
                            formData={analysisData}
                            onFormDataChange={handleFormDataChange}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 