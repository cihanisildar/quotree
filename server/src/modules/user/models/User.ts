import { UserTier } from "@prisma/client";
import { Token } from "modules/auth/models/Token.ts";
import { Folder } from "modules/folder/models/Folder.ts";
import { Quote } from "modules/quote/models/Quote.ts";

export interface User {
  id: number;
  email: string;
  password: string;
  tier: UserTier;
  folders?: Folder[];
  tokens?: Token[];
  quotes?: Quote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  email: string;
  tier: UserTier;
}