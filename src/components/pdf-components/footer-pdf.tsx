export const Footer = ({
  page,
  className,
}: {
  page: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex justify-between items-center text-xs text-gray-700 my-12 font-poppins font-bold ${className}`}
    >
      <span>© 2025, Tiebymin AI</span>
      <span>{page}</span>
    </div>
  );
};
