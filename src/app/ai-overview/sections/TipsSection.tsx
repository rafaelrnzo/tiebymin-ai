import Image from 'next/image';
import React from 'react';

const TipsSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Card 1 */}
      <div className="border-[1px] border-neutral-600  rounded-2xl p-4 sm:p-6">
        <div className="mb-3">
          <Image src="/overview-ai/icons/ri_shape-fill.svg" width={32} height={32} alt="Shape Icon" />
        </div>
        <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg sm:text-xl">Tips untuk bentuk wajah kamu</h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Card 2 */}
      <div className="border-[1px] border-neutral-600  rounded-2xl p-4 sm:p-6">
        <div className="mb-3">
          <Image src="/overview-ai/icons/healthicons_body.svg" width={32} height={32} alt="Body Icon" />
        </div>
        <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg sm:text-xl">Tips untuk bentuk badan kamu</h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Card 3 */}
      <div className="border-[1px] border-neutral-600  rounded-2xl p-4 sm:p-6">
        <div className="mb-3">
          <Image src="/overview-ai/icons/mdi_color.svg" width={32} height={32} alt="Color Tone Icon" />
        </div>
        <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg sm:text-xl">Tips untuk Tone Warna Kamu</h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Card 4 */}
      <div className="bg-pink-200 rounded-2xl p-4 sm:p-6">
        <div className="mb-3">
          <Image src="/overview-ai/icons/ic_baseline-tips-and-updates.svg" width={32} height={32} alt="Tips & Trick Icon" />
        </div>
        <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg sm:text-xl">Rekap Cepat Tips Kamu</h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
};

export default TipsSection;