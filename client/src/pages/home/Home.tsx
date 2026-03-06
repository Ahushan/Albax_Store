import { useEffect, useState } from "react";
import api from "@/api/API";
import { autoBanner, heroIconCards } from "@/data/componentData";
import Slider from "@/components/slider/Slider";
import CategoryIconStrip from "@/components/slider/CategoryIconStrip";
import HorizontalProductList from "@/components/product/HorizontalProductList";
import CategoryTabProductsList from "@/components/product/CategoryTabProductsList";
import MainLayout from "@/components/layout/MainLayout";

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/product")
      .then((res) => {
        const list = res.data.products || res.data || [];
        // Map API shape to the Card component shape
        const mapped = list.map((p: any) => ({
          _id: p._id,
          title: p.name || p.title,
          description: p.shortDescription || p.description || "",
          brand: p.brand || "",
          category: p.category || "",
          subCategory: p.subCategory || "",
          price: p.baseVariant?.comparePrice || p.mrp || 0,
          mrp: p.baseVariant?.price || p.price || 0,
          discountPercent:
            p.baseVariant?.comparePrice && p.baseVariant?.price
              ? Math.round(
                  ((p.baseVariant.comparePrice - p.baseVariant.price) /
                    p.baseVariant.comparePrice) *
                    100,
                )
              : p.discountPercent || 0,
          stock: p.baseVariant?.stock || p.stock || 0,
          images: p.gallery || p.images || [],
          thumbnail:
            p.baseVariant?.images?.[0] || p.gallery?.[0] || p.thumbnail || "",
          variants: p.variants || [],
          specifications: p.specifications || [],
          features: p.features || [],
          warranty: p.warranty || "",
          sku: p.baseVariant?.sku || p.sku || "",
          rating: p.rating || 0,
          totalReviews: p.totalReviews || 0,
          isPublished: p.isActive ?? p.isPublished ?? true,
        }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <MainLayout>
        <div className="w-full mt-45">
          <Slider BannerData={autoBanner} />
          <CategoryIconStrip heroIconCards={heroIconCards} />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : products.length > 0 ? (
          <HorizontalProductList isLoading={true} products={products} />
        ) : (
          <p className="text-center py-16 text-gray-500">
            No products available yet.
          </p>
        )}
      </MainLayout>
    </>
  );
};

export default Home;
