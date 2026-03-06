import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ShoppingCart, Sparkles, HeartOff } from "lucide-react";

const Wishlist = () => {
  const { items, loading, fetchWishlist, remove, clear } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-sm text-gray-500">
                {items.length} saved items
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 flex items-center justify-center mb-4">
              <HeartOff className="w-10 h-10 text-pink-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Save products you love to buy them later.
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-linear-to-r from-pink-500 to-rose-600 text-white rounded-xl shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Explore Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {items.map((item: any) => {
              const product = item.product || item;
              const image =
                product.baseVariant?.images?.[0] ||
                product.gallery?.[0] ||
                "/placeholder.svg";
              const price = product.baseVariant?.price || 0;
              const comparePrice = product.baseVariant?.comparePrice;

              return (
                <Card
                  key={item._id}
                  className="group border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </Link>
                    <button
                      onClick={() => remove(item._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <CardContent className="p-3 space-y-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="font-semibold text-sm text-gray-800 hover:text-indigo-600 transition line-clamp-2"
                    >
                      {product.name}
                    </Link>

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

                    <Button
                      size="sm"
                      onClick={() => addToCart(product._id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
