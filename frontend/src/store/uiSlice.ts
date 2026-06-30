import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AuthModalView = 'login' | 'signup';

interface UIState {
  loginModalOpen: boolean;
  authModalView: AuthModalView;
}

const initialState: UIState = {
  loginModalOpen: false,
  authModalView: 'login',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openLoginModal(state) {
      state.loginModalOpen = true;
      state.authModalView = 'login';
    },
    openSignupModal(state) {
      state.loginModalOpen = true;
      state.authModalView = 'signup';
    },
    closeLoginModal(state) {
      state.loginModalOpen = false;
    },
    setAuthModalView(state, action: PayloadAction<AuthModalView>) {
      state.authModalView = action.payload;
    },
  },
});

export const { openLoginModal, openSignupModal, closeLoginModal, setAuthModalView } = uiSlice.actions;
export default uiSlice.reducer;
