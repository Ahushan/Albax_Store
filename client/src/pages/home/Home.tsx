import { useEffect, useState } from "react";
import api from "@/api/API";
import { autoBanner, heroIconCards } from "@/data/componentData";
import Slider from "@/components/slider/Slider";
import CategoryIconStrip from "@/components/slider/CategoryIconStrip";
import HorizontalProductList from "@/components/product/HorizontalProductList";
import MainLayout from "@/components/layout/MainLayout";
import { productAdapter } from "@/lib/productAdapter";

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product");

      const list = res.data.products || res.data || [];

      setProducts(list.map(productAdapter));
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <MainLayout>
      <div className="w-full">
        <Slider BannerData={autoBanner} />
        <CategoryIconStrip heroIconCards={heroIconCards} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : products.length > 0 ? (
        <HorizontalProductList products={products} isLoading={loading} />
      ) : (
        <p className="text-center py-16 text-gray-500">
          No products available yet.
        </p>
      )}
    </MainLayout>
  );
};

export default Home;