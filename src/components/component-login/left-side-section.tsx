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
            <p className="text-[#323232] font-poppins text-xs mx-4 lg:mx-0 lg:text-xl">
              Mulai perjalanan kecantikanmu dengan analisa kami Biar Ai kami
              yang berikan saran terbaik untuk kamu
            </p>
          </div>
          <div className="lg:hidden">
            <div className="flex flex-row w-full max-w-full mx-auto items-center">
              {(showExtendedSteps
                ? steps
                : steps.filter((step) => parseInt(step.number, 10) <= 3)
              ).map((step, index) => {
                const stepNumber = parseInt(step.number, 10);
                const isCompleted =
                  currentStepNumber && stepNumber < currentStepNumber;
                const isCurrent =
                  currentStepNumber && stepNumber === currentStepNumber;

                let circleClasses =
                  "w-[50px] h-[50px] rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-300";

                if (isCurrent) {
                  if (
                    step.title === "Pilih Bentuk Tubuh Kamu" ||
                    step.title === "Scan Wajah Kamu"
                  ) {
                    circleClasses +=
                      " bg-[#EF789B] text-white border-[#EF789B]";
                  } else {
                    circleClasses += " bg-white text-gray-800 border-[#323232]";
                  }
                } else if (isCompleted) {
                  circleClasses += " bg-white text-gray-800 border-[#323232]";
                } else {
                  circleClasses += " text-gray-600 border-[#323232] border-1";
                }

                return (
                  <div key={index} className="flex items-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className={circleClasses}>
                        {step.number === "04" || step.number === "05" ? (
                          <Image
                            src="/stars.png"
                            alt="stars"
                            width={20}
                            height={20}
                            className="sparkle-animation"
                          />
                        ) : (
                          <span>{step.number}</span>
                        )}
                      </div>

                      {/* Step Title Below */}
                      <div className="text-center max-w-[120px]">
                        <span
                          className={`text-sm ${
                            isCurrent
                              ? "text-[#323232] font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                    </div>

                    {index <
                      (showExtendedSteps
                        ? steps.length - 1
                        : steps.filter((step) => parseInt(step.number, 10) <= 3)
                            .length - 1) && (
                      <div className="mx-4 mb-6">
                        <svg
                          width="42"
                          height="8"
                          viewBox="0 0 42 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M41.8536 4.35355C42.0488 4.15829 42.0488 3.84171 41.8536 3.64645L38.6716 0.464466C38.4763 0.269204 38.1597 0.269204 37.9645 0.464466C37.7692 0.659728 37.7692 0.976311 37.9645 1.17157L40.7929 4L37.9645 6.82843C37.7692 7.02369 37.7692 7.34027 37.9645 7.53553C38.1597 7.7308 38.4763 7.7308 38.6716 7.53553L41.8536 4.35355ZM0 4V4.5H41.5V4V3.5H0V4Z"
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

          <div className="hidden lg:block lg:w-full">
            <div className="flex flex-col w-full max-w-md mx-auto space-y-4">
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
                  "rounded-2xl w-full p-4 flex items-center justify-between shadow-md transition-colors duration-300";

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
                  <div key={index} className={stepClasses}>
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
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
