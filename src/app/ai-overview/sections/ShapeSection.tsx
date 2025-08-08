import React from 'react';

interface IShape {
  name: string;
  value: number;
}

const shapeData: IShape[] = [
    { name: 'Square', value: 80 },
    { name: 'Round', value: 10 },
    { name: 'Diamond', value: 10 },
    { name: 'Pear', value: 10 },
    { name: 'Oval', value: 10 },
    { name: 'Triangle', value: 10 },
];

interface ShapeBarProps {
    name: string;
    value: number;
}

const ShapeBar: React.FC<ShapeBarProps> = ({ name, value }) => (
    <div>
        <p className="text-base text-gray-800">{name}</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-3.5">
            <div
                className="bg-pink-400 h-3.5 rounded-full"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

const FaceShapeAnalysis: React.FC = () => {
return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {shapeData.map((shape) => (
                    <ShapeBar key={shape.name} name={shape.name} value={shape.value} />
                ))}
            </div>
        </div>
    );
};

const ShapeSection = () => {
    return (
        <div className='flex flex-col gap-y-8'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-2xl p-4 sm:p-6">
                    <h3 className="font-bold text-5xl font-oswald">Square</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mt-4">
                        Bentuk wajah kotak itu kayak proporsi sempurna gitu, lho! Kamu punya garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit. Ini bikin hampir semua gaya hijab cocok banget buat kamu!
                    </p>
                </div>
                <div className="bg-pink-100 rounded-2xl p-4 sm:p-6">
                    <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg text-center">Karakteristik</h3>
                    <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-2">
                        <li>Bahu dan pinggul memiliki lebar yang hampir sama.</li>
                        <li>Pinggang terlihat jelas dan ramping.</li>
                        <li>Proporsi tubuh cenderung simetris dan elegan.</li>
                    </ul>
                </div>
            </div>
            <FaceShapeAnalysis />
        </div>
    )
}

export default ShapeSection;