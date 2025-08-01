import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { WebService } from '@/web-services/WebService';
import { toast } from 'sonner';

export default function LockScreen() {
  const [pin, setPin] = useState<string[]>(['', '', '', '', '']);
  const [logIn, setLogIn] = useState(false);
  const [status, setStatus] = useState('ONLINE');
  const [names, setNames] = useState('');
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const accountId = localStorage.getItem('account_id') || '';

  useEffect(() => {
    setNames(localStorage.getItem('names') || '');
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

const submitLockScreen = async () => {
  const password = pin.join('');
  if (password.length !== 5) return setError('Please enter a valid 5-digit PIN');

  try {
    const res = await WebService.login({
      accountId,
      password
    });

    if (res.data.status) {
      // ✅ Unlock session in localStorage
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        currentUser.lock = false;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }

      toast.success('Welcome back to clinicPesa Pharma!');
      
      // ✅ Redirect to dashboard
      navigate('/dashboard');
    } else {
      setError(res.data.message?.message || 'Login failed.');
      setPin(['', '', '', '', '']);
    }
  } catch (err) {
    console.error(err);
    setError('Oops! Something went wrong. Please try again.');
  }
};


  const loginToAnother = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <section
      className="min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: 'url("/images/web-2.png")' }}
    >
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
        <div className="text-center text-xl font-semibold mb-2 text-cyan-600">clinicPesa <b>Restock</b></div>
        <div className="text-sm text-gray-500 text-center mb-4">is now {status}</div>
        {logIn ? (
          <>
            <h3 className="text-center text-lg font-medium text-gray-700 mb-2">{names}</h3>
            <div className="flex justify-center space-x-2 mb-4" id="OTPInput">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="password"
                  className="w-12 h-12 text-center border border-cyan-400 rounded-full focus:outline-none text-lg"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
            <button
              onClick={submitLockScreen}
              className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700"
            >
              Unlock
            </button>
          </>
        ) : (
          <button
            onClick={() => setLogIn(true)}
            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700"
          >
            Unlock
          </button>
        )}

        <div className="flex justify-center items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-center text-sm text-cyan-700 cursor-pointer hover:underline" onClick={loginToAnother}>
          Login to another account
        </p>
      </div>
    </section>
  );
}
