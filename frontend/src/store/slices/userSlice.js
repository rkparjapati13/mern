import { createSlice } from '@reduxjs/toolkit';
import * as api from '../../services/index';

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {
    getUsers: (state,actions) => {
      state.users = actions.payload;      
    },
    createUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (User) => User._id === action.payload._id
      );
      state.users[index] = action.payload;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (User) => User._id !== action.payload
      );
    },
    setLoading: (state,actions) => {
      state.loading = actions.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  setLoading,
  setError
} = userSlice.actions;

export default userSlice.reducer;

export const getUsersAsync = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.getusers();
    const data = response?.data;
    dispatch(getUsers(data?.users));
    dispatch(setLoading(false));
  } catch (error) {
    console.log('error', error)
    dispatch(setError(error.message));
  }
};

export const createUserAsync = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.createUser(formData);
    const result = response.data;
    dispatch(createUser(result.user));
    dispatch(setLoading(false));
  } catch (error) {
    console.log('error', error)
    dispatch(setError(error.message));
  }
};

export const deleteUserAsync = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.deleteUser(id);
    dispatch(deleteUser(id));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const updateUserAsync = (id, formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    console.log('formData', formData);
    const response = await api.updateUser(id, formData);
    const result = response.data;
    dispatch(updateUser(result.user));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};