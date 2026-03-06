import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/api/API";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  gallery: string[];
  baseVariant?: {
    _id: string;
    price: number;
    comparePrice?: number;
    images: string[];
  };
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = searchParams.get("q") || "";
      const { data } = await api.get(`/product?search=${query}`);
      setProducts(data.products || data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-12 pr-4 h-12 rounded-xl bg-white border-gray-200 shadow-sm focus-visible:ring-indigo-500"
            />
          </div>
        </form>

        {searchParams.get("q") && (
          <p className="text-sm text-gray-500 mb-4">
            Showing results for "{searchParams.get("q")}"
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700">
              No products found
            </h2>
            <p className="text-gray-500 mt-1">
              Try adjusting your search or browse categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => {
              const price = product.baseVariant?.price || 0;
              const comparePrice = product.baseVariant?.comparePrice;
              const image =
                product.baseVariant?.images?.[0] ||
                product.gallery?.[0] ||
                "/placeholder.png";
              const discount =
                comparePrice && comparePrice > price
                  ? Math.round(((comparePrice - price) / comparePrice) * 100)
                  : 0;

              return (
                <Link to={`/product/${product._id}`} key={product._id}>
                  <Card className="group border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <CardContent className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1.5 group-hover:text-indigo-600 transition">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          ₹{price.toLocaleString()}
                        </span>
                        {comparePrice && comparePrice > price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Products;
