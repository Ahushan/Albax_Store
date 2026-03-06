import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabLabels } from "@/data/componentData";
import type { Product } from "@/data/types";
import HorizontalProductList from "./HorizontalProductList";
import axios from "axios";

type CategoryTabProductsListProps = {};

const CategoryTabProductsList: React.FC<CategoryTabProductsListProps> = () => {
  const [value, setValue] = useState(tabLabels[0].toLowerCase());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentTabLabel = value;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/products/category/${currentTabLabel}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentTabLabel]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="bg-white p-5 mt-2">
      <div className="container">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h5 className="font-extrabold font-kanit tracking-wide text-2xl text-purple-600 capitalize">
              {currentTabLabel}
            </h5>
          </div>

          {/* SHADCN TABS */}
          <Tabs value={value} onValueChange={setValue} className="w-full sm:w-auto">
            <TabsList className="flex flex-wrap bg-gray-100 rounded-xl p-1">
              {tabLabels.map((label) => (
                <TabsTrigger key={label} value={label.toLowerCase()} className="capitalize">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* HORIZONTAL PRODUCT LIST */}
        <div className="relative max-w-full py-8">
          <HorizontalProductList products={products} />
        </div>
      </div>
    </div>
  );
};

export default CategoryTabProductsList;
