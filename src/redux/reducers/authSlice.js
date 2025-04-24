import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { clearBasket, loadBasketFromStorage } from "./basketSlice";

export const authUser = createAsyncThunk(
  "post/authUser",
  async (payload, thunkAPI) => {
    try {
      const { user, params } = payload;
      const response = await axios.post(
        `http://localhost:4444/${params}`,
        user
      );

      const { id } = response.data.user;
      localStorage.setItem("userId", id);

      const basketData = localStorage.getItem(`basket_userId_${id}`);
      if (basketData) {
        thunkAPI.dispatch(loadBasketFromStorage(JSON.parse(basketData)));
      } else {
        thunkAPI.dispatch(clearBasket());
      }

      return response.data;
    } catch (err) {
      const errorResponse = err.response?.data;
      let errorMessage = "Something went wrong";

      if (typeof errorResponse === "string") {
        errorMessage = errorResponse;
      } else if (Array.isArray(errorResponse)) {
        errorMessage = errorResponse[0];
      } else if (errorResponse?.message) {
        errorMessage = errorResponse.message;
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.token = null;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.status = "connect";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        localStorage.setItem('userId', user.id);
      });
  },
});

export const { logout, setCredentials, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
