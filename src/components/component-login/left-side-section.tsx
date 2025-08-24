import { ArrowRight, Sparkles } from "lucide-react";
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
  showExtendedSteps?: boolean;
}

export default function LeftSideSection({
  steps,
  currentStep,
  currentStepNumber,
  title,
  description,
  showExtendedSteps = true,
}: LeftSideSectionProps) {
  return (
    <div className="space-y-[17px] lg:space-y-8 w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="flex justify-center w-[120px] lg:w-full mt-[40px] lg:mt-0">
        <Image
          src="/vector/tie-by-min-logo.svg"
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
          <style jsx global>{`
            @keyframes rotate-sparkle {
              0%,
              100% {
                transform: rotate(0deg);
              }
              25% {
                transform: rotate(90deg);
              }
              50% {
                transform: rotate(0deg);
              }
              75% {
                transform: rotate(-90deg);
              }
            }
            .sparkle-animation {
              animation: rotate-sparkle 4s ease-in-out infinite;
            }
          `}</style>
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
          {/* Mobile Steps */}
          <div className="lg:hidden w-full px-4 rounded-2xl">
            <p className="text-center font-poppins text-xs pb-5">
              Mulai perjalanan kecantikanmu dengan analisa kami Biar AI kami
              yang berikan saran terbaik untuk kamu
            </p>
            <div className="flex flex-row justify-center items-start">
              {(showExtendedSteps
                ? steps
                : steps.filter((step) => parseInt(step.number, 10) <= 3)
              ).map((step, index, arr) => {
                const stepNumber = parseInt(step.number, 10);
                const isCompleted =
                  currentStepNumber && stepNumber < currentStepNumber;
                const isCurrent =
                  currentStepNumber && stepNumber === currentStepNumber;

                let circleClasses =
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-300";
                let textClasses = "text-xs text-center mt-2 w-20 font-bold ";

                if (isCurrent) {
                  circleClasses += " bg-[#EF789B] text-white border-[#EF789B]";
                  textClasses += "text-[#323232] font-bold";
                } else if (isCompleted) {
                  circleClasses += " bg-white text-[#323232]";
                  textClasses += "text-[#323232]";
                } else {
                  circleClasses += " bg-white text-[#323232]";
                  textClasses += "text-[#323232]";
                }

                return (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center">
                      <div className={circleClasses}>
                        <span>{step.number}</span>
                      </div>
                      <p className={textClasses}>{step.title}</p>
                    </div>

                    {index < arr.length - 1 && (
                      <div className="px-2 mt-5">
                        <svg
                          width="42"
                          height="8"
                          viewBox="0 0 42 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M41.8536 4.35355C42.0488 4.15829 42.0488 3.84171 41.8536 3.64645L38.6716 0.464466C38.4763 0.269204 38.1597 0.269204 37.9645 0.464466C37.7692 0.659728 37.7692 0.976311 37.9645 1.17157L40.7929 4L37.9645 6.82843C37.7692 7.02369 37.7692 7.34027 37.9645 7.53553C38.1597 7.7308 38.4763 7.7308 38.6716 7.53553L41.8536 4.35355ZM0 4.5H41.5V3.5H0V4.5Z"
                            fill="#323232"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Steps */}
          <div className="hidden lg:block w-full max-w-sm mx-auto">
            <h3 className="text-center font-poppins text-gray-800 mb-4">
              Mulai perjalanan kecantikanmu dengan analisa kami Biar Ai kami
              yang berikan saran terbaik untuk kamu
            </h3>
            <div className="space-y-5">
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
                  "backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center justify-between w-full max-w-sm mx-auto shadow-md";

                if (isCurrent || isCompleted) {
                  stepClasses += " bg-white text-[#323232] shadow-md";
                } else {
                  stepClasses +=
                    " bg-transparent text-gray-600 border-2 border-[#323232]/50";
                }

                return (
                  <div key={index} className={stepClasses}>
                    <span className="font-poppins font-bold">{step.title}</span>
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#323232]">
                      {step.number}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
