import { Quote } from "./Quote";
import { User } from "./User";


export interface Folder {
  id: number;
  name: string;
  userId: number;
  user: User;
  parentId: number | null;
  parent?: Folder | null;
  subFolders?: Folder[];
  quotes?: Quote[];
  createdAt: Date;
  updatedAt: Date;
}