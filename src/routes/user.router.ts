import { Router } from "express";
import {
  registeruser,
  loginUser,
  logoutUser,
  currentUser,
  refreshToken,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// public routes
router.route("/signup").post(registeruser);
router.route("/login").post(loginUser);
router.route("/renew").get(refreshToken);

// secure route
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/current").get(verifyJwt, currentUser);

export default router;
