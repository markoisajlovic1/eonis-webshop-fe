import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Role } from '../../types/auth';
import { authService, CLAIMS } from '../../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  email: string | null;
  role: Role | null;
  initializing: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  username: null,
  email: null,
  role: null,
  initializing: true,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const token = await authService.refreshToken();
  authService.setToken(token);
  const decoded = authService.getUserFromToken();
  if (!decoded) throw new Error('Invalid token');
  return {
    userId: (decoded[CLAIMS.ID] as string) ?? '',
    username: (decoded[CLAIMS.NAME] as string) ?? '',
    email: (decoded[CLAIMS.EMAIL] as string) ?? '',
    role: authService.getRole()!,
  };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ userId: string; username: string; email: string; role: Role }>) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.username = null;
      state.email = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.initializing = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.initializing = false;
      });
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
