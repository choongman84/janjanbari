import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import wishlistReducer from './features/wishlistSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        auth: authReducer
    }
});