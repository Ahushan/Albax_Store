import { useState, useCallback } from "react";
import api from "@/api/API";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;
}

export function useReviews(productId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(
    async (page = 1) => {
      if (!productId) return;
      try {
        setLoading(true);
        const { data } = await api.get(
          `/reviews/product/${productId}?page=${page}`,
        );
        setReviews(data.reviews);
        setStats(data.stats);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    },
    [productId],
  );

  const createReview = async (review: {
    product: string;
    rating: number;
    title?: string;
    comment?: string;
  }) => {
    try {
      await api.post("/reviews", review);
      toast.success("Review submitted!");
      await fetchReviews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    }
  };

  const updateReview = async (
    id: string,
    updates: { rating?: number; title?: string; comment?: string },
  ) => {
    try {
      await api.put(`/reviews/${id}`, updates);
      toast.success("Review updated");
      await fetchReviews();
    } catch (err: any) {
      toast.error("Failed to update review");
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return {
    reviews,
    stats,
    loading,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
  };
}
