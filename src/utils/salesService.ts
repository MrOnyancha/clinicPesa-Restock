import {WebService} from '@/web-services/WebService'; // adjust import path as needed

export const fetchShiftSales = async () => {
  const accountId = localStorage.getItem('account_id') || '256773294150';
  const tillNo = localStorage.getItem('adsStation') || '100005';
  const siteName = localStorage.getItem('siteName') || 'clinicPesa HQ';

  const payload = {
    request: 'GET_SHIFT_SALES',
    shift: {
      pharmacy: {
        tillNo,
        name: siteName,
      },
      dispenser: {
        accountId,
      },
    },
    filterBy: 'DISPENSER',
  };

  try {
    const response = await WebService.postPharma('ads', payload);
    console.log('Shift Sales Response:', response.data);

    if (response.data && response.data.status) {
      return response.data.message || [];
    } else {
      throw new Error(`API error: ${response.data?.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Fetch shift sales error:', error);
    throw error;
  }
};
