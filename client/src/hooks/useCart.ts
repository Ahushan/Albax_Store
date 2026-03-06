import { useState, useCallback, useEffect } from "react";
import api from "@/api/API";
import toast from "react-hot-toast";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    gallery: string[];
    isActive: boolean;
  };
  variant: {
    _id: string;
    attributes: Record<string, string>;
    price: number;
    comparePrice?: number;
    stock: number;
    images: string[];
    sku: string;
  } | null;
  quantity: number;
}

interface Cart {
  _id?: string;
  items: CartItem[];
  itemCount: number;
  cartTotal: number;
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    itemCount: 0,
    cartTotal: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } catch {
      /* silent — user may not be logged in */
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (product: string, variant?: string, quantity = 1) => {
    try {
      await api.post("/cart", { product, variant, quantity });
      toast.success("Added to cart");
      await fetchCart();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.patch(`/cart/item/${itemId}`, { quantity });
      await fetchCart();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      toast.success("Removed from cart");
      await fetchCart();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCart({ items: [], itemCount: 0, cartTotal: 0 });
      toast.success("Cart cleared");
    } catch (err: any) {
      toast.error("Failed to clear cart");
    }
  };

  const getCount = async (): Promise<number> => {
    try {
      const { data } = await api.get("/cart/count");
      return data.count;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCount,
  };
}
