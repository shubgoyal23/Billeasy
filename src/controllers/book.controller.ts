import mongoose from "mongoose";
import { Book } from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBook = asyncHandler(async (req, res) => {
  const { title, genre, publishedDate, description } = req.body;

  if (!title || !genre) {
    throw new ApiError(401, "title and genre required to create book");
  }

  // check if book already exists
  const checkBook = await Book.findOne({ title, author: req.user?._id });
  if (checkBook) {
    throw new ApiError(403, "Book with same title is already registered");
  }

  // create book
  const book = await Book.create({
    title,
    genre,
    author: req.user?._id,
    publishedDate: new Date(publishedDate),
    description,
  });

  // check if book is created
  const checkBookCreated = await Book.findOne({
    title,
    author: req.user?._id,
  })?.select("_id title author publishedDate description");

  if (!checkBookCreated) {
    throw new ApiError(500, "Book creation failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, checkBookCreated, "Book created successfully"));
});

// get book with reviews by id
const getBook = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0 } = req.body;
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "book id is required");
  }

  const bookWithReviews = await Book.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "Review",
        let: { bookId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$book", "$$bookId"] } } },
          { $sort: { createdAt: -1 } },
          { $skip: parseInt(offset) },
          { $limit: parseInt(limit) },
        ],
        as: "reviews",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        genre: 1,
        author: {
          _id: "$author._id",
          firstName: "$author.firstName",
          lastName: "$author.lastName",
        },
        publishedDate: 1,
        description: 1,
        reviews: 1,
      },
    },
  ]);

  if (!bookWithReviews || bookWithReviews.length === 0) {
    throw new ApiError(403, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, bookWithReviews, "Book fetched successfully"));
});

// get all books
const getBooks = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0 } = req.body;

  const bookWithReviews = await Book.aggregate([
    {
      $match: {
        active: true,
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $limit: parseInt(limit),
    },
    {
      $skip: parseInt(offset),
    },
    {
      $project: {
        _id: 1,
        title: 1,
        genre: 1,
        author: {
          _id: "$author._id",
          firstName: "$author.firstName",
          lastName: "$author.lastName",
        },
        publishedDate: 1,
        description: 1,
      },
    },
  ]);

  if (!bookWithReviews || bookWithReviews.length === 0) {
    throw new ApiError(403, "Books not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, bookWithReviews, "Books fetched successfully"));
});

// search book by title or author
const searchBooks = asyncHandler(async (req, res) => {
  const { search } = req.body;

  const books = await Book.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { genre: { $regex: search, $options: "i" } },
    ],
  });

  if (!books || books.length === 0) {
    throw new ApiError(403, "Books not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, books, "Books fetched successfully"));
});

const updateBook = asyncHandler(async (req, res) => {
  const { id, title, genre, publishedDate, description } = req.body;

  if (!id) {
    throw new ApiError(401, "book id is required");
  }

  // check if book already exists
  const checkBook = await Book.findOne({ _id: id, author: req.user?._id });
  if (!checkBook) {
    throw new ApiError(403, "book not found");
  }

  // update book
  const book = await Book.findByIdAndUpdate(
    id,
    {
      title,
      genre,
      author: req.user?._id,
      publishedDate: new Date(publishedDate),
      description,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book updated successfully"));
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(401, "book id is required");
  }

  // find and delete book
  const delBook = await Book.findOneAndDelete({
    _id: id,
    author: req.user?._id,
  });
  if (!delBook) {
    throw new ApiError(403, "Cannot delete book");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, delBook, "Book deleted successfully"));
});

export { createBook, getBook, getBooks, searchBooks, updateBook, deleteBook };
