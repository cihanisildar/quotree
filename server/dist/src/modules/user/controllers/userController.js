// src/modules/user/controllers/userController.ts
import { UserService } from "../services/userService.ts";
import { createToken, deleteToken, generateRefreshToken, } from "../../auth/services/tokenService.ts";
import { UserTier } from "../models/User.ts";
import jwt from "jsonwebtoken";
const userService = new UserService();
const JWT_SECRET = process.env.JWT_SECRET;
export class UserController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.createUser(email, password, UserTier.BASIC);
            const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: "15m",
            }); // Set shorter expiration for auth token
            const refreshToken = generateRefreshToken(user.id); // Generate refresh token
            // Store the refresh token in your database (if applicable)
            await createToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Store with 7 days expiry
            res.cookie("qf_auth_token", authToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            res.cookie("qf_refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res
                .status(201)
                .json({ user: { id: user.id, email: user.email, tier: user.tier } });
        }
        catch (error) {
            res.status(400).json({ error: "Registration failed" });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.getUserByEmail(email);
            if (!user || !(await userService.validatePassword(user, password))) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: "15m",
            }); // Set shorter expiration for auth token
            const refreshToken = generateRefreshToken(user.id); // Generate refresh token
            // Store the refresh token in your database (if applicable)
            await createToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Store with 7 days expiry
            res.cookie("qf_auth_token", authToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            res.cookie("qf_refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.json({ user: { id: user.id, email: user.email, tier: user.tier } });
        }
        catch (error) {
            res.status(500).json({ error: "Login failed" });
        }
    }
    async logout(req, res) {
        try {
            const refreshToken = req.cookies.qf_refresh_token;
            if (refreshToken) {
                await deleteToken(refreshToken);
                res.clearCookie("qf_refresh_token");
            }
            res.clearCookie("qf_auth_token");
            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (error) {
            console.error("Logout error:", error);
            res.status(500).json({ error: "Logout failed" });
        }
    }
    async getProfile(req, res) {
        console.log("getProfile function called");
        console.log(req.cookies.qf_auth_token);
        try {
            console.log("Request user:", req.user);
            const userId = req.user?.id;
            if (!userId) {
                console.log("No user ID found");
                return res
                    .status(401)
                    .json({ error: "Unauthorized: No user ID found" });
            }
            console.log("Fetching user with ID:", userId);
            const user = await userService.getUserProfileById(userId);
            console.log("User object:", user);
            if (!user) {
                console.log("User not found");
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ id: user.id, email: user.email, tier: user.tier });
        }
        catch (error) {
            console.error("Failed to get profile:", error);
            res.status(500).json({ error: "Failed to get profile" });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user.id; // Assuming middleware sets user
            const { email, password } = req.body;
            const updatedUser = await userService.updateUser(userId, {
                email,
                password,
            });
            res.json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update profile" });
        }
    }
    async deleteAccount(req, res) {
        try {
            const userId = req.user.id; // Assuming middleware sets user
            await userService.deleteUser(userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete account" });
        }
    }
    async updateTier(req, res) {
        try {
            const userId = req.user.id;
            const { tier } = req.body;
            const updatedUser = await userService.updateUserTier(userId, tier);
            res.json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update tier" });
        }
    }
}
//# sourceMappingURL=userController.js.map