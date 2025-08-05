interface TextInputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    suffix?: string;
    width?: string; 
}

export default function TextInputField({ 
    label, 
    value, 
    onChange, 
    placeholder = "", 
    type = "text",
    suffix,
    width 
}: TextInputFieldProps) {
    return (
        <div className="space-y-2" style={width ? { width } : undefined}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                {suffix ? (
                    <div className="flex items-center">
                        <span className="text-gray-600 font-bold mr-4">{suffix}</span>
                        <input
                            type={type}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="flex-1 h-12 px-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                            placeholder={placeholder}
                            style={width ? { width } : undefined}
                        />
                    </div>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-12 px-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                        placeholder={placeholder}
                        style={width ? { width } : undefined}
                    />
                )}
            </div>
        </div>
    );
} 