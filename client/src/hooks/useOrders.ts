import { useState, useCallback } from "react";
import api from "@/api/API";
import toast from "react-hot-toast";

interface OrderItem {
  product: { _id: string; name: string; slug: string; gallery: string[] };
  variant?: { _id: string; attributes: Record<string, string>; sku: string };
  name: string;
  image?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Record<string, string>;
  paymentMethod: string;
  paymentStatus: string;
  itemsTotal: number;
  shippingCost: number;
  tax: number;
  grandTotal: number;
  status: string;
  trackingNumber?: string;
  createdAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchMyOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/me?page=${page}`);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    } catch {
      toast.error("Failed to load order");
      return null;
    }
  };

  const createOrder = async (orderData: {
    items: Array<{
      product: string;
      variant?: string;
      name: string;
      image?: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: Record<string, string>;
    paymentMethod?: string;
    notes?: string;
  }): Promise<Order | null> => {
    try {
      const { data } = await api.post("/orders", orderData);
      toast.success("Order placed successfully!");
      return data.order;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to place order");
      return null;
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      await api.patch(`/orders/${id}/cancel`);
      toast.success("Order cancelled");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o)),
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  return {
    orders,
    loading,
    pagination,
    fetchMyOrders,
    getOrderById,
    createOrder,
    cancelOrder,
  };
}
