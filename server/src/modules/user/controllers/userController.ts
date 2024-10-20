import { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';
import { UserTier } from '@prisma/client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.createUser(email, password, UserTier.BASIC);
      const token = this.generateToken(user.id);
      res.status(201).json({ user: { id: user.id, email: user.email, tier: user.tier }, token });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user || !(await userService.validatePassword(user, password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = this.generateToken(user.id);
      res.json({ user: { id: user.id, email: user.email, tier: user.tier }, token });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ id: user.id, email: user.email, tier: user.tier });
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { email, password } = req.body;
      const updatedUser = await userService.updateUser(userId, { email, password });
      res.json({ id: updatedUser.id, email: updatedUser.email, tier: updatedUser.tier });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      await userService.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  }

  async updateTier(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { tier } = req.body;

      if (!Object.values(UserTier).includes(tier)) {
        return res.status(400).json({ error: "Invalid tier provided" });
      }

      const updatedUser = await userService.updateUser(userId, { tier });
      res.json({ id: updatedUser.id, email: updatedUser.email, tier: updatedUser.tier });
    } catch (error) {
      res.status(500).json({ error: "Failed to update tier" });
    }
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  }
}