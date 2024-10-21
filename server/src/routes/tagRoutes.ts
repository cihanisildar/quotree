// src/modules/tag/routes/tagRoutes.ts
import express, { Request, Response } from "express";
import { TagController } from "modules/tag/controllers/tagController.ts";
import authMiddleware from "shared/middlewares/authMiddleware.ts";

const router = express.Router();
const tagController = new TagController();

// Create a new tag (both built-in and custom)
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  await tagController.createTag(req, res);
});

// Get all tags for a user
router.get("/user/:userId", async (req: Request, res: Response) => {
  await tagController.getTags(req, res);
});

// Update a tag
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  await tagController.updateTag(req, res);
});

// Delete a tag
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  await tagController.deleteTag(req, res);
});

export default router;
