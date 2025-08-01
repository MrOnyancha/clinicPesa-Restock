// src/utils/useLoginVerification.ts
import { useMutation } from '@tanstack/react-query';
import { WebService } from '../web-services/WebService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  accountId: string;
  password: string;
}

export const useLoginVerification = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ accountId, password }: LoginFormData) => {
      const loginData = {
        accountId,
        password: password,
        confirmPinCode: '',
      };
    
      const response = await WebService.login(loginData);
    

      if (response.status === 200 && response.data.status === true) {
        const token = response.data.access_token;
        if (!token) throw new Error('No token received');
        Cookies.set('t_k', token, { expires: 7 });
        return response.data;
      } else {
        const message =
          response.data.message?.message ||
          'Too many wrong attempts. Try again later or call 122.';
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success('Login successful!');
      navigate('/dashboard');
    },    
    onError: (error: any) => {
      toast.error(error.message || 'Login failed.');
    },
  });
};
