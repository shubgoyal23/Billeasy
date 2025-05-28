// types/express/index.d
import { UserDocument } from "../../models/user.model"; // Update this import path to your actual User type

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // or your correct User type
    }
  }
}
