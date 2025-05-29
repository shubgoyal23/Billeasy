import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../controllers/review.controller.js";

const router = Router();

// public routes

// secure route
router.route("/").get(verifyJwt, getReviews);
router.route("/").post(verifyJwt, createReview);
router.route("/:id").patch(verifyJwt, updateReview);
router.route("/:id").delete(verifyJwt, deleteReview);

export default router;
