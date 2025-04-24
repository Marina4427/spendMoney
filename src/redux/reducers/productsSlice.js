import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk(
    'get/getProducts',
    async (_, {rejectWithValue}) => {
        try {
            const res = await axios ('https://api.escuelajs.co/api/v1/products/?offset=0&limit=21')

            if (res.status !== 200) {
                throw new Error('Ошибка при получении продуктов')
            }
            return res.data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)


const initialState = {
    products: [],
    error: null,
    status: 'idle'
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'error';
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.status = 'done';
            });
    }
});

export default productsSlice.reducer
