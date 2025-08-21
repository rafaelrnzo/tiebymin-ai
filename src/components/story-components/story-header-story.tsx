import Image from "next/image";

interface StoryHeaderProps {
  userName: string;
}

export const StoryHeader = ({ userName }: StoryHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Image
        src="/vector/tie-by-min-logo.svg"
        alt="Logo Tie By Min"
        width={120}
        height={40}
      />
      <h1 className="text-2xl font-bold font-oswald">
        HASIL ANALISA {userName?.toUpperCase()}
      </h1>
    </div>
  );
};
