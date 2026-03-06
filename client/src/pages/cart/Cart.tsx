import { useCart } from "@/hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
          <ShoppingBag className="w-20 h-20 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-700">
            Your cart is empty
          </h2>
          <p className="text-gray-500">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/"
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const shipping = cart.cartTotal >= 999 ? 0 : 49;
  const tax = Math.round(cart.cartTotal * 0.18 * 100) / 100;
  const grandTotal = cart.cartTotal + shipping + tax;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border p-4 flex gap-4"
              >
                <img
                  src={
                    item.variant?.images?.[0] ||
                    item.product?.gallery?.[0] ||
                    "/placeholder.png"
                  }
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product?._id}`}
                    className="font-semibold text-gray-800 hover:text-indigo-600 transition truncate block"
                  >
                    {item.product?.name}
                  </Link>

                  {item.variant && (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {Object.entries(item.variant.attributes || {}).map(
                        ([key, val]) => (
                          <span
                            key={key}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {key}: {val}
                          </span>
                        ),
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ₹
                        {(
                          (item.variant?.price || 0) * item.quantity
                        ).toLocaleString()}
                      </p>
                      {item.variant?.comparePrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹
                          {(
                            item.variant.comparePrice * item.quantity
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item._id)}
                  className="text-gray-400 hover:text-red-500 transition self-start"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cart.itemCount} items)
                  </span>
                  <span className="font-medium">
                    ₹{cart.cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-medium" : ""
                    }
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-indigo-700">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Add ₹{(999 - cart.cartTotal).toLocaleString()} more for free
                  shipping
                </p>
              )}

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition shadow-md font-semibold"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="mt-2 w-full flex items-center justify-center gap-2 text-gray-600 py-2 hover:text-gray-800 transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
