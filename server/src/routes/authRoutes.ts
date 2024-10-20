import express, { Request, Response } from "express";
import authController from "../modules/auth/controllers/authController.ts";
import { validateLogin } from "../shared/middlewares/validationMiddleware.ts";

const router = express.Router();


router.get("/status", async (req: Request, res: Response) => {
  try {
    await authController.status(req, res);
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", validateLogin, async (req: Request, res: Response) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    await authController.refresh(req, res);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    await authController.logout(req, res);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/check-refresh", async (req: Request, res: Response) => {
  try {
    await authController.checkRefresh(req, res);
  } catch (error) {
    console.error("Check refresh error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;