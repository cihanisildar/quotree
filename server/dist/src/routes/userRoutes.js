import express from "express";
import { validateLogin, validateRegistration, } from "../shared/middlewares/validationMiddleware.ts";
import { UserController } from "../modules/user/controllers/userController.ts";
import authMiddleware from "../shared/middlewares/authMiddleware.ts";
const router = express.Router();
const userController = new UserController();
// Registration route
router.post("/register", validateRegistration, async (req, res) => {
    try {
        await userController.register(req, res);
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Login route
router.post("/login", validateLogin, async (req, res) => {
    try {
        await userController.login(req, res);
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/logout", async (req, res) => {
    try {
        await userController.logout(req, res);
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get user profile route
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        await userController.getProfile(req, res);
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update user profile route
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        await userController.updateProfile(req, res);
    }
    catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Delete user account route
router.delete("/account", authMiddleware, async (req, res) => {
    try {
        await userController.deleteAccount(req, res);
    }
    catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update user tier route
router.put("/tier", authMiddleware, async (req, res) => {
    try {
        await userController.updateTier(req, res);
    }
    catch (error) {
        console.error("Update tier error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=userRoutes.js.map