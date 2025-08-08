import React from 'react';
import Image from 'next/image';

const CelebrityMatchSection = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col gap-6 w-full md:w-2/5">
        <div className="border-[1px] border-neutral-600  rounded-2xl p-6">
          <p className="font-handlee text-[#ED80A7] text-lg mb-1">Artis yang mirip kamu</p>
          <h3 className="text-3xl font-bold text-gray-800 font-oswald">Siren Sungkar</h3>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            Kemiripan bentuk wajah dan proporsi fitur membuat gaya Siren Sungkar sangat cocok untuk dijadikan inspirasi fashion kamu.
          </p>
        </div>
        <div className="bg-[#FCE9EC] rounded-2xl p-6">
          <h4 className="font-bold font-handlee text-gray-800 text-md mb-2">Kenapa cocok?</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Gaya hijabnya yang elegan dan pemilihan warna yang seringkali bernuansa lembut akan sangat menunjang penampilanmu.
          </p>
        </div>
      </div>
      <div className="relative w-full md:w-3/5 min-h-[400px]">
        <Image src="/dewisandra.png" alt="Siren Sungkar" fill style={{ objectFit: "cover" }} className="rounded-2xl" />
        <span className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
          <Image src="/overview-ai/icons/ai-generate.svg" width={16} height={16} alt="Match Icon" />
          88% Match
        </span>
      </div>
    </div>
  );
};

export default CelebrityMatchSection;