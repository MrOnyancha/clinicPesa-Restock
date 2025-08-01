import { useState } from "react";
import * as Yup from "yup";
import { MdOutlinePhone } from "react-icons/md";

export const PhoneNumberInput = ({ onPhoneNumberSubmit }: { onPhoneNumberSubmit?: (value: string) => void }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    const validationSchema = Yup.object().shape({
        phoneNumber: Yup.string()
            .required('*Phone number is required')
            .test('is-valid-phone', '*Invalid phone number. Please enter a valid MTN Uganda number', (value) => {
                if (!value) return false;
                if (value.startsWith('07')) value = `+2567${value.slice(2)}`;
                return /^\+2567[6789]\d{7}$/.test(value);
            })
    });

    const handlePhoneNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (value.startsWith('07') && value.length > 2) {
            value = `+2567${value.slice(2)}`;
        }

        setPhoneNumber(value);

        try {
            await validationSchema.validate({ phoneNumber: value });
            setError('');
            setStatus('Phone number is valid');

            const phoneNumberWithoutPlus = value.replace('+', '');

            if (onPhoneNumberSubmit) {
                onPhoneNumberSubmit(phoneNumberWithoutPlus);
            }
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                setError(err.message);
                setStatus('');
            }
        }
    };

    return (
        <div>
            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-[#495c67] dark:text-white">
                Enter Your Phone Number
            </label>
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 border rounded-lg transition-all duration-200">
                <MdOutlinePhone data-testid="phone-icon" className="pl-4 h-6 w-16 text-[#495c675b] border-r-2" />
                <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="bg-transparent text-text-color sm:text-sm border-0 outline-none focus:outline-none w-full p-2"
                    style={{
                        boxShadow: 'none',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: '#495c67',
                    }}
                    placeholder="+25677777777"
                    required
                />
            </div>
            {error && (
                <div style={{ color: 'red' }} className="text-xs font-semibold">
                    {error}
                </div>
            )}
            {status && (
                <div style={{ color: 'green' }} className="text-xs font-semibold">
                    {status}
                </div>
            )}
        </div>
    );
};
