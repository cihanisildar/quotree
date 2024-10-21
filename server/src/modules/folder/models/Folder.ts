import { Quote } from "modules/quote/models/Quote.ts";
import { User } from "modules/user/models/User.ts";

export interface Folder {
  id: number;
  name: string;
  userId: number;
  user: User;
  parentId: number | null;
  parent?: Folder | null;
  subFolders: Folder[]; 
  quotes?: Quote[];
  createdAt: Date;
  updatedAt: Date;
}