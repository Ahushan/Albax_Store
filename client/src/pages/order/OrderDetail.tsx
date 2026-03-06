import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  ArrowLeft,
  Hash,
} from "lucide-react";

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, cancelOrder } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderById(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="text-center py-20">
          <p className="text-gray-500">Order not found</p>
          <Button variant="link" onClick={() => navigate("/orders")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const currentStepIndex =
    order.status === "cancelled"
      ? -1
      : statusSteps.findIndex((s) => s.key === order.status);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        {/* Order header */}
        <Card className="border-0 shadow-lg bg-linear-to-r from-indigo-500 to-purple-600 text-white mb-8">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" /> {order.orderNumber}
                </p>
                <p className="text-2xl font-bold mt-1">
                  ₹{order.grandTotal?.toLocaleString()}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-sm font-bold px-4 py-1.5 rounded-full capitalize ${
                  order.status === "cancelled"
                    ? "bg-red-500/20 text-red-200"
                    : order.status === "delivered"
                      ? "bg-green-500/20 text-green-200"
                      : "bg-white/20 text-white"
                }`}
              >
                {order.status}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Status timeline */}
        {order.status !== "cancelled" && (
          <Card className="mb-8 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isActive = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center gap-2 flex-1 relative"
                    >
                      {i > 0 && (
                        <div
                          className={`absolute top-4 -left-1/2 w-full h-0.5 ${
                            i <= currentStepIndex
                              ? "bg-indigo-500"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition ${
                          isCurrent
                            ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                            : isActive
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isActive ? "text-indigo-600" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Items */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" /> Items (
                {order.items?.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden border shrink-0">
                    <img
                      src={
                        item.variant?.images?.[0] ||
                        item.image ||
                        "/placeholder.svg"
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping + Payment */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" /> Shipping
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 font-medium">
                  {order.shippingAddress?.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  {order.shippingAddress?.address}
                </p>
                <p className="text-sm text-gray-500">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  - {order.shippingAddress?.pincode}
                </p>
                <p className="text-sm text-gray-500">
                  📞 {order.shippingAddress?.phone}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>
                    {order.shippingCharge === 0
                      ? "FREE"
                      : `₹${order.shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>₹{order.tax?.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-indigo-600">
                    ₹{order.grandTotal?.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 capitalize mt-2">
                  Method: {order.paymentMethod} ·{" "}
                  <span className="capitalize">{order.paymentStatus}</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {["pending", "confirmed"].includes(order.status) && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={async () => {
                await cancelOrder(order._id);
                setOrder({ ...order, status: "cancelled" });
              }}
            >
              <XCircle className="w-4 h-4 mr-2" /> Cancel Order
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;
