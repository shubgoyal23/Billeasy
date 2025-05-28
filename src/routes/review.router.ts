import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../controllers/review.controller.js";

const router = Router();

// public routes

// secure route
router.route("/").post(verifyJwt, createReview);
router.route("/:id").put(verifyJwt, updateReview);
router.route("/:id").delete(verifyJwt, deleteReview);

export default router;
