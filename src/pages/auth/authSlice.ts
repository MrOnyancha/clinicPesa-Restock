import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserProfile } from '@/utils/types';
import { WebService } from '@/web-services/WebService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export type LoginFormData = {
  accountId: string;
  password: string;
  [key: string]: any;
};

export type LoginResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

// API response user data will be used instead of a dummy user

type AuthState = {
  user: User | null;
  userProfile: UserProfile | null; // Store the complete user profile data with proper typing
};

// Initialize the user from localStorage if available
const getUserFromLocalStorage = (): User | null => {
  try {
    const storedRole = localStorage.getItem('userRole');
    const storedStation = localStorage.getItem('station');

    if (storedRole) {
      // Ensure we convert the role to uppercase to match the User type definition
      // Valid roles from User type
      const validRoles = [
        'IT',
        'DISPENSER',
        'ADMIN',
        'SUPERVISOR',
        'RESTOCKING',
        'RECONCILIATION',
        'DELIVERY',
        'MANAGER',
      ];

      // Convert stored role to uppercase and validate
      const normalizedRole = storedRole.toUpperCase();

      // Check if the normalized role is valid
      if (validRoles.includes(normalizedRole)) {
        console.log('Loading user from localStorage with role:', normalizedRole);
        return {
          role: normalizedRole as User['role'], // Type assertion to satisfy TypeScript
          active: true,
          station: storedStation ? JSON.parse(storedStation) : [],
          ads: true,
        };
      } else {
        console.warn('Invalid role found in localStorage:', storedRole);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

// Try to get the stored user profile from localStorage
const getUserProfileFromLocalStorage = (): UserProfile | null => {
  try {
    const storedProfile = localStorage.getItem('userProfile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error('Error loading user profile from localStorage:', error);
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromLocalStorage(),
  userProfile: getUserProfileFromLocalStorage(),
};

export interface RootState {
  auth: AuthState;
}

export const loginUser = createAsyncThunk<LoginResponse, LoginFormData, { rejectValue: LoginResponse }>(
  'auth/loginUser',
  async (formData: LoginFormData, { rejectWithValue }) => {
    try {
      const loginData = {
        accountId: formData.accountId,
        password: formData.password,
      };

      // console.log('Login Verification Data:', loginData);

      const response = await WebService.login(loginData);
      // console.log('API Response:', response.data);

      if (response.status === 200) {
        if (response.data.status === true) {
          // Set the t_k cookie with the access_token
          const token = response.data.access_token;
          if (!token) {
            toast.error('Login failed: No token received.');
            return rejectWithValue({
              success: false,
              error: 'No token received',
              data: response.data,
            });
          }

          // Extract the complete user profile data
          const userProfileData = response.data.message;
          if (!userProfileData) {
            toast.error('Login failed: User profile data not found in response.');
            return rejectWithValue({
              success: false,
              error: 'User profile data not found',
              data: response.data,
            });
          }
          
          // Extract user authentication details from the ads field
          const userData = userProfileData.ads;
          if (!userData) {
            toast.error('Login failed: User authentication details not found in response.');
            return rejectWithValue({
              success: false,
              error: 'User authentication details not found',
              data: response.data,
            });
          }
          
          // Store the complete user profile in localStorage for persistence
          localStorage.setItem('userProfile', JSON.stringify(userProfileData));

          Cookies.set('t_k', token, { expires: 7 }); // Expires in 7 days
          toast.success('Login successful!');
          return {
            success: true,
            data: {
              ...response.data,
              user: userData,
              userProfile: userProfileData,
            },
          };
        } else {
          const errorMessage =
            response.data.message?.message ||
            'Sorry, Your pin has temporarily been suspended due to too many wrong attempts. You can try again in approximately 11 Hours 59 Minutes 59 Seconds or Call 122 for Assistance.';
          toast.error(errorMessage);
          return rejectWithValue({
            success: false,
            error: errorMessage,
            data: response.data,
          });
        }
      } else {
        console.error('Login failed. Response:', response);
        toast.error('Login failed. Please try again.');
        return rejectWithValue({
          success: false,
          error: 'Login failed',
          data: response.data,
        });
      }
    } catch (error) {
      console.error('Error in loginUser:', error);
      toast.error('An error occurred during login.');
      return rejectWithValue({
        success: false,
        error: 'An error occurred during login',
        data: null,
      });
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserType: (state, action: PayloadAction<User['role']>) => {
      // Always convert role to uppercase to ensure consistency with User type
      const role = action.payload.toUpperCase() as User['role'];

      if (state.user) {
        state.user.role = role;
        console.log('Auth Slice - Role Updated:', role);
      } else {
        console.log('Auth Slice - No user found, creating a minimal user with role');
        // Create a minimal user with just the role when no user exists
        state.user = {
          role: role,
          active: true,
          station: [],
          ads: true,
        };
      }

      // Always update localStorage when role changes
      localStorage.setItem('userRole', role);
      console.log('Updated localStorage with new role:', role);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        // You can add loading state here if needed
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.data?.user) {
          // Set the user directly from the API response
          const userData = action.payload.data.user;

          // Ensure the user data has the required properties
          state.user = {
            role: userData.role,
            active: userData.active !== undefined ? userData.active : true,
            station: userData.station || [],
            ads: userData.ads !== undefined ? userData.ads : true,
            // Add any other properties that might be in the API response
            ...userData,
          };

          // Store the complete user profile data
          if (action.payload.data?.userProfile) {
            state.userProfile = action.payload.data.userProfile;
            console.log('User profile set from API');
          }

          console.log('User set from API:', state.user);

          // Store user info in localStorage if needed
          localStorage.setItem('userRole', state.user.role);
          localStorage.setItem('station', JSON.stringify(state.user.station || []));
        } else {
          console.error('No user data in login response');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        // Handle rejected state if needed
        state.user = null;
      });
  },
});

export const { logout, setUser, setUserType } = authSlice.actions;

export const selectUser = (state: RootState) => state?.auth?.user;
export const selectUserType = (state: RootState) => state?.auth?.user?.role;
export const selectUserProfile = (state: RootState) => state?.auth?.userProfile;

export default authSlice.reducer;
