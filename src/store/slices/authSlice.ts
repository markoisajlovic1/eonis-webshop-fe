import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Role } from '../../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  role: Role | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  email: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ username: string; email: string; role: Role }>) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.username = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
