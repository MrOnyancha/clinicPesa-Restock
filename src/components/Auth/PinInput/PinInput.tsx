import { useEffect, useRef } from "react";

interface PinInputProps {
  pin: string;
  setPin: (pin: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ pin, setPin }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;

    const newPin = pin.split('');
    newPin[index] = val;
    setPin(newPin.join(''));

    if (val && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <label className="text-gray-700 font-medium whitespace-nowrap">PIN:</label>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((_, index) => (
          <input
            key={index}
            type="password"
            maxLength={1}
            value={pin[index] || ''}
            onChange={(e) => handleChange(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-10 h-10 text-center border border-gray-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
    </div>
  );
};

export default PinInput;
