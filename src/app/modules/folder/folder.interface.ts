import { Types } from "mongoose";

export interface IFOlder {
  name: string;
  user: Types.ObjectId;
  isSecure: boolean;
}
