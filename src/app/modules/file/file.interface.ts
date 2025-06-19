import { Types } from "mongoose";

export interface IFile {
  name: string;
  user: Types.ObjectId;
  folder: Types.ObjectId;
  isFavorite: boolean;
  size: number;
  type: "note" | "image" | "pdf";
}
