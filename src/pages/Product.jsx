import { useState } from "react";
import { FaHeart, FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useCartStore } from '../stores/CartStore';
import { useWishlistStore } from "../stores/WishlistStore";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToWishlist, wishlistItems } = useWishlistStore();
  const addProductToCart = useCartStore(state => state.addToCart);
  
  const isWished = wishlistItems.some((item) => item._id === product?._id);

  async function handleAddProductToCart(id) {
    try {
      setIsLoading(true);
      const res = await addProductToCart(id);
      toast.success(res.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  async function handleAddProductToWishList(id) {
    try {
      const res = await addToWishlist(id);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="overflow-hidden group bg-white rounded p-3 hover:shadow-md hover:shadow-green-600">
      <Link to={`/productdetails/${product?._id}/${product?.category._id}`}>
        <img
          className="w-full md:h-52 object-cover object-center"
          src={product?.imageCover}
          alt=""
        />
        <span className="text-green-600">{product?.category.name}</span>
        <h2 className="text-base font-semibold mb-3">
          {product?.title.split(" ", 2).join(" ")}
        </h2>
        <div className="flex justify-between">
          <span>{product?.price} EGP</span>
          <span>
            {product?.ratingsAverage}{" "}
            <FaStar className="inline-block text-yellow-400" />
          </span>
        </div>
      </Link>
      <div className="cart-wish flex justify-between items-center">
        <button
          disabled={isLoading}
          onClick={() => handleAddProductToCart(product?._id)}
          className="btn-green w-full mt-2 translate-y-28 group-hover:translate-y-0 transition-all duration-500"
        >
          {isLoading ? "Loading ..." : "Add Product"}
        </button>
        <button onClick={() => handleAddProductToWishList(product?._id)}>
          <FaHeart
            className={`text-2xl ${isWished ? "text-red-600" : "text-green-600"}`}
          />
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageCover: PropTypes.string,
    category: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string
    }),
    title: PropTypes.string,
    price: PropTypes.number,
    ratingsAverage: PropTypes.number
  }).isRequired
};