
import { apiURL, cpApiUrl, statisticsOrdersUrl } from "./api";
import { useMutation } from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export interface ApiResponse<T = any> {
    status: boolean;
    message: T[];
    result?: T; 
}

const post = async (fullUrl: string, data: any): Promise<ApiResponse | undefined> => {
  try {
    const response = await axios.post(fullUrl, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false,
      timeout: 60000,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timed out after 1 minute. Please try again later.');
    }
    throw new Error(error.message);
  }
};

// export async function postQBXMLData(endpoint = '', data = {}) {
//   const fullUrl = apiURL + endpoint; // e.g. 'http://192.168.1.98:9000/v1/qbxml/sites'
//   return post(fullUrl, data);
// }

export const postCashierData = (url = '', data={}) => useMutation({
  mutationFn: ({ url, data }: { url: string; data: any }) => post(url, data),
});

export async function postAccountData(endpoint = '', data = {}) {
    const fullUrl = cpApiUrl + endpoint;
    return post(fullUrl, data);
}

export async function getData<T = any>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.get(url, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('t_k') || '',
      },
      timeout: 60000,
      withCredentials: false,
    });
    return response.data;
  } catch (error: any) {
    console.error('GET request error:', error);
    throw new Error(error.message || 'Unknown error occurred');
  }
}
