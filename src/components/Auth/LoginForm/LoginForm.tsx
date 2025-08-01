import React, { useState, useEffect, useRef } from 'react';
import { PhoneNumberInput } from '../PhoneNumberInput/PhoneNumberInput';
import PinInput  from '../PinInput/PinInput';
import Loader from '../../Loader/Loader';
import { handlePhoneNumberVerification } from '../../../utils/phoneNumberVerification'; // Your phone verification function
import { toast } from 'react-toastify';

interface LoginFormProps {
  isLoading: boolean;
  handleSubmit: (formData: { accountId: string; password: string }) => void; // Modify handleSubmit to accept form data
}

const LoginForm: React.FC<LoginFormProps> = ({ isLoading, handleSubmit }) => {
  const [pin, setPin] = useState<string>('');
  const [pinVisible, setPinVisible] = useState<boolean>(false);
  const [accountId, setPhoneNumber] = useState<string>(''); // State to store phone number
  
  // Use the handlePhoneNumberVerification hook here
  const { mutate: verifyPhone, isPending: isVerifyingPhone } = handlePhoneNumberVerification({
    phoneNumber: accountId, // Pass the phone number to the hook
    onSuccessVerify: () => {
      setPinVisible(true); // Show PIN input upon success
    },
    onFailVerify: (message: string) => {
      setPinVisible(false); // Hide PIN input upon failure
      toast.error(message); // Show error message
    },
  });

  // Reference to the PIN input for focusing
  const pinInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (pinVisible && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [pinVisible]);

  // Handle phone number submit
  const handlePhoneNumberSubmit = async (accountId: string) => {
    try {
      setPinVisible(false); // Hide PIN input while verifying
      setPhoneNumber(accountId); // Set phone number
      verifyPhone(accountId); // Start verification process
    } catch (err) {
      console.error('Error verifying phone number:', err);
    }
  };

  // Handle form submit (phone number and pin)
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Submitting login form:");
    console.log("Phone Number (accountId):", accountId);
    console.log("Password (PIN):", pin);
  
    handleSubmit({ accountId, password: pin });
  };
  

  return (
    <form onSubmit={onFormSubmit} className="space-y-4 md:space-y-6">
      <PhoneNumberInput onPhoneNumberSubmit={handlePhoneNumberSubmit} />

      {isVerifyingPhone && (
        <div className="flex items-center gap-1">
          <Loader size={16} color="text-text-color" />
          <p className="text-xs text-gray-500 font-medium">Verifying phone number...</p>
        </div>
      )}

      {!isVerifyingPhone && pinVisible && (
        <div>
          <PinInput pin={pin} setPin={setPin} />
        </div>
      )}

      {/* Conditional button rendering */}
      <button
        type="submit"
        disabled={isLoading || !pinVisible}
        className={`w-full text-white rounded-lg px-5 py-2.5 ${pinVisible ? 'bg-[#00bed7] hover:bg-[#00bed7cc]' : 'bg-[#00bed7]/50 cursor-not-allowed'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader />
            Signing in...
          </span>
        ) : (
          'Sign in to your account'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
