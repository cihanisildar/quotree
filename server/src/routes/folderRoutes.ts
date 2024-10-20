import express, { Request, Response } from "express";
import { FolderController } from "../modules/folder/controllers/folderController.ts"; // Adjust the path as necessary
import authMiddleware from "../shared/middlewares/authMiddleware.ts";

const router = express.Router();
const folderController = new FolderController();

// Create folder route
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    await folderController.createFolder(req, res);
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get folder by id route
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await folderController.getFolderById(req, res);
  } catch (error) {
    console.error("Get folder by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get all folders for a user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    await folderController.getFolders(req, res);
  } catch (error) {
    console.error("Get folders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update folder route
router.put("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    await folderController.updateFolder(req, res);
  } catch (error) {
    console.error("Update folder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete folder route
router.delete("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    await folderController.deleteFolder(req, res);
  } catch (error) {
    console.error("Delete folder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/:parentId/subfolders', authMiddleware, async (req: Request, res: Response) => {
  try {
    await folderController.createSubfolder(req, res);
  } catch (error) {
    console.error("Create subfolder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a folder with its subfolders
router.get('/:id/with-subfolders', authMiddleware, async (req: Request, res: Response) => {
  try {
    await folderController.getFolderWithAllSubfolders(req, res);
  } catch (error) {
    console.error("Get folder with subfolders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
