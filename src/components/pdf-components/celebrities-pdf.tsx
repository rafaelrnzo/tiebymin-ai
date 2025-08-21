import { Celebrity, UserData } from "@/types";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

export const CelebritiesMatch = ({
  userData,
  celebrityDetails,
}: {
  userData: UserData;
  celebrityDetails?: Celebrity;
}) => (
  <div className="flex items-center justify-center w-full min-h-screen">
    <div className="relative bg-[#F0F0F0] w-full px-10 flex flex-col justify-between min-h-screen">
      <PageHeader name={userData.name} />

      <div className="flex flex-col gap-4 flex-grow">
        <h1 className="text-[48px] text-gray-900 leading-tight font-oswald">
          Selebrity yang serupa <br /> dengan kamu
        </h1>
        <hr className="my-4" />

        <div className="flex gap-6">
          <div className="relative w-[55%] rounded-lg overflow-hidden shadow">
            <Image
              src={celebrityDetails?.picture_url as string}
              alt={userData.celebrityMatch.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-6 left-6 bg-[#323232] text-white text-xs font-bold px-2 py-1 rounded flex items-center shadow">
              <Sparkles className="w-4 h-4 mr-1" />
              {userData.celebrityMatch.matchPercentage}% Match
            </div>
          </div>
          <div className="w-[45%] flex flex-col">
            <h2 className="text-3xl font-oswald">
              {userData.celebrityMatch.name}
            </h2>
            <div className="flex flex-col gap-5">
              <p className="font-poppins text-base text-gray-700 leading-snug flex-grow mt-3">
                {celebrityDetails?.description}
              </p>
              <div className="bg-[#323232] h-[220px] text-white p-8 rounded">
                <h3 className="text-lg font-bold mb-1">Kenapa Cocok?</h3>
                <p className="text-base leading-snug">
                  {celebrityDetails?.similarity_text ||
                    userData.celebrityMatch.reason.map((text, index) => (
                      <span key={index}>{text}, </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer page="05" />
    </div>
  </div>
);
