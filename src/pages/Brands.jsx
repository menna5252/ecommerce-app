import { useEffect, useState } from "react";
import axios from "axios";

export const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/brands"
        );
        setBrands(response.data.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Our Brands</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-1 aspect-h-1 mb-4">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-32 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">{brand.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {brand.slug.replace(/-/g, ' ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};