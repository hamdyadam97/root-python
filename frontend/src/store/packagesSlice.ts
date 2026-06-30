import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface PackagesState {
  packages: unknown[];
  currentPackage: unknown;
  subscriptions: unknown[];
  loading: boolean;
}

const initialState: PackagesState = {
  packages: [],
  currentPackage: null,
  subscriptions: [],
  loading: false,
};

export const indexData = createAsyncThunk('packages/indexData', async () => {
  const response = await api.get('/packages/data');
  return response.data?.data;
});

export const indexPackages = createAsyncThunk('packages/index', async () => {
  const response = await api.get('/packages/index');
  return response.data?.data;
});

export const getPackage = createAsyncThunk('packages/getPackage', async (id: number) => {
  const response = await api.get(`/packages/${id}/get`);
  return response.data?.data;
});

export const getRelated = createAsyncThunk('packages/getRelated', async (id: number) => {
  const response = await api.get(`/packages/${id}/related`);
  return response.data?.data;
});

export const subscription = createAsyncThunk('packages/subscription', async () => {
  const response = await api.get('/packages/user-subscription');
  return response.data?.data;
});

export const subscribe = createAsyncThunk(
  'packages/subscribe',
  async (payload: Record<string, unknown>) => {
    const response = await api.post('/packages/subscribe', payload);
    return response.data;
  },
);

export const checkCoupon = createAsyncThunk(
  'packages/checkCoupon',
  async (payload: Record<string, unknown>) => {
    const response = await api.post('/packages/check-coupon', payload);
    return response.data;
  },
);

const packagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(indexPackages.fulfilled, (state, action) => {
        state.packages = action.payload?.packages || [];
      })
      .addCase(getPackage.fulfilled, (state, action) => {
        state.currentPackage = action.payload?.package || null;
      })
      .addCase(subscription.fulfilled, (state, action) => {
        state.subscriptions = action.payload?.subscriptions || [];
      });
  },
});

export default packagesSlice.reducer;
