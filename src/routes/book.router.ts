import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  searchBooks,
  updateBook,
} from "../controllers/book.controller.js";

const router = Router();

// public routes
router.route("/").get(getBooks);
router.route("/search").get(searchBooks);
router.route("/:id").get(getBook);

// secure route
router.route("/").post(verifyJwt, createBook);
router.route("/").patch(verifyJwt, updateBook);
router.route("/").delete(verifyJwt, deleteBook);

export default router;
