import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/API";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  Package,
  Tag,
  Layers,
  ShoppingCart,
  Check,
} from "lucide-react";

type Variant = {
  _id: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  images: string[];
  attributes: Record<string, string>;
  isDefault: boolean;
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

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        const { product: prod, variants: vars } = res.data;
        setProduct(prod);
        setVariants(vars);

        // Select the default variant or the first one
        const defaultVar =
          vars.find((v: Variant) => v.isDefault) || vars[0] || null;
        setSelectedVariant(defaultVar);

        // Set initial image
        const firstImage = defaultVar?.images?.[0] || prod.gallery?.[0] || null;
        setSelectedImage(firstImage);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  /* ── When variant changes, update the selected image ── */
  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    const firstImage = variant.images?.[0] || product?.gallery?.[0] || null;
    setSelectedImage(firstImage);
  };

  /* ── Get all images for current view ── */
  const getAllImages = (): string[] => {
    const variantImages = selectedVariant?.images || [];
    const galleryImages = product?.gallery || [];
    // Combine: variant images first, then gallery (deduplicated)
    const combined = [...variantImages];
    galleryImages.forEach((img) => {
      if (!combined.includes(img)) combined.push(img);
    });
    return combined;
  };

  /* ── Get unique attribute keys across all variants ── */
  const getAttributeKeys = (): string[] => {
    const keys = new Set<string>();
    variants.forEach((v) => {
      Object.keys(v.attributes || {}).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  };

  /* ── Get unique values for a given attribute key ── */
  const getAttributeValues = (key: string): string[] => {
    const values = new Set<string>();
    variants.forEach((v) => {
      const val = v.attributes?.[key];
      if (val) values.add(val);
    });
    return Array.from(values);
  };

  /* ── Find variant matching selected attributes ── */
  const findVariantByAttributes = (
    attrKey: string,
    attrValue: string,
  ): Variant | undefined => {
    // Build target attributes: current selected + new pick
    const targetAttrs = { ...(selectedVariant?.attributes || {}) };
    targetAttrs[attrKey] = attrValue;

    return variants.find((v) => {
      const vAttrs = v.attributes || {};
      return Object.entries(targetAttrs).every(([k, val]) => vAttrs[k] === val);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-gray-400 text-sm">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Package className="w-16 h-16 text-gray-500" />
        <p className="text-gray-400 text-lg">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-emerald-400 hover:text-emerald-300 text-sm underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const allImages = getAllImages();
  const attributeKeys = getAttributeKeys();
  const discount =
    selectedVariant?.comparePrice &&
    selectedVariant.comparePrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.comparePrice - selectedVariant.price) /
            selectedVariant.comparePrice) *
            100,
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </button>

      {/* ── Main Content ── */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ── LEFT: Images ── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden aspect-square flex items-center justify-center">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <Package className="w-24 h-24 text-gray-200" />
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product Info ── */}
        <div className="space-y-6">
          {/* Category badge */}
          {product.subCategoryType && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium">
              <Layers className="w-3 h-3" />
              {product.subCategoryType.name}
            </div>
          )}

          {/* Name & Brand */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-gray-400 mt-1">by {product.brand}</p>
            )}
          </div>

          {/* Price */}
          {selectedVariant && (
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">
                ₹{selectedVariant.price.toLocaleString()}
              </span>
              {selectedVariant.comparePrice &&
                selectedVariant.comparePrice > selectedVariant.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{selectedVariant.comparePrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">
                      {discount}% OFF
                    </span>
                  </>
                )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* ── Variant Selectors ── */}
          {attributeKeys.length > 0 && (
            <div className="space-y-5 pt-2">
              {attributeKeys.map((attrKey) => {
                const values = getAttributeValues(attrKey);
                const currentValue =
                  selectedVariant?.attributes?.[attrKey] || "";

                return (
                  <div key={attrKey} className="space-y-2.5">
                    <label className="text-sm font-medium text-gray-300">
                      {attrKey}:{" "}
                      <span className="text-white font-semibold">
                        {currentValue}
                      </span>
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {values.map((val) => {
                        const isSelected = currentValue === val;
                        const matchingVariant = findVariantByAttributes(
                          attrKey,
                          val,
                        );
                        const isAvailable = !!matchingVariant;

                        return (
                          <button
                            key={val}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => {
                              if (matchingVariant)
                                handleVariantSelect(matchingVariant);
                            }}
                            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                              isSelected
                                ? "bg-white text-gray-900 border-white shadow-lg"
                                : isAvailable
                                  ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
                                  : "bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed opacity-50"
                            }`}
                          >
                            {val}
                            {isSelected && (
                              <Check className="inline-block w-3.5 h-3.5 ml-1.5 -mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stock & SKU */}
          {selectedVariant && (
            <div className="flex items-center gap-4 text-sm pt-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedVariant.stock > 0
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                {selectedVariant.stock > 0
                  ? `${selectedVariant.stock} in stock`
                  : "Out of stock"}
              </span>
              <span className="text-gray-500">
                SKU:{" "}
                <span className="font-mono text-gray-400">
                  {selectedVariant.sku}
                </span>
              </span>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex gap-3 pt-4">
            <button
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>

          {/* ── All Variants Table ── */}
          {variants.length > 1 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-400">
                All Variants ({variants.length})
              </h3>
              <div className="space-y-2">
                {variants.map((v) => {
                  const attrs = Object.entries(v.attributes || {});
                  const isActive = selectedVariant?._id === v._id;

                  return (
                    <button
                      key={v._id}
                      onClick={() => handleVariantSelect(v)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border ${
                        isActive
                          ? "bg-white/15 border-emerald-500/50 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {v.images?.[0] && (
                          <img
                            src={v.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {attrs.map(([k, val]) => (
                            <span
                              key={k}
                              className="inline-flex items-center gap-1 text-xs"
                            >
                              <Tag className="w-3 h-3 text-gray-500" />
                              <span className="font-medium">{k}:</span> {val}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ₹{v.price.toLocaleString()}
                        </div>
                        <div
                          className={`text-xs ${v.stock > 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {v.stock > 0 ? `${v.stock} left` : "Sold out"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
