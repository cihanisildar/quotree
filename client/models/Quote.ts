import { Folder } from "./Folder";
import { User } from "./User";

export interface Quote {
  id: number;
  content: string;
  userId: number;
  user: User;
  folderId: number | null;
  folder?: Folder | null;
  createdAt: Date;
  updatedAt: Date;
}