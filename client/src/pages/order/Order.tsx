import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  PackageOpen,
  Sparkles,
} from "lucide-react";

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  confirmed: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  processing: { icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
  shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
  delivered: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

const Order = () => {
  const { orders, loading, pagination, fetchMyOrders, cancelOrder } =
    useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders(1);
  }, []);

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

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500">
              {pagination?.total || 0} total orders
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <PackageOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here.
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon;

              return (
                <Card
                  key={order._id}
                  className="border shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${config.bg} ${config.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span className="capitalize">{order.status}</span>
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{order.grandTotal?.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mb-3">
                      #{order.orderNumber}
                    </p>

                    {/* Item thumbnails */}
                    <div className="flex items-center gap-2 mb-4">
                      {order.items?.slice(0, 4).map((item: any, i: number) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border"
                        >
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
                      ))}
                      {order.items?.length > 4 && (
                        <span className="text-xs text-gray-400 font-medium">
                          +{order.items.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition"
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {["pending", "confirmed"].includes(order.status) && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="text-xs text-red-500 hover:text-red-600 transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchMyOrders(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      pagination.page === i + 1
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Order;
