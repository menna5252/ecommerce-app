import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../stores/UserStore";

export const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  
  const token = localStorage.getItem("ecommerce_token");
  const config = {
    headers: { token }
  };

  // Fetch user's wishlist
  const getWishlist = async () => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        config
      );
      setWishlist(data.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        config
      );
      if (data.status === "success") {
        // Update wishlist state directly instead of refetching
        setWishlist(prevWishlist => 
          prevWishlist.filter(item => item._id !== productId)
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // Initial load of wishlist
  useEffect(() => {
    getWishlist();
  }, [user, token]); // Remove getWishlist from dependencies

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Please sign in to view your wishlist</div>
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
      <h2 className="text-3xl font-bold text-center mb-8">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center text-gray-600">
          Your wishlist is empty
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-indigo-600 font-bold">
                    ${product.price}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-gray-600">
                      {product.ratingsAverage}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};