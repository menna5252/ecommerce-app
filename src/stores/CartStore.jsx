import axios from 'axios';
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  error: null,

  checkOutSession: async (cartId, shippingAddress) => {
    try {
      const token = localStorage.getItem("ecommerce_token");
      const response = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}`,
        { shippingAddress },
        {
          headers: { token },
          params: { url: window.location.origin }
        }
      );

      if (response.data.status === "success") {
        window.location.href = response.data.session.url;
      }
      return response;
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  }
}));