import { useState } from "react";
import api from "@/api/API";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Trash2, Search, MessageSquare } from "lucide-react";

interface ReviewItem {
  _id: string;
  user: { _id: string; name: string };
  product: { _id: string; name: string; slug: string };
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
}

const AdminReviews = () => {
  const [productId, setProductId] = useState("");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    if (!productId.trim()) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(data.reviews);
    } catch {
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/reviews/admin/${id}`);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>

      {/* Search */}
      <div className="flex gap-3 mb-8 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID..."
            className="pl-10 bg-gray-900 text-white border-gray-800 focus-visible:ring-indigo-500"
          />
        </div>
        <Button
          onClick={fetchReviews}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Fetch
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-900 flex items-center justify-center mb-3">
            <MessageSquare className="w-8 h-8 text-gray-700" />
          </div>
          <p className="text-gray-500">
            {productId
              ? "No reviews found for this product"
              : "Enter a Product ID to view reviews"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card
              key={review._id}
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition"
            >
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    {review.isVerified && (
                      <span className="text-[10px] bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <p className="font-semibold text-sm text-white">
                      {review.title}
                    </p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    By {review.user?.name} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(review._id)}
                  className="text-gray-600 hover:text-red-400 hover:bg-red-900/20 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
