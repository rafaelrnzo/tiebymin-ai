import BrandLogo from './brand-logo';
import DescriptionSection from './description-section';
import StepsSection from './steps-section';

interface Step {
    number: string;
    title: string;
    active: boolean;
}

interface LeftSideSectionProps {
    steps: Step[];
}

export default function LeftSideSection({ steps }: LeftSideSectionProps) {
    return (
        <div className="w-full lg:flex-1 lg:max-w-[40%] lg:pr-20 mb-8 lg:mb-0 flex flex-col items-center">
            <BrandLogo width={200} height={64} />
            <DescriptionSection />
            <StepsSection steps={steps} />
        </div>
    );
} 