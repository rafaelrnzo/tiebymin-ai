import Image from "next/image";

export const PageHeader = ({
  name,
  fill,
}: {
  name?: string;
  width?: number;
  fill?: boolean;
}) => {
  let userName = name;
  if (typeof window !== "undefined") {
    userName = localStorage.getItem("firstName") || name;
  }

  return (
    <header className="flex justify-between items-center mt-[50px] mb-[25px]">
      <Image
        src="/vector/tie-by-min-logo.svg"
        alt="Logo Tie By Min"
        width={58}
        height={37}
        className="w-[120px] sm:w-auto"
      />
      {fill ? (
        <div className="font-poppins bg-[#323232] text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] truncate">
          {userName}
        </div>
      ) : (
        <div className="font-poppins font-bold text-xs">{userName}</div>
      )}
    </header>
  );
};
