import { WebService } from '@/web-services/WebService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const LoginVerification = async (formData: any, navigate: any): Promise<boolean> => {
  try {
    const loginData = {
      ...formData,
      confirmPinCode: '',
    };

    console.log('Login Verification Data:', loginData);

    const response = await WebService.login(loginData);
    console.log('API Response:', response.data);

    if (response.status === 200 && response.data.status === true) {
      const token = response.data.access_token;
      const currentUser = {
        ...response.data,
        token: token?.trim(),
        lock: false,
      };

      if (!token) {
        toast.error('Login failed: No token received.');
        return false;
      }

      // ✅ Set required localStorage values
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('firstName', currentUser.message.firstName);
      localStorage.setItem('lastName', currentUser.message.lastName);
      localStorage.setItem('adsRole', currentUser.message.pharma.role);
      localStorage.setItem('adsStation', currentUser.message.pharma.station.join(','));

      // ✅ Set token in cookies
      Cookies.set('t_k', token.trim(), { expires: 7, path: '/' });

      console.log('✅ Login Success — currentUser:', currentUser);
      toast.success('Login successful!');

      return true;
    } else {
      console.error('Login failed. Response:', response);
      toast.error('Login failed. Please try again.');
      return false;
    }
  } catch (error) {
    console.error('Error in LoginVerification:', error);
    toast.error('An error occurred during login.');
    return false;
  }
};

export default LoginVerification;
