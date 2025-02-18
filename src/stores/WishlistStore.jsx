import { create } from 'zustand';
import axios from 'axios';

export const useWishlistStore = create((set) => ({
  wishlistItems: [],
  isLoading: false,
  error: null,

  addToWishlist: async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/wishlist',
        { productId },
        { headers: { token } }
      );
      if (response.data.status === 'success') {
        set((state) => ({
          wishlistItems: [...state.wishlistItems, response.data.data]
        }));
      }
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  getWishlist: async () => {
    const token = localStorage.getItem('token');
    set({ isLoading: true });
    try {
      const response = await axios.get(
        'https://ecommerce.routemisr.com/api/v1/wishlist',
        { headers: { token } }
      );
      set({ wishlistItems: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeFromWishlist: async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${itemId}`,
        { headers: { token } }
      );
      if (response.data.status === 'success') {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(item => item._id !== itemId)
        }));
      }
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));