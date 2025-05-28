import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./db/connectDb.js";
import { ApiResponse } from "./utils/ApiResposne.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(";") || "*",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use((req, res, next) => {
  connectDb()
    .then(() => next())
    .catch(() =>
      res.status(500).json(new ApiResponse(500, {}, "Internal Server Error")),
    );
});

import { errorHandler } from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.router.js";
import bookRouter from "./routes/book.router.js";
import reviewRouter from "./routes/review.router.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(errorHandler);

export { app };
