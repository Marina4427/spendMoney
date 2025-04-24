import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import productsSlice from './reducers/productsSlice';
import basketSlice, { loadBasketFromStorage } from './reducers/basketSlice';
import { rememberEnhancer, rememberReducer } from "redux-remember";

const rememberKeys = ['auth'];

const store = configureStore({
  reducer: rememberReducer({
    auth: authSlice,
    products: productsSlice,
    basket: basketSlice
  }),
  enhancers: (getDefaultEnhancers) => [
    ...getDefaultEnhancers(),
    rememberEnhancer(
      window.localStorage,
      rememberKeys,
      { persistWholeStore: true }
    )
  ]
});

const loadUserBasket = () => {
  try {
    const state = store.getState();
    const userId = state.auth?.user?.id;

    if (userId) {
      const basketJSON = localStorage.getItem(`basket_userId_${userId}`);
      if (basketJSON) {
        const parsed = JSON.parse(basketJSON);
        store.dispatch(loadBasketFromStorage(parsed));
      }
    }
  } catch (err) {
    console.warn("Ошибка загрузки корзины:", err);
  }
};

// ⏳ Подгружаем корзину после инициализации стора
setTimeout(loadUserBasket, 0);

store.subscribe(() => {
  const state = store.getState();
  const userId = state.auth?.user?.id;

  if (userId) {
    try {
      localStorage.setItem(
        `basket_userId_${userId}`,
        JSON.stringify(state.basket.basket)
      );
    } catch (err) {
      console.warn("Ошибка при сохранении корзины:", err);
    }
  }
});

export default store;
