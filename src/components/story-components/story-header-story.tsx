import Image from "next/image";

interface StoryHeaderProps {
  userName: string;
}

export const StoryHeader = ({ userName }: StoryHeaderProps) => {
  // Extract first name from full name
  const firstName = userName?.split(" ")[0] || "KAMU";

  return (
    <div className="flex justify-between items-center mb-4">
      <Image
        src="/vector/tie-by-min-logo.svg"
        alt="Logo Tie By Min"
        width={120}
        height={40}
      />
      <h1 className="text-2xl font-bold font-oswald">
        HASIL ANALISA {firstName?.toUpperCase() || "KAMU"}
      </h1>
    </div>
  );
};
