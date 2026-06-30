import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

interface UserData {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  mobile_number?: string;
  dial_code?: string;
  mobile_country_code?: string;
  specialization?: string;
  governorate?: string;
  birth_date?: string;
  image?: string;
  categories?: unknown[];
  sub_categories?: unknown[];
  sub_sub_categories?: unknown[];
  active_subscriptions_count?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface AuthState {
  authenticated: boolean;
  user: UserData;
  loading: boolean;
  isForget: boolean;
  isSendOtp: boolean;
}

const initialState: AuthState = {
  authenticated: !!Cookies.get('token'),
  user: {},
  loading: false,
  isForget: Cookies.get('is_forget') === 'true',
  isSendOtp: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { mobile_number: string; dial_code: string; password: string }) => {
    const response = await api.post('/login', payload);
    return response.data?.data;
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: Record<string, unknown>) => {
    const response = await api.post('/signup', payload);
    return response.data?.data;
  },
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ otp, isForget }: { otp: string; isForget: boolean }, { getState }) => {
    const state = getState() as { auth: AuthState };
    const mobile = state.auth.user?.mobile || Cookies.get('otp_mobile');
    const endpoint = isForget ? '/forget-verify-otp' : '/verify-otp';
    const response = await api.post(endpoint, { mobile, otp });
    return { ...response.data?.data, isForget };
  },
);

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (payload: Record<string, unknown>) => {
    const response = await api.post('/forget', payload);
    return response.data?.data;
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: { password: string; password_confirmation: string }, { getState }) => {
    const state = getState() as { auth: AuthState };
    const mobile = state.auth.user?.mobile || Cookies.get('otp_mobile');
    const response = await api.post('/reset', { ...payload, mobile });
    return response.data?.data;
  },
);

export const getProfileData = createAsyncThunk('auth/getProfileData', async () => {
  const response = await api.get('/get-user-info');
  return response.data?.data;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (form: Record<string, unknown>) => {
    const config = form instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/update-user-info', form, config);
    return response.data?.data;
  },
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (form: Record<string, unknown>) => {
    await api.post('/update-user-password', form);
  },
);

export const resendOtp = createAsyncThunk('auth/resendOtp', async (_, { getState }) => {
  const state = getState() as { auth: AuthState };
  const mobile = state.auth.user?.mobile || Cookies.get('otp_mobile');
  const response = await api.post('/resend-otp', { mobile });
  return response.data?.data;
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await api.post('/logout');
  } catch {
    // ignore
  }
  Cookies.remove('token', { path: '/' });
  Cookies.remove('user', { path: '/' });
  Cookies.remove('is_forget', { path: '/' });
  Cookies.remove('otp_mobile', { path: '/' });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<{ user?: UserData }>) {
      state.user = { ...state.user, ...(action.payload.user || {}) };
    },
    setToken(state, action: PayloadAction<{ token?: string }>) {
      if (action.payload.token) {
        Cookies.set('token', action.payload.token, { sameSite: 'lax', path: '/' });
        state.authenticated = true;
      }
    },
    clearAuth(state) {
      state.authenticated = false;
      state.user = {};
      state.isForget = false;
      state.isSendOtp = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload?.token) {
          Cookies.set('token', action.payload.token, { sameSite: 'lax', path: '/' });
          state.authenticated = true;
        }
        if (action.payload?.user) state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload?.user?.mobile) {
          Cookies.set('otp_mobile', String(action.payload.user.mobile), { sameSite: 'lax', path: '/' });
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        Cookies.set('is_forget', 'true', { sameSite: 'lax', path: '/' });
        state.isForget = true;
        state.isSendOtp = true;
        if (action.payload?.user) state.user = { ...state.user, ...action.payload.user };
        const mobile = action.payload?.user?.mobile;
        if (mobile) Cookies.set('otp_mobile', String(mobile), { sameSite: 'lax', path: '/' });
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        if (action.payload?.token) {
          Cookies.set('token', action.payload.token, { sameSite: 'lax', path: '/' });
          state.authenticated = true;
          state.isForget = false;
          Cookies.remove('otp_mobile', { path: '/' });
          Cookies.remove('is_forget', { path: '/' });
        } else {
          state.isSendOtp = false;
        }
        if (action.payload?.user) state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        if (action.payload?.token) {
          Cookies.set('token', action.payload.token, { sameSite: 'lax', path: '/' });
          state.authenticated = true;
          state.isForget = false;
          state.isSendOtp = false;
          Cookies.remove('otp_mobile', { path: '/' });
          Cookies.remove('is_forget', { path: '/' });
        }
        if (action.payload?.user) state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        if (action.payload?.user) state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload?.user) state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isSendOtp = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authenticated = false;
        state.user = {};
        state.isForget = false;
        state.isSendOtp = false;
      });
  },
});

export const { setUserData, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
