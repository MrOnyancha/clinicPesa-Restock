import Cookies from 'js-cookie';

type AuthHeader = {
  Authorization?: string;
  'Content-Type': string;
  Accept: string;
};

export const authHeader = (): AuthHeader => {
 
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
};
