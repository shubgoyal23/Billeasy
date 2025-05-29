import { Book, BookDocument } from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBook = asyncHandler(async (req, res) => {
  const { title, genre, publishedDate, description } = req.body;

  if (!title || !genre) {
    throw new ApiError(401, "title and genre required to create book");
  }

  // check if book already exists
  const checkBook = await Book.findOne({ title, authorId: req.user?._id });
  if (checkBook) {
    throw new ApiError(403, "Book with same title is already registered");
  }

  // create book
  const book = await Book.create({
    title,
    genre,
    authorId: req.user?._id,
    authorName: req.user?.firstName + " " + req.user?.lastName,
    publishedDate: new Date(publishedDate),
    description,
  });

  // check if book is created
  const checkBookCreated = await Book.findOne({
    title,
    authorId: req.user?._id,
  })?.select("_id title authorId authorName publishedDate description");

  if (!checkBookCreated) {
    throw new ApiError(500, "Book creation failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, checkBookCreated, "Book created successfully"));
});

// get book with reviews by id
const getBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "book id is required");
  }

  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(403, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book fetched successfully"));
});

// get all books
const getBooks = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1 } = req.body;

  const totalRecords = await Book.countDocuments({ active: true });

  const bookWithReviews = await Book.find({
    active: true,
  })
    .limit(parseInt(limit))
    .skip(parseInt(String((page - 1) * limit)));

  if (!bookWithReviews || bookWithReviews.length === 0) {
    throw new ApiError(403, "Books not found");
  }

  const totalPages = Math.ceil(totalRecords / parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        books: bookWithReviews,
        totalPages,
        total: totalRecords,
        page,
        limit,
      },
      "Books fetched successfully",
    ),
  );
});

// search book by title or author
const searchBooks = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { authorName: { $regex: q, $options: "i" } },
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
  const checkBook = await Book.findOne({ _id: id, authorId: req.user?._id });
  if (!checkBook) {
    throw new ApiError(403, "book not found");
  }

  const updateData = {} as BookDocument;

  if (title !== undefined) updateData.title = title;
  if (genre !== undefined) updateData.genre = genre;
  if (publishedDate !== undefined)
    updateData.publishedDate = new Date(publishedDate);
  if (description !== undefined) updateData.description = description;

  // update book
  const book = await Book.findByIdAndUpdate(id, updateData, { new: true });

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
    authorId: req.user?._id,
  });
  if (!delBook) {
    throw new ApiError(403, "Cannot delete book");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Book deleted successfully"));
});

export { createBook, getBook, getBooks, searchBooks, updateBook, deleteBook };
