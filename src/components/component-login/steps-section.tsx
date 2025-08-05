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
        <div className="space-y-4 w-full max-w-md mx-auto">
            {steps.map((step) => (
                <div
                    key={step.number}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        step.active || step.completed
                            ? "bg-white/80 border-white shadow-sm"
                            : "bg-transparent border-[#323232]/20"
                    }`}
                >
                    <span
                        className={`${
                            step.active
                                ? "text-gray-800 font-extrabold"
                                : "text-gray-600"
                        }`}
                    >
                        {step.title}
                    </span>
                    <span
                        className={`${
                            step.active
                                ? "text-gray-800 font-extrabold"
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