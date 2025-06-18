import { model, Schema } from "mongoose";
import { IFOlder } from "./folder.interface";

const folderSchema = new Schema<IFOlder>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    isSecure: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const folder = model("folder", folderSchema);
export default folder;
