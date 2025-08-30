interface Step {
  number: string;
  title: string;
  active: boolean;
  completed?: boolean;
}

interface StepsSectionProps {
  steps: Step[];
}

export default function StepsSection({ steps }: StepsSectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-md mx-auto font-poppins px-4 sm:px-0">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-all ${
            step.active || step.completed
              ? "bg-[#f0f0f0]/80 border-none shadow-sm font-extrabold"
              : "bg-transparent border-[#323232]/20"
          }`}
        >
          <span
            className={`text-sm sm:text-base ${
              step.active ? "text-gray-800 font-extrabold" : "text-gray-600"
            }`}
          >
            {step.title}
          </span>
          <span
            className={`text-sm sm:text-base ${
              step.active
                ? "text-gray-800 font-extrabold font-poppins"
                : "text-gray-600"
            }`}
          >
            {step.number}
          </span>
        </div>
      ))}
    </div>
  );
}
