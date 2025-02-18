import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { useCartStore } from '../stores/CartStore';
import { useFormik } from 'formik'; // Add this import

export const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false); // Add this state
  const [showForm, setShowForm] = useState(false); // Add this state
  const { user } = useUserStore();
  const navigate = useNavigate(); // Add this hook
  const { checkOutSession } = useCartStore();
  
  const token = localStorage.getItem("ecommerce_token");
  const config = {
    headers: { token }
  };

  // Get cart items
  const getCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        config
      );
      setCart(data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        config
      );
      setCart(data.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Update product quantity
  const updateQuantity = async (productId, count) => {
    try {
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        config
      );
      setCart(data.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        config
      );
      setCart(data.data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await axios.delete(
        "https://ecommerce.routemisr.com/api/v1/cart",
        config
      );
      setCart(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleCheckOutSession = async (values) => {
    try {
      setOrderLoading(true);
      
      if (!cart?._id) {
        throw new Error('No cart ID found');
      }

      await checkOutSession(cart._id, {
        details: values.details,
        phone: values.phone,
        city: values.city
      });
      
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setOrderLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: "",
    },
    onSubmit: handleCheckOutSession,
  });

  // Update createOrder function
  const createOrder = () => {
    setShowForm(true); // Show the form instead of immediate checkout
  };

  useEffect(() => {
    if (user && token) {
      getCart();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Please sign in to view your cart</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Shopping Cart</h2>
        {cart?.products?.length > 0 && (
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        )}
      </div>

      {!cart?.products?.length ? (
        <div className="text-center text-gray-600">Your cart is empty</div>
      ) : (
        <div className="space-y-4">
          {cart.products.map((item) => (
            <div
              key={item._id}
              className="flex items-center bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.product.imageCover}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.product.title}</h3>
                <p className="text-indigo-600 font-bold">${item.price}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.count - 1)}
                    disabled={item.count <= 1}
                    className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.count}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.count + 1)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-8 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center text-xl font-semibold">
              <span>Total:</span>
              <span>${cart.totalCartPrice}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={createOrder}
                disabled={orderLoading}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {orderLoading ? "Processing..." : "Make Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white rounded-lg p-4 flex flex-col items-center max-w-md w-full mx-4"
          >
            <h2 className="text-lg font-bold mb-4 text-green-600">
              Checkout Session
            </h2>
            <div className="mb-4 flex flex-col gap-3 w-full">
              <input
                {...formik.getFieldProps("details")}
                type="text"
                placeholder="Details"
                className="w-full p-2 border rounded-lg border-gray-300"
              />
              <input
                {...formik.getFieldProps("phone")}
                type="tel"
                placeholder="Phone"
                className="w-full p-2 border rounded-lg border-gray-300"
              />
              <input
                {...formik.getFieldProps("city")}
                type="text"
                placeholder="City"
                className="w-full p-2 border rounded-lg border-gray-300"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
 