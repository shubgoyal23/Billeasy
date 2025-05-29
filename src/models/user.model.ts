import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Interface for User properties
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  picture: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}

// Interface for methods on the User document
interface IUserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

// Combined Document type with methods
export type UserDocument = Document & IUser & IUserMethods;

// Mongoose schema
const userSchema = new Schema<UserDocument>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      validate: {
        validator: (v: string) =>
          /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
        message: (props: any) => `${props.value} is not a valid email address!`,
      },
    },
    password: { type: String, required: true },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: true },
    picture: { type: String },
  },
  { timestamps: true },
);

// Pre-save middleware
userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance methods
userSchema.methods.checkPassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: UserDocument): string {
  return jwt.sign(
    { _id: this._id?.toString(), name: this.firstName },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1d",
    },
  );
};

userSchema.methods.generateRefreshToken = function (
  this: UserDocument,
): string {
  return jwt.sign(
    { _id: this._id?.toString() },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "10d",
    },
  );
};

// Exporting the model
export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
