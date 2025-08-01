import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { WebService } from '../web-services/WebService';
import { CryptoUtils } from '../web-services/cryptoUtils';
import { useNavigate } from 'react-router';

let key = 'locker';
let returnUrl;
let userId;
let isLogin = 'NONE';

// Handle request body encryption and manipulation
const handleBodyIn = (config: InternalAxiosRequestConfig) => {
  let token = '',
    id = '',
    body = '',
    timeStamp = '';
  timeStamp = new Date().getTime().toString().trim();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  // 🛑 Cancel if token is missing and not an /auth call
  if (!currentUser?.token && !['/auth'].includes(config.url?.toLowerCase() || '')) {
    console.warn('🚫 Request blocked: missing token');
    return Promise.reject({
      response: {
        status: 401,
        data: { message: 'Session expired or invalid — please login again' },
      },
    });
  }
  let sk_close;

  if (config.method?.toLowerCase() === 'post' && config.url?.toLowerCase() === '/auth') {
    localStorage.setItem('currentUser', JSON.stringify({ ...currentUser }));
    if (config.headers) {
      const msisdn = config.headers['MSISDN'];
      if (typeof msisdn === 'string') {
        localStorage.setItem('account_id', msisdn.trim());
      }
      sk_close = CryptoUtils.getKey(timeStamp.substring(6) + timeStamp.substring(0, 5) + '256');
      token = CryptoUtils.encrypt(
        typeof config.headers['Authorization'] === 'string' ? config.headers['Authorization'].trim() : '',
        sk_close,
      );
      CryptoUtils.decrypt(token, sk_close);
      isLogin = 'AUTH';
    }
  } else if (config.method?.toLowerCase() === 'put' && config.url?.toLowerCase() === '/auth') {
    if (config.headers) {
      localStorage.setItem('account_id', config.headers['MSISDN']?.trim() || '');
    }
    timeStamp = timeStamp.toString().trim();
    const keyString = timeStamp.substring(6) + timeStamp.substring(0, 5) + '256';
    const sk_close = CryptoUtils.getKey(keyString);
    if (config.data) {
      try {
        const dataString = JSON.stringify(config.data);
        const CryptoUtilsryptedBody = CryptoUtils.encrypt(dataString, sk_close);
        body = CryptoUtilsryptedBody;
      } catch (error) {
        console.error('CryptoUtils encryption/decryption error:', error);
        body = config.data;
      }
    } else {
      body = config.data?.valueOf();
    }
    isLogin = 'REG';
  } else if (currentUser && currentUser.token) {
    isLogin = 'NONE';
    id = localStorage.getItem('account_id')?.toString().trim() || '';
    token = currentUser.token.trim();
    id = id.length < 9 ? localStorage.getItem('account_id')?.toString().trim() || '' : id;
    if (!id) return config;
    sk_close = CryptoUtils.getKey(
      token + timeStamp.substring(6) + id.substring(6) + timeStamp.substring(0, 5) + id.substring(0, 5),
    );

    if (
      config.method?.toLowerCase() === 'post' &&
      config.url?.toLowerCase().startsWith('/api/pharma/')
    ) {
      try {
        const phone = localStorage.getItem('user_phone')?.trim() || '';
        const token = localStorage.getItem('access_token')?.trim() || '';
        const timeStamp = Date.now().toString();

        config.headers['TimeStamp'] = timeStamp;

        // Construct the login string like in Kotlin
        const login = (
          token +
          timeStamp.slice(6) +
          phone.slice(6) +
          timeStamp.slice(0, 5) +
          phone.slice(0, 5)
        ).trim();

        const pass = CryptoUtils.getKey(login);
        const paramsString = JSON.stringify(config.params || {});
        const encryptedParams = CryptoUtils.encrypt(paramsString, pass);

        // Replace original params with encrypted one
        config.params = { data: encryptedParams };

        console.log('Encrypted pharma GET params:', config.params);
      } catch (err) {
        console.error('Error encrypting pharma GET request:', err);
      }
    }
  if (
    config.method?.toLowerCase() === 'get' &&
    config.url?.toLowerCase().startsWith('/api/pharma/')
  ) {
    try {
      config.headers['TimeStamp'] = timeStamp;
      const paramsString = JSON.stringify(config.params || {});
      const encryptedParams = CryptoUtils.encrypt(paramsString, sk_close);

      // Replace original params with encrypted one
      config.params = { data: encryptedParams };
      console.log('Encrypted GET params:', config.params);
    } catch (err) {
      console.error('Error encrypting pharma GET request:', err);
    }
  }
}

if (config.headers) {
  const headers = new AxiosHeaders(config.headers);
  headers.delete('MSISDN');
  headers.set('X-Target-Environment', 'PHARMA');
  headers.set('TimeStamp', timeStamp.trim());
  headers.set('Authorization', token);
  config.headers = headers;
}
console.log('Request Headers:', config.headers);
console.log('Request Body:', body);
return config;
};


// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: 'https://pharma.clinicpesa.com/gateway/action',
  timeout: 300000, // 5 minutes in milliseconds
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const modifiedConfig = handleBodyIn(config); // Using the typed config here
    return modifiedConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('FEEDBACK', response);

    if (response.status === 200) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      let id = localStorage.getItem('account_id')?.toString().trim() || '';
      const timeLock = response.headers['timestamp']?.trim() || '';
      id = id.length < 11 ? localStorage.getItem('account_id')?.toString().trim() || '' : id;
      const key =
        isLogin === 'AUTH'
          ? timeLock.substring(8) + id.substring(8) + timeLock.substring(0, 7) + id.substring(0, 7)
          : isLogin === 'REG'
            ? timeLock.substring(8) + timeLock.substring(0, 7)
            : currentUser.token +
            timeLock.substring(8) +
            id.substring(8) +
            timeLock.substring(0, 7) +
            id.substring(0, 7);
      const sk_open = CryptoUtils.getKey(key);

      if (response.data) {
        const result = CryptoUtils.decrypt(response.data.toString().trim(), sk_open);
        // console.log('Response---yes', result);
        let data = { status: false, message: '', access_token: '' };
        try {
          data = result ? JSON.parse(result.toString()) : ' ';
        } catch (e) {
          console.log('Wrong Json Result.', e);
        }
        if (data.status && data.message && data.access_token) {

          currentUser = {
            ...data,
            token: data.access_token.trim(),
            lock: false,
            access_token: '',
            id: 'id',
          };
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          localStorage.setItem('account_type', currentUser.message.account.trim());
          localStorage.setItem('account_id', currentUser.message.phone.trim());
          // localStorage.setItem(
          //   'facility',
          //   (currentUser.message.account === 'BUSINESS'
          //     ? currentUser.message.facilityMatch.indexOf('ALL') > -1
          //     : false
          //   ).toString(),
          // );
          // Save additional fields you requested
          localStorage.setItem('firstName', currentUser.message.firstName);
          localStorage.setItem('lastName', currentUser.message.lastName);
          localStorage.setItem('adsRole', currentUser.message.pharma.role);
          localStorage.setItem('adsStation', currentUser.message.pharma.station.join(','));
          localStorage.setItem('token', currentUser.token);
          setAccount(currentUser.message.phone.trim());
          response.data = data;
          console.log('Response---yes', response.data);
          response.headers['Content-Type'] = 'application/json';
          const action = localStorage.getItem('action');
          // You need to pass the navigate function from your component when calling setRoutes
          // setRoutes(currentUser.message.account, navigate);
          return response;
        } else {
          response.data = data;
          response.headers['Content-Type'] = 'application/json';
          return response;
        }
      }
    }
    return response;
  },
  // (error) => {
  //   console.log('FEEDBACK Error', error);
  //   if (error.response?.status === 401 || error.response?.status === 403) {
  //     WebService.lockscreen();
  //   } else if (error.response?.status === 400) {
  //     // WebService.logout();
  //     window.location.href = '/login';
  //   }
  //   return Promise.reject(error);
  // },
);

const setAccount = (account: string) => {
  localStorage.setItem('account_id', account.trim());
};
const setRoutes = (acc_type: string, navigate: (path: string) => void) => {
  // const preRegister = '/preFacility';
  // const business = '/business';
  // const facility = '/facility';
  const helloPage = '/admin/dashboard'; // Home page route for 'USER'

  returnUrl =
    acc_type.trim() === 'USER'
      ? helloPage
      : helloPage; // Default to helloPage for other account types

  navigate(returnUrl);
};


export default axiosInstance;
