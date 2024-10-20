import { Folder } from "../../folder/models/Folder.ts";
import { User } from "../../user/models/User.ts";

export interface Quote {
  id: number;
  content: string;
  // width: number;
  // height: number;
  // backgroundImage: string | null;
  userId: number;
  user: User;
  folderId: number | null;
  folder?: Folder | null;
  createdAt: Date;
  updatedAt: Date;
}