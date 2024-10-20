// src/controllers/authController.ts

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserService } from "../../user/services/userService.ts";
import * as tokenService from "../services/tokenService.ts";

const userService = new UserService();

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await userService.getUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const authToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );

      const refreshToken = await tokenService.generateRefreshToken(user.id);

      // Store refresh token in database
      await tokenService.createToken(
        user.id,
        refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      );

      res.cookie("qf_auth_token", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
        path: "/",
      });
      res.cookie("qf_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.qf_refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    try {
      const user = await tokenService.verifyRefreshToken(refreshToken);

      const newAuthToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );

      res.cookie("qf_auth_token", newAuthToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      // Set a custom header to indicate that a refresh occurred
      res.setHeader("X-Auth-Refreshed", "true");

      return res.json({
        message: "Token refreshed successfully",
        authToken: newAuthToken,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("qf_auth_token");
      res.clearCookie("qf_refresh_token");
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async status(req: Request, res: Response) {
    console.log("Headers:", req.headers);
    console.log("Cookie header:", req.headers.cookie);
    console.log("All cookies:", req.cookies);
    console.log("Auth token from cookies:", req.cookies.qf_auth_token);

    const authToken = req.cookies.qf_auth_token;

    if (!authToken) {
      return res.json({ isLoggedIn: false });
    }

    try {
      // Verify the auth token
      jwt.verify(authToken, process.env.JWT_SECRET as string);

      // If verification is successful, the user is logged in
      return res.json({ isLoggedIn: true });
    } catch (error) {
      console.error("Token verification failed:", error);
      // If token verification fails, the user is not logged in
      return res.json({ isLoggedIn: false });
    }
  }
  
  async checkRefresh(req: Request, res: Response) {
    // The X-Auth-Refreshed header will be set by the refresh function
    const wasRefreshed = req.headers['x-auth-refreshed'] === 'true';
  
    res.json({ refreshed: wasRefreshed });
  }
}

export default new AuthController();
