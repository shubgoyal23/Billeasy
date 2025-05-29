import { Book } from "../models/book.model.js";
import { Review, ReviewDocument } from "../models/review.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getReviews = asyncHandler(async (req, res) => {
  let { id, limit = 10, page = 1 } = req.query;
  if (!id) {
    throw new ApiError(401, "review id is required");
  }
  limit = Number(limit);
  page = Number(page);

  const totalRecords = await Review.countDocuments({ book: id });

  const reviews = await Review.find({ book: id })
    .limit(limit)
    .skip((Number(page) - 1) * Number(limit));
  if (!reviews) {
    throw new ApiError(403, "Review not found");
  }

  const totalPages = Math.ceil(totalRecords / limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { reviews, totalPages, total: totalRecords, page, limit },
        "Review fetched successfully",
      ),
    );
});

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

  // check if review already exists
  const checkReview = await Review.findOne({
    book: bookId,
    authorId: req.user?._id,
  });
  if (checkReview) {
    throw new ApiError(403, "Review already exists");
  }

  // create review
  const review = await Review.create({
    book: bookId,
    authorId: req.user?._id,
    authorName: req.user?.firstName + " " + req.user?.lastName,
    rating,
    comment,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review created successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.id;

  if (!reviewId) {
    throw new ApiError(401, "review id required to update review");
  }

  const updateData = {} as ReviewDocument;

  if (rating !== undefined) updateData.rating = rating;
  if (comment !== undefined) updateData.comment = comment;

  // check if review already exists
  const checkReview = await Review.findOneAndUpdate(
    { _id: reviewId, authorId: req.user?._id },
    updateData,
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
  const reviewId = req.params.id;
  if (!reviewId) {
    throw new ApiError(401, "review id required to delete review");
  }

  // check if review already exists
  const checkReview = await Review.findOneAndDelete({
    _id: reviewId,
    authorId: req.user?._id,
  });
  if (!checkReview) {
    throw new ApiError(403, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export { getReviews, createReview, updateReview, deleteReview };
