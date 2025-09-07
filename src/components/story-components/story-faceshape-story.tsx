interface StoryFaceShapeProps {
  faceShapeAnalysisData: { label: string; value: number; active: boolean }[];
  userData: { faceShape: string };
  kalimatUtama: string;
}

export const StoryFaceShape = ({
  faceShapeAnalysisData,
  userData,
  kalimatUtama,
}: StoryFaceShapeProps) => {
  return (
    <div className="flex items-start justify-between my-10 gap-10">
      <div className="grid grid-cols-2 gap-10 mb-6 w-full">
        {faceShapeAnalysisData.map((shape) => (
          <div key={shape.label}>
            <span
              className={`text-sm ${
                shape.active
                  ? "font-poppins text-xl font-bold text-gray-800"
                  : "text-gray-500"
              }`}
            >
              <span className="font-poppins text-xl">{shape.label}</span>
            </span>
            <div className="w-full mt-4 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-[#EF789B] h-1.5 rounded-full"
                style={{ width: `${shape.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[400px]">
        <h3 className="mb-4 font-oswald text-[36px]">
          Bentuk wajah kamu {userData.faceShape}
        </h3>
        <p className="text-xl font-poppins">{kalimatUtama}</p>
      </div>
    </div>
  );
};
