import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postQBXMLData } from '@/services/httphandler';
import { toast } from 'sonner';
import { ADSData, ADSResponse } from '@/utils/types';
import { WebService } from '@/web-services/WebService';

interface ADSState {
  adsList: ADSData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ADSState = {
  adsList: [],
  isLoading: false,
  error: null,
};

export const fetchADSList = createAsyncThunk('ads/fetchList', async (_, { rejectWithValue }) => {
  // const loadingToast = toast.loading('Fetching ADS data...');

  try {
    const requestBody = {
      request: 'GET_ADS',
    };

    const response = await WebService.postPharma('ads', requestBody);
    const adsResponse = response as unknown as ADSResponse;

    // toast.dismiss(loadingToast);

    if (adsResponse?.status && Array.isArray(adsResponse.message)) {
      // toast.success('ADS data fetched successfully!');
      return adsResponse.message;
    } else {
      toast.error('Failed to fetch ADS data.');
      return rejectWithValue('Invalid response format or empty ADS list');
    }
  } catch (error) {
    // toast.dismiss(loadingToast);
    toast.error('Failed to fetch ADS data.');
    return rejectWithValue('Failed to fetch ADS data');
  }
});

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setADSList: (state, action: PayloadAction<ADSData[]>) => {
      state.adsList = action.payload;
    },
    clearADSError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchADSList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchADSList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adsList = action.payload;
      })
      .addCase(fetchADSList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setADSList, clearADSError } = adsSlice.actions;

export default adsSlice;
