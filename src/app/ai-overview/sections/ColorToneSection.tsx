import React from 'react'

interface ColorCircleProps {
  color: string;
  className?: string;
}

interface ColorGroupProps {
  title: string;
  colors: string[];
}

interface InfoCardProps {
  title: string;
  text: string;
}

const colorData = {
  best: ['#6345ED', '#F34A66', '#A855F7', '#3DA9D9', '#B4829E', '#4CD1B6'],
  worst: ['#6345ED', '#F34A66', '#A855F7', '#3DA9D9', '#B4829E', '#4CD1B6'],
  neutral: ['#6345ED', '#F34A66', '#A855F7', '#3DA9D9', '#B4829E', '#4CD1B6'],
};

const combinationData = [
  { type: 'pair', colors: ['#A855F7', '#F7B543'] },
  { type: 'pair', colors: ['#8082D9', '#8082D9'] },
  { type: 'pair', colors: ['#8082D9', '#8082D9'] },
  { type: 'pair', colors: ['#8082D9', '#8082D9'] },
];

const infoData: InfoCardProps[] = [
  { title: "Make up Tips", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { title: "Outfit Tips", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { title: "Personality", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { title: "Karakteristik", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
];

// Komponen untuk lingkaran warna individual
const ColorCircle: React.FC<ColorCircleProps> = ({ color, className }) => (
  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${className}`} style={{ backgroundColor: color }} />
);

// Komponen untuk grup warna (Best, Worst, Neutral)
const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => (
  <div className="text-center">
    <h3 className="font-script text-lg sm:text-xl font-bold text-gray-700">{title}</h3>
    <div className="mt-2 grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
      {colors.map((color, index) => <ColorCircle key={index} color={color} />)}
    </div>
  </div>
);

// Komponen untuk kartu informasi di bagian bawah
const InfoCard: React.FC<InfoCardProps> = ({ title, text }) => (
  <div>
    <h4 className="font-script text-xl font-bold text-gray-800 font-handlee">{title}</h4>
    <p className="mt-1 text-sm text-gray-700">{text}</p>
  </div>
);

const page = () => {
  return (
    <div className="font-sans max-w-6xl w-full mx-auto space-y-6">
      {/* Bagian Atas: Cool Winter & Color Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Kartu Cool Winter */}
        <div className="lg:col-span-1 p-6 rounded-2xl border-[1px] border-neutral-600">
          <h2 className="text-5xl font-bold font-oswald leading-tight">Cool<br />Winter</h2>
          <p className="mt-4 text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipiscingLorem ipsum dolor sit amet, consectetur adipiscing
          </p>
        </div>

        {/* Kartu Color Guide Line */}
        <div className="lg:col-span-2 p-6 rounded-2xl border-[1px] border-neutral-600">
          <h2 className="text-center font-script font-handlee text-xl font-bold text-gray-700">Color Guide Line</h2>

          <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-8">
            <ColorGroup title="Best Color" colors={colorData.best} />
            <ColorGroup title="Worst Color" colors={colorData.worst} />
            <ColorGroup title="Neutral Color" colors={colorData.neutral} />
          </div>

          {/* Bagian Kombinasi */}
          <div className="mt-6 flex items-center space-x-4 border border-gray-300 rounded-2xl p-2">
            <span className="font-bold text-sm text-gray-700 pl-4">Combination</span>
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
              {combinationData.map((item, index) => (
                <div key={index} className="flex flex-shrink-0">
                  <ColorCircle color={item.colors[0]} />
                  <ColorCircle color={item.colors[1]} className="-ml-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tips & Karakteristik */}
      <div className="bg-[#FADADD] p-6 rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          {infoData.map((info) => <InfoCard key={info.title} {...info} />)}
        </div>
      </div>
    </div>
  )
}

export default page