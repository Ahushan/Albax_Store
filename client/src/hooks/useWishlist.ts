import { useState, useCallback, useEffect } from "react";
import api from "@/api/API";
import toast from "react-hot-toast";

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    gallery: string[];
    isActive: boolean;
    baseVariant?: {
      price: number;
      comparePrice?: number;
      images: string[];
    };
  };
  variant?: {
    _id: string;
    attributes: Record<string, string>;
    price: number;
    comparePrice?: number;
    images: string[];
    sku: string;
  };
  createdAt: string;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/wishlist");
      setItems(data.items);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = async (product: string, variant?: string) => {
    try {
      const { data } = await api.post("/wishlist/toggle", { product, variant });
      toast.success(data.message);
      await fetchWishlist();
      return data.wishlisted as boolean;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to toggle wishlist");
      return false;
    }
  };

  const isWishlisted = async (productId: string): Promise<boolean> => {
    try {
      const { data } = await api.get(`/wishlist/check/${productId}`);
      return data.wishlisted;
    } catch {
      return false;
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/wishlist/${id}`);
      toast.success("Removed from wishlist");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      toast.error("Failed to remove");
    }
  };

  const clear = async () => {
    try {
      await api.delete("/wishlist/clear");
      setItems([]);
      toast.success("Wishlist cleared");
    } catch {
      toast.error("Failed to clear wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return { items, loading, fetchWishlist, toggle, isWishlisted, remove, clear };
}
