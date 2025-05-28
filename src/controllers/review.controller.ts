import { Book } from "../models/book.model.js";
import { Review } from "../models/review.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createReview = asyncHandler(async (req, res) => {
  const { bookId, rating, comment } = req.body;

  if (!bookId || !rating) {
    throw new ApiError(401, "book and rating required to create review");
  }

  // check if book already exists
  const checkBook = await Book.findById(bookId);
  if (!checkBook) {
    throw new ApiError(403, "Book not found");
  }

  // create review
  const review = await Review.create({
    book: bookId,
    author: req.user?._id,
    rating,
    comment,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review created successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { reviewId, rating, comment } = req.body;

  if (!reviewId) {
    throw new ApiError(401, "review id required to update review");
  }

  // check if review already exists
  const checkReview = await Review.findOneAndUpdate(
    { _id: reviewId, author: req.user?._id },
    { rating, comment },
    { new: true },
  );
  if (!checkReview) {
    throw new ApiError(403, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, checkReview, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.body;

  if (!reviewId) {
    throw new ApiError(401, "review id required to delete review");
  }

  // check if review already exists
  const checkReview = await Review.findOneAndDelete({
    _id: reviewId,
    author: req.user?._id,
  });
  if (!checkReview) {
    throw new ApiError(403, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, checkReview, "Review deleted successfully"));
});

export { createReview, updateReview, deleteReview };
