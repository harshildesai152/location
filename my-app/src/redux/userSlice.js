import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  id: null,
  name: null,
  email: null,
  token: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    clearUser(state) {
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
