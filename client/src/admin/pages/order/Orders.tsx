import { useEffect, useState } from "react";
import api from "@/api/API";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Save,
  X,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

const statusConfig: Record<string, { color: string; icon: any }> = {
  pending: { color: "bg-amber-50 text-amber-700", icon: Clock },
  confirmed: { color: "bg-blue-50 text-blue-700", icon: CheckCircle2 },
  processing: { color: "bg-indigo-50 text-indigo-700", icon: Package },
  shipped: { color: "bg-purple-50 text-purple-700", icon: Truck },
  delivered: { color: "bg-green-50 text-green-700", icon: CheckCircle2 },
  cancelled: { color: "bg-red-50 text-red-700", icon: XCircle },
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTracking, setEditTracking] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = filterStatus
        ? `/orders/admin/all?page=${page}&status=${filterStatus}`
        : `/orders/admin/all?page=${page}`;
      const { data } = await api.get(query);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus]);

  const handleUpdateStatus = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: editStatus,
        trackingNumber: editTracking || undefined,
      });
      toast.success("Order updated");
      setEditingId(null);
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => {
            setFilterStatus("");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterStatus === ""
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setFilterStatus(s);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              filterStatus === s
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No orders found</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <Card
                key={order._id}
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user?.name} · {order.user?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize inline-flex items-center gap-1 ${config.color}`}
                      >
                        <StatusIcon className="w-3 h-3" /> {order.status}
                      </span>
                      <span className="font-bold text-white">
                        ₹{order.grandTotal?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {order.items?.length} items · Payment:{" "}
                    <span className="capitalize">{order.paymentStatus}</span>
                  </p>

                  {editingId === order._id ? (
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-800 flex-wrap">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Input
                        placeholder="Tracking number"
                        value={editTracking}
                        onChange={(e) => setEditTracking(e.target.value)}
                        className="bg-gray-800 text-white border-gray-700 flex-1 h-9"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order._id)}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-gray-800">
                      <button
                        onClick={() => {
                          setEditingId(order._id);
                          setEditStatus(order.status);
                          setEditTracking(order.trackingNumber || "");
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                      >
                        <RefreshCw className="w-3 h-3" /> Update Status
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                pagination.page === i + 1
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
