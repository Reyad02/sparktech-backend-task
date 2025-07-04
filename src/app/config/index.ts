import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  mongooose_uri: process.env.MONGOOSE_URL,
  port: process.env.PORT,
  saltRounds: process.env.SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration: process.env.JWT_EXPIRED,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  cloudinary_cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_apiKey: process.env.CLOUDINARY_API_KEY,
  cloudinary_secretKey: process.env.CLOUDINARY_SECRET_KEY,
};
