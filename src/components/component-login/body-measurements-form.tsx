import TextInputField from './text-input-field';

interface BodyMeasurementsFormProps {
    formData: {
        tinggi: string;
        berat: string;
        umur: string;
    };
    onFormDataChange: (field: string, value: string) => void;
    onSubmit: () => void;
}

export default function BodyMeasurementsForm({ formData, onFormDataChange, onSubmit }: BodyMeasurementsFormProps) {

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tinggi Badan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <label className="whitespace-nowrap text-gray-700 font-medium" htmlFor="tinggi-input">
                        Tinggi Badan
                    </label>
                    <TextInputField
                        label=""
                        value={formData.tinggi}
                        onChange={(value) => onFormDataChange('tinggi', value)}
                        width="100%"
                    />
                    <label className="whitespace-nowrap text-gray-400 font-medium" htmlFor="tinggi-input">
                        cm
                    </label>
                </div>
                {/* Berat Badan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 md:px-4">
                    <label className="whitespace-nowrap text-gray-700 font-medium" htmlFor="berat-input">
                        Berat Badan
                    </label>
                    <TextInputField
                        label=""
                        value={formData.berat}
                        onChange={(value) => onFormDataChange('berat', value)}
                        width="100%"
                    />
                    <label className="whitespace-nowrap text-gray-400 font-medium" htmlFor="berat-input">
                        kg
                    </label>
                </div>
                {/* Umur */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 md:pl-8">
                    <label className="whitespace-nowrap text-gray-700 font-medium" htmlFor="umur-input">
                        Umur
                    </label>
                    <TextInputField
                        label=""
                        value={formData.umur}
                        onChange={(value) => onFormDataChange('umur', value)}
                        type="number"
                        width="100%"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button 
                onClick={onSubmit}
                className="w-full h-14 bg-gray-800 hover:bg-gray-700 text-[#ffc6c6] font-bold text-lg rounded-2xl mt-8 transition-colors"
            >
                Selanjutnya
            </button>
        </div>
    );
} 