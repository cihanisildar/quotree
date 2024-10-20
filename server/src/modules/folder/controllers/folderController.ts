import { Request, Response } from "express";
import { FolderService } from "../services/folderService.ts";

const folderService = new FolderService();

export class FolderController {
  async createFolder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name } = req.body;
      const folder = await folderService.createFolder(userId, name);
      res.status(201).json({ id: folder.id, name: folder.name });
    } catch (error) {
      res.status(400).json({ error: "Failed to create folder" });
    }
  }

  async getFolderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const folder = await folderService.getFolderById(id);
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }
      res.json(folder);
    } catch (error) {
      console.error("Error getting folder by id:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getFolders(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const folders = await folderService.getFoldersByUserId(Number(userId));
      res.json(folders);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve folders" });
    }
  }

  async updateFolder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { folderId, name } = req.body;
      const updatedFolder = await folderService.updateFolder(userId, folderId, {
        name,
      });
      if (!updatedFolder) {
        return res.status(404).json({ error: "Folder not found" });
      }
      res.json({ id: updatedFolder.id, name: updatedFolder.name });
    } catch (error) {
      res.status(500).json({ error: "Failed to update folder" });
    }
  }

  async deleteFolder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { folderId } = req.body;
      await folderService.deleteFolder(userId, folderId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete folder" });
    }
  }

  async createSubfolder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const parentId = parseInt(req.params.parentId);
      const { name } = req.body;
      const subfolder = await folderService.createSubfolder(userId, parentId, name);
      res.status(201).json({ id: subfolder.id, name: subfolder.name, parentId: subfolder.parentId });
    } catch (error) {
      console.error("Error creating subfolder:", error);
      res.status(400).json({ error: "Failed to create subfolder" });
    }
  }

  async getFolderWithAllSubfolders(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const folder = await folderService.getFolderWithAllSubfolders(id);
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }
      res.json(folder);
    } catch (error) {
      console.error("Error getting folder with all subfolders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
