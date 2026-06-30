import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface ChatState {
  chats: Record<number, { messages: unknown[] }>;
  loading: boolean;
}

const initialState: ChatState = { chats: {}, loading: false };

export const ask = createAsyncThunk(
  'chat/ask',
  async (payload: { question_text: string; selected_answer: string; correct_answer: string; notes?: string }) => {
    const response = await api.post('/chat', payload);
    return response.data?.data;
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    initChat(state, action) {
      const questionId = action.payload;
      if (!state.chats[questionId]) {
        state.chats[questionId] = { messages: [] };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ask.pending, (state) => { state.loading = true; })
      .addCase(ask.fulfilled, (state) => { state.loading = false; })
      .addCase(ask.rejected, (state) => { state.loading = false; });
  },
});

export const { initChat } = chatSlice.actions;
export default chatSlice.reducer;
