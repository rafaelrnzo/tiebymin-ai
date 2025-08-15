import { Sparkles } from "lucide-react";
import Image from "next/image";

interface Step {
  number: string;
  title: string;
  active: boolean;
}

interface LeftSideSectionProps {
  steps?: Step[];
  currentStep?: number;
  currentStepNumber?: number;
  title?: string;
  description?: string;
  showExtendedSteps?: boolean; // New prop to control step visibility
}

export default function LeftSideSection({
  steps,
  currentStep,
  currentStepNumber,
  title,
  description,
  showExtendedSteps = true, // Default to true to show all steps
}: LeftSideSectionProps) {
  return (
    <div className="space-y-8 w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="mb-8 flex justify-center w-full">
        <Image
          src="/tie-by-min-logo.png"
          alt="Tiebymin Logo"
          width={300}
          height={96}
          priority
          className="mx-auto"
        />
      </div>

      {currentStep && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center justify-between w-full max-w-sm mx-auto shadow-md">
          <span className="text-gray-700 font-medium font-poppins">
            Analisa
          </span>
          <span className="text-gray-700 font-bold font-poppins">
            {String(currentStep).padStart(2, "0")}
          </span>
        </div>
      )}

      {title === "Pilih Bentuk Tubuh Kamu" ? (
        <div className="flex flex-col gap-8">
          <div className="bg-[#EF789B] rounded-2xl p-6 text-white w-full max-w-sm mx-auto shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold font-poppins">{title}</h2>
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <Image
                  src="/stars.png"
                  alt="stars"
                  width={20}
                  height={20}
                  className="sparkle-animation"
                />
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              {description}
            </p>
          </div>
          <div
            className={
              "shadow-md border rounded-2xl p-4 flex items-center justify-between transition-colors duration-300"
            }
          >
            <span className="font-bold font-poppins">Scan Wajah Kamu</span>
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <Sparkles fill="black" />
            </div>
          </div>
        </div>
      ) : title === "Scan Wajah Kamu" ? (
        <div className="flex flex-col gap-8">
          <div
            className={
              "shadow-md bg-white rounded-2xl p-4 flex items-center justify-between transition-colors duration-300"
            }
          >
            <span className="font-bold font-poppins">
              Pilih bentuk Tubuh Kamu
            </span>
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <Sparkles fill="black" />
            </div>
          </div>
          <div className="bg-[#EF789B] rounded-2xl p-6 text-white w-full max-w-sm mx-auto shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold font-poppins">{title}</h2>
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <Image
                  src="/stars.png"
                  alt="stars"
                  width={20}
                  height={20}
                  className="sparkle-animation"
                />
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ) : null}

      {steps && (
        <>
          <div className="text-center max-w-md">
            <p className="text-gray-600 font-poppins text-xl">
              Mulai perjalanan kecantikanmu dengan analisa kami Biar Ai kami
              yang berikan saran terbaik untuk kamu
            </p>
          </div>
          <div className="w-full max-w-md mx-auto space-y-4">
            {(showExtendedSteps
              ? steps
              : steps.filter((step) => parseInt(step.number, 10) <= 3)
            ).map((step, index) => {
              const stepNumber = parseInt(step.number, 10);
              const isCompleted =
                currentStepNumber && stepNumber < currentStepNumber;
              const isCurrent =
                currentStepNumber && stepNumber === currentStepNumber;

              let stepClasses =
                "rounded-2xl p-4 flex items-center justify-between shadow-md transition-colors duration-300";

              if (isCurrent) {
                if (step.title === "Pilih Bentuk Tubuh Kamu") {
                  stepClasses += " bg-[#EF789B] text-white";
                } else {
                  stepClasses += " bg-white text-gray-800";
                }
              } else if (isCompleted) {
                stepClasses += " bg-white text-gray-700";
              } else {
                stepClasses += " border";
              }

              const renderStep = (
                step: Step,
                isCurrent: boolean,
                isCompleted: boolean,
                key: number | string
              ) => {
                let stepClasses =
                  "rounded-2xl p-4 flex items-center justify-between shadow-md transition-colors duration-300";
                if (isCurrent) {
                  if (step.title === "Pilih Bentuk Tubuh Kamu") {
                    stepClasses += " bg-[#EF789B] text-white";
                  } else {
                    stepClasses += " bg-white text-gray-800";
                  }
                } else if (isCompleted) {
                  stepClasses += " bg-white text-gray-700";
                } else {
                  stepClasses += " border";
                }

                return (
                  <div key={key} className={stepClasses}>
                    <span className="font-bold font-poppins">{step.title}</span>
                    {step.number === "04" || step.number === "05" ? (
                      <div className="w-6 h-6 rounded flex items-center justify-center">
                        <Image
                          src="/stars.png"
                          alt="stars"
                          width={20}
                          height={20}
                          className="sparkle-animation"
                        />
                      </div>
                    ) : (
                      <span className="font-bold font-poppins">
                        {step.number}
                      </span>
                    )}
                  </div>
                );
              };

              return renderStep(step, !!isCurrent, !!isCompleted, index);
            })}
          </div>
        </>
      )}
    </div>
  );
}
