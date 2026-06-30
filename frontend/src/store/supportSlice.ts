import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface SupportState {
  loading: boolean;
}

const initialState: SupportState = { loading: false };

export const sendContact = createAsyncThunk(
  'support/sendContact',
  async (payload: Record<string, unknown>) => {
    const response = await api.post('/contactus', payload);
    return response.data;
  },
);

export const sendSupport = createAsyncThunk(
  'support/sendSupport',
  async (payload: Record<string, unknown>) => {
    const response = await api.post('/support', payload);
    return response.data;
  },
);

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendContact.pending, (state) => { state.loading = true; })
      .addCase(sendContact.fulfilled, (state) => { state.loading = false; })
      .addCase(sendContact.rejected, (state) => { state.loading = false; });
  },
});

export default supportSlice.reducer;
