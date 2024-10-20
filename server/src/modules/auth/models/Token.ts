import { User } from "../../user/models/User.ts";

export interface Token {
  id: number;
  token: string;
  userId: number;
  user: User;
  expiresAt: Date;
  createdAt: Date;
}