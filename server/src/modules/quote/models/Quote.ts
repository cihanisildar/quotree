import { Tag } from "@prisma/client";
import { Folder } from "../../folder/models/Folder.ts";
import { User } from "../../user/models/User.ts";

export interface Quote {
  id: number;
  content: string;
  userId: number;
  user: User;
  folderId: number | null;
  folder?: Folder | null;
  tags?: Tag[];
  createdAt: Date;
  updatedAt: Date;
}