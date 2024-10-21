// src/modules/tag/controllers/tagController.ts
import { Request, Response } from "express";
import { TagService } from "../services/tagService.ts";

export class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  public createTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, userId, color, description } = req.body;
      const tag = await this.tagService.createTag(
        name,
        userId,
        color,
        description
      );
      res.status(201).json({ status: "success", tag }); // Include status here
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Error creating tag",
        error: error.message,
      });
    }
  };

  public getTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const type = req.query.type as "BUILTIN" | "CUSTOM" | undefined;
      const tags = await this.tagService.getTags(userId, type);
      res.status(200).json({ status: "success", tags });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Error fetching tags",
        error: error.message,
      });
    }
  };

  public updateTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { name, color } = req.body;
      const updatedTag = await this.tagService.updateTag(id, { name, color });
      res.status(200).json({ status: "success", updatedTag }); // Include status here
    } catch (error: any) {
      if (error.message === "Tag not found") {
        res.status(404).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({
          status: "error",
          message: "Error updating tag",
          error: error.message,
        });
      }
    }
  };

  public deleteTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.tagService.deleteTag(id);
      res.status(204).send(); // No body to send here, just 204 status
    } catch (error: any) {
      if (error.message === "Tag not found") {
        res.status(404).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({
          status: "error",
          message: "Error deleting tag",
          error: error.message,
        });
      }
    }
  };
}
