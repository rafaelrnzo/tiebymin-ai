import { BodyShapeData, UserData } from "@/types";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

export const BodyShape = ({
  userData,
  bodyDetails,
}: {
  userData: UserData;
  bodyDetails?: BodyShapeData;
}) => {
  const bmiValue = userData.bmi.value;

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] h-screen w-full px-10 flex flex-col justify-between">
        <PageHeader width={100} name={userData.name} />
        <main className="mx-auto py-6 max-w-5xl flex-grow">
          <div className="flex gap-10">
            <div className="flex justify-center">
              <Image
                src={
                  bodyDetails?.link_picture ||
                  userData.bodyShapeAnalysis.imageUrl
                }
                alt={`Diagram Bentuk Tubuh ${userData.bodyShape}`}
                width={400}
                height={300}
                className="w-[300px] h-[400px] object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-[24px] mb-4 font-oswald">
                Bentuk tubuh kamu {userData.bodyShape}
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {bodyDetails?.penjelasan_body_shape}
              </p>
              <div className="bg-[#323232] text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Karakteristik</h3>
                <ul className="list-disc list-inside space-y-2">
                  {bodyDetails?.karakteristik
                    ?.split("-")
                    .filter((point) => point.trim() !== "")
                    .map((point, index) => (
                      <li key={index} className="text-lg font-poppins">
                        {point.trim()}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="font-bold">
              BMI INDEX: {bmiValue} ({userData.bmi.category})
            </p>
            <p className="text-gray-600 mb-3">{userData.bmi.desc}</p>

            <div className="w-full h-10 rounded-md bg-gray-200 overflow-hidden">
              <div className="h-full rounded-md bg-gradient-to-r from-pink-400 to-pink-200" />
            </div>
          </div>
        </main>
        <Footer page="04" />
      </div>
    </div>
  );
};
