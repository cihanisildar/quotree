import { Folder } from "./Folder";
import { Quote } from "./Quote";
import { Token } from "./Token";

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

enum UserTier {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE",
}
