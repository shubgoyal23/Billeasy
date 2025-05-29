import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for User properties
interface IReview {
  authorId: mongoose.Schema.Types.ObjectId;
  authorName: string;
  book: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
}

// Combined Document type with methods
export type ReviewDocument = Document & IReview;

// Mongoose schema
const reviewSchema = new Schema<ReviewDocument>(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    rating: { type: Number },
    comment: { type: String },
  },
  { timestamps: true },
);

// Exporting the model
export const Review: Model<ReviewDocument> =
  mongoose.models.Review ||
  mongoose.model<ReviewDocument>("Review", reviewSchema);
