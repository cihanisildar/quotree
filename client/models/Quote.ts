import { Folder } from "./Folder";
import { Tag } from "./Tag";
import { User } from "./User";

export interface Quote {
  id: number;
  content: string;
  userId: number;
  user: User;
  folderId: number | null;
  folder?: Folder | null;
  tags? : Tag[];
  createdAt: Date;
  updatedAt: Date;
}