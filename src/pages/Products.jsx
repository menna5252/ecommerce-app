import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../stores/UserStore";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  
  const token = localStorage.getItem("ecommerce_token");
  const config = { headers: { token } };

  // Fetch products and wishlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, wishlistRes] = await Promise.all([
          axios.get("https://ecommerce.routemisr.com/api/v1/products"),
          user ? axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", config) : null
        ]);

        setProducts(productsRes.data.data);
        if (wishlistRes) {
          setWishlist(wishlistRes.data.data.map(item => item._id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleWishlist = async (e, productId) => {
    e.preventDefault(); // Prevent navigation
    if (!user) return;

    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, config);
        setWishlist(wishlist.filter(id => id !== productId));
      } else {
        await axios.post("https://ecommerce.routemisr.com/api/v1/wishlist", { productId }, config);
        setWishlist([...wishlist, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault(); // Prevent navigation
    if (!user) return;

    try {
      await axios.post("https://ecommerce.routemisr.com/api/v1/cart", { productId }, config);
      // You might want to show a success message here
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="relative group">
            <Link to={`/products/${product._id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
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
                  {product.priceAfterDiscount && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 line-through mr-2">
                        ${product.price}
                      </span>
                      <span className="text-sm text-green-600">
                        ${product.priceAfterDiscount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button
                onClick={(e) => handleWishlist(e, product._id)}
                className={`p-2 rounded-full ${
                  wishlist.includes(product._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-400'
                } shadow hover:scale-110 transition-transform`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={wishlist.includes(product._id) ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => handleAddToCart(e, product._id)}
                className="p-2 rounded-full bg-white text-gray-400 shadow hover:scale-110 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add new export for single product page
export const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img src={product.imageCover} alt={product.title} className="w-full rounded-lg" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-2xl font-bold text-indigo-600 mb-4">
            ${product.price}
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};