import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basket: [],
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      console.log("Payload:", action.payload);
      if (state.basket.some((item) => item.id === action.payload.id)) {
        state.basket = state.basket.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, count: item.count + 1 };
          }
          return item;
        });
      } else {
        state.basket = [
          ...state.basket,
          {
            ...action.payload,
            count: 1,
          },
        ];
      }
    },
    removeProduct: (state, action) => {
      const finder = state.basket.find((item) => item.id === action.payload.id);
      if (finder.count > 1) {
        state.basket = state.basket.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, count: item.count - 1 };
          }
          return item;
        });
      } else {
        state.basket = state.basket.filter(
          (item) => item.id !== action.payload.id
        );
      }
    },
    clearBasket: (state) => {
      state.basket = [];
    },
    loadBasketFromStorage: (state, action) => {
      state.basket = action.payload;
    }
  },
});

export const { addProduct, removeProduct, clearBasket, loadBasketFromStorage  } = basketSlice.actions;
export default basketSlice.reducer;
