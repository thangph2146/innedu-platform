import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
  id: number | null;
  name: string;
  description: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  credit: number;
  status: string;
  created_at: number;
  updated_at: number;
  last_login_at: number;
  last_login_ip: string;
  affiliate_code: string;
  commission: number;
  role: Role;
}

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
    }
  }
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer; 