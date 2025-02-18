import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import axios from "axios";
import ProductCard from "../pages/Product";
import MainSlider from "../components/MainSlider";
import CategorySlider from "../components/CategorySlider";
import { useUserStore } from "../stores/UserStore";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await axios.get("https://ecommerce.routemisr.com/api/v1/products");
        setProducts(productsRes.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  function handleFuseSearch() {
    if (!products) return;

    const fuseOptions = {
      keys: ["category.name", "title"],
      threshold: 0.3,
    };

    const fuse = new Fuse(products, fuseOptions);

    if (searchTerm) {
      const results = fuse.search(searchTerm);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults(products);
    }
  }

  useEffect(() => {
    handleFuseSearch();
  }, [searchTerm, products]);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="my-10">
        <MainSlider />
      </div>

      <div className="my-12  rounded-xl py-10 px-4 bg-gray-100">
        <CategorySlider />
      </div>
      <div className="w-full pb-5 text-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          className="border rounded px-60 py-2 "
        />
        {searchTerm && searchResults.length === 0 && (
          <p>No products found matching {searchTerm}</p>
        )}
      </div>

      {error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : isLoading ? (
        <div className="text-center">
          <h2>Loading products...</h2>
        </div>
      ) : (
        <>
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-gray-100 my-7">
            {(searchTerm ? searchResults : products).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </>
  );
}