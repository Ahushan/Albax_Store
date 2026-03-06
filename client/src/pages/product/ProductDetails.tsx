import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/API";
import ProductImages from "@/components/product/ProductImages";
import VariantSelector from "@/components/product/VariantSelector";
import ProductSpecs from "@/components/product/ProductSpecs";
import ReviewSection from "@/components/product/ReviewSection";
import { Product } from "@/data/types";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/context/provider/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  ShoppingCart,
  Share2,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import toast from "react-hot-toast";

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggle, isWishlisted: checkWishlisted } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/product/${productId}`, {
          signal: controller.signal,
        });
        const dataProduct: Product = res.data.product ?? res.data;
        setProduct(dataProduct);
        setSelectedVariantIndex(0);
      } catch (err: any) {
        if (err.code !== "ERR_CANCELED") {
          setError("Failed to load product.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [productId]);

  useEffect(() => {
    if (productId && user) {
      checkWishlisted(productId).then(setWishlisted);
    }
  }, [productId, user]);

  const handleBuyNow = () => {
    navigate(
      `/checkout?buy=${productId}&qty=${qty}&var=${selectedVariantIndex}`,
    );
  };

  const handleAddToCart = async () => {
    if (!product || !product._id) return;
    if (!user) {
      navigate("/login");
      return;
    }
    const variant = product.variants?.[selectedVariantIndex] as any;
    await addToCart(product._id, variant?._id, qty);
  };

  const handleToggleWishlist = async () => {
    if (!productId) return;
    if (!user) {
      navigate("/login");
      return;
    }
    const result = await toggle(productId);
    setWishlisted(result);
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </>
    );

  if (!product)
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
          Product not found
        </div>
        <Footer />
      </>
    );

  const selectedVariant = product.variants?.[selectedVariantIndex];
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayMrp = selectedVariant?.mrp ?? product.mrp;
  const discountPercent = displayMrp
    ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
    : (product.discountPercent ?? 0);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <span
            className="hover:text-gray-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          {" / "}
          <span
            className="hover:text-gray-600 cursor-pointer"
            onClick={() => navigate("/products")}
          >
            {product.category}
          </span>
          {" / "}
          <span className="text-gray-800 font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Images */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-4">
                <ProductImages
                  images={
                    selectedVariant?.images?.length
                      ? selectedVariant.images
                      : product.images
                  }
                  alt={product.title}
                />
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              {product.brand && (
                <p className="text-sm text-gray-500 mt-1">
                  Brand:{" "}
                  <span className="text-indigo-600 font-medium">
                    {product.brand}
                  </span>
                </p>
              )}
            </div>

            {/* Price */}
            <Card className="border-0 bg-linear-to-r from-indigo-50 to-purple-50 shadow-sm">
              <CardContent className="p-4 flex items-end gap-4">
                <span className="text-3xl font-bold text-indigo-700">
                  ₹{displayPrice?.toLocaleString()}
                </span>
                {displayMrp && displayMrp > displayPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{displayMrp.toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-lg font-bold">
                    {discountPercent}% OFF
                  </span>
                )}
              </CardContent>
            </Card>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Choose Variant
                </h3>
                <VariantSelector
                  variants={product.variants}
                  selectedIndex={selectedVariantIndex}
                  onSelect={(idx) => {
                    setSelectedVariantIndex(idx);
                    setQty(1);
                  }}
                />
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleAddToCart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-indigo-200"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                onClick={handleBuyNow}
                className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl px-6 h-12 shadow-lg shadow-orange-200"
              >
                <Zap className="w-5 h-5 mr-2" />
                Buy Now
              </Button>

              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                className={`rounded-xl h-12 px-5 ${
                  wishlisted
                    ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${
                    wishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {wishlisted ? "Wishlisted" : "Wishlist"}
              </Button>

              <Button
                variant="ghost"
                className="rounded-xl h-12"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Truck className="w-4 h-4 text-indigo-500" />
                Free shipping over ₹999
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Genuine product
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                Easy returns
              </div>
            </div>

            <Separator />

            {/* Specs */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Specifications
              </h2>
              <ProductSpecs
                specifications={product.specifications}
                features={product.features ?? []}
                warranty={product.warranty}
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        {productId && (
          <div className="mt-12">
            <ReviewSection productId={productId} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
