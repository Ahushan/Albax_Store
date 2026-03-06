import mongoose from "mongoose";
import Review from "../../models/review/ReviewModel.js";
import Order from "../../models/order/OrderModel.js";

/* CREATE REVIEW */
export const createReview = async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;

    /* Check if user already reviewed this product */
    const existing = await Review.findOne({
      user: req.user._id,
      product,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    /* Check if user purchased the product (verified review) */
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "items.product": product,
      status: "delivered",
    });

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      title,
      comment,
      isVerified: !!hasPurchased,
    });

    res.status(201).json({ success: true, message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET REVIEWS FOR A PRODUCT */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ product: productId }),
    ]);

    /* Aggregate rating stats */
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      reviews,
      stats: stats[0] || {
        averageRating: 0,
        totalReviews: 0,
        rating5: 0,
        rating4: 0,
        rating3: 0,
        rating2: 0,
        rating1: 0,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET MY REVIEWS */
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("product", "name slug gallery")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE REVIEW */
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found or not yours" });
    }

    const { rating, title, comment } = req.body;
    if (rating) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.json({ success: true, message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE REVIEW */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found or not yours" });
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADMIN: DELETE ANY REVIEW */
export const adminDeleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
