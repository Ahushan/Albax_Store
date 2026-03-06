import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "@/api/API";
import toast from "react-hot-toast";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { useOrders } from "@/hooks/useOrders";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowRight,
  Banknote,
  BadgeCheck,
} from "lucide-react";

interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI Payment", icon: BadgeCheck },
];

const Checkout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingForm>();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createOrder } = useOrders();
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const buyProductId = searchParams.get("product");
  const buyVariantId = searchParams.get("variant");
  const buyQty = Number(searchParams.get("qty") || 1);
  const [singleProduct, setSingleProduct] = useState<any>(null);

  useEffect(() => {
    if (buyProductId) {
      api
        .get(`/product/${buyProductId}`)
        .then((res) => setSingleProduct(res.data))
        .catch(() => toast.error("Failed to load product"));
    }
  }, [buyProductId]);

  const items = singleProduct
    ? [
        {
          product: singleProduct._id,
          variant: buyVariantId || undefined,
          quantity: buyQty,
          price:
            singleProduct.variants?.find((v: any) => v._id === buyVariantId)
              ?.price ||
            singleProduct.baseVariant?.price ||
            0,
          name: singleProduct.name,
          image:
            singleProduct.baseVariant?.images?.[0] ||
            singleProduct.gallery?.[0],
        },
      ]
    : cart.items?.map((item: any) => ({
        product: item.product?._id,
        variant: item.variant?._id,
        quantity: item.quantity,
        price: item.variant?.price || item.price || 0,
        name: item.product?.name,
        image: item.variant?.images?.[0] || item.product?.gallery?.[0],
      })) || [];

  const subtotal = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 79;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const onSubmit = async (formData: ShippingForm) => {
    if (items.length === 0) {
      toast.error("No items to checkout");
      return;
    }

    const order = await createOrder({
      items,
      shippingAddress: formData as unknown as Record<string, string>,
      paymentMethod,
    });

    if (order) {
      if (!singleProduct) await clearCart();
      navigate(`/orders/${order._id}`, { replace: true });
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left — shipping + payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-500" /> Shipping
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Input
                        className="h-11 bg-gray-50/50"
                        {...register("fullName", {
                          required: "Name is required",
                        })}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <Input
                        className="h-11 bg-gray-50/50"
                        {...register("phone", {
                          required: "Phone is required",
                        })}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <Input
                      className="h-11 bg-gray-50/50"
                      {...register("address", {
                        required: "Address is required",
                      })}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        City
                      </label>
                      <Input
                        className="h-11 bg-gray-50/50"
                        {...register("city", {
                          required: "City is required",
                        })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        State
                      </label>
                      <Input
                        className="h-11 bg-gray-50/50"
                        {...register("state", {
                          required: "State is required",
                        })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Pincode
                      </label>
                      <Input
                        className="h-11 bg-gray-50/50"
                        {...register("pincode", {
                          required: "Pincode is required",
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-500" /> Payment
                    Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          paymentMethod === method.id
                            ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="accent-indigo-600"
                        />
                        <Icon
                          className={`w-5 h-5 ${
                            paymentMethod === method.id
                              ? "text-indigo-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {method.label}
                        </span>
                      </label>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right — summary */}
            <div>
              <Card className="border-0 shadow-lg sticky top-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-800">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> Shipping
                      </span>
                      <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax (18%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-xl text-indigo-600">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        Place Order <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure & encrypted
                    checkout
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
