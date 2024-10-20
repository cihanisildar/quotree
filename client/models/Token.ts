import { User } from "./User";

export interface Token {
  id: number;
  token: string;
  userId: number;
  user: User;
  expiresAt: Date;
  createdAt: Date;
}