import { useEffect, useState } from "react";
import { useAuth } from "@/context/provider/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, MessageSquare, Send, ThumbsUp, User } from "lucide-react";

interface Props {
  productId: string;
}

const ReviewSection = ({ productId }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { reviews, stats, loading, fetchReviews, createReview, deleteReview } =
    useReviews(productId);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (rating === 0) return;

    setSubmitting(true);
    await createReview({
      product: productId,
      rating,
      title,
      comment,
    });
    setRating(0);
    setTitle("");
    setComment("");
    setSubmitting(false);
    fetchReviews();
  };

  // Distribution for star chart
  const totalReviews = reviews?.length || 0;
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r: any) => r.rating === star).length || 0,
  }));
  const avgRating =
    stats?.averageRating ||
    (totalReviews
      ? (
          reviews.reduce((a: number, r: any) => a + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0");

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Customer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Summary */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-gray-900">{avgRating}</div>
            <div className="flex justify-center md:justify-start mt-2 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(Number(avgRating))
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">{totalReviews} reviews</p>
          </div>

          {/* Distribution */}
          <div className="space-y-2">
            {starCounts.map((item) => (
              <div key={item.star} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-6">{item.star}★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: totalReviews
                        ? `${(item.count / totalReviews) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Write review */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">
              Write a Review
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`w-6 h-6 transition cursor-pointer ${
                        s <= (hoverRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Review title"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 resize-none"
              />
              <Button
                type="submit"
                disabled={submitting || rating === 0}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg"
              >
                {submitting ? (
                  <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1" />
                ) : (
                  <Send className="w-3.5 h-3.5 mr-1" />
                )}
                Submit Review
              </Button>
            </form>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Reviews list */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-5">
            {reviews.map((review: any) => (
              <div key={review._id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {review.user?.name?.charAt(0)?.toUpperCase() || (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-gray-800">
                      {review.user?.name}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {review.isVerified && (
                      <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                        <ThumbsUp className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <p className="text-sm font-medium text-gray-700">
                      {review.title}
                    </p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-gray-500 mt-1">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
