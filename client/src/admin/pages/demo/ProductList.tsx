import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/API";
import toast from "react-hot-toast";
import {
  Package,
  Tag,
  Layers,
  BoxIcon,
  Loader2,
  RefreshCw,
  Trash2,
  ShoppingCart,
} from "lucide-react";

type Variant = {
  _id: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  images: string[];
  attributes: Record<string, string>;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  gallery: string[];
  subCategoryType?: { _id: string; name: string };
  baseVariant?: Variant;
  isActive: boolean;
  createdAt: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product");
      setProducts(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/demo/product/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-gray-400 text-sm">Loading products...</p>
      </div>
    );
  }

  /* ── Empty State ── */
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <BoxIcon className="w-16 h-16 text-gray-500" />
        <p className="text-gray-400 text-lg">No products found</p>
        <button
          onClick={fetchProducts}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-sm text-gray-400">
              {products.length} product{products.length !== 1 && "s"}
            </p>
          </div>
        </div>

        <button
          onClick={fetchProducts}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition border border-white/10"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ── Product Grid ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDelete={deleteProduct}
            onBuy={(id) => navigate(`/admin/product-details/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({
  product,
  onDelete,
  onBuy,
}: {
  product: Product;
  onDelete: (id: string) => void;
  onBuy: (id: string) => void;
}) {
  const variant = product.baseVariant;

  // Pick the first image from gallery or variant images
  const thumbnail = product.gallery?.[0] || variant?.images?.[0] || null;

  const attributes = variant?.attributes
    ? Object.entries(variant.attributes)
    : [];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Price badge */}
        {variant && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
            ₹{variant.price.toLocaleString()}
          </div>
        )}

        {/* Compare price */}
        {variant?.comparePrice && variant.comparePrice > variant.price && (
          <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
            {Math.round(
              ((variant.comparePrice - variant.price) / variant.comparePrice) *
                100,
            )}
            % OFF
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Name & Brand */}
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Sub Category Type */}
        {product.subCategoryType && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Layers className="w-3.5 h-3.5" />
            <span>{product.subCategoryType.name}</span>
          </div>
        )}

        {/* Variant Attributes */}
        {attributes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {attributes.map(([key, val]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
              >
                <Tag className="w-3 h-3" />
                <span className="font-medium">{key}:</span> {val}
              </span>
            ))}
          </div>
        )}

        {/* Stock & SKU */}
        {variant && (
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span>
              SKU: <span className="font-mono">{variant.sku}</span>
            </span>
            <span
              className={
                variant.stock > 0 ? "text-emerald-600" : "text-red-500"
              }
            >
              {variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onBuy(product._id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl font-medium transition"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Buy Now
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
