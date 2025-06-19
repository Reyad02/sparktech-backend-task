import { model, Schema } from "mongoose";
import { IFile } from "./file.interface";

const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    folder: { type: Schema.Types.ObjectId, ref: "folder", required: true },
    isFavorite: { type: Boolean, default: false },
    size: { type: Number, required: true },
    type: { type: String, enum: ["image", "pdf", "note"], required: true },
  },
  { timestamps: true }
);

const fileModel = model("file", fileSchema);
export default fileModel;
