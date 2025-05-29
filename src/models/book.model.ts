import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for User properties
interface IBook {
  title: string;
  authorId: mongoose.Schema.Types.ObjectId;
  authorName: string;
  genre: string;
  active: boolean;
  publishedDate: Date;
  description: string;
}

// Combined Document type with methods
export type BookDocument = Document & IBook;

// Mongoose schema
const bookSchema = new Schema<BookDocument>(
  {
    title: { type: String },
    genre: { type: String },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String },
    active: { type: Boolean, default: true },
    publishedDate: { type: Date },
    description: { type: String },
  },
  { timestamps: true },
);

// Exporting the model
export const Book: Model<BookDocument> =
  mongoose.models.Book || mongoose.model<BookDocument>("Book", bookSchema);
