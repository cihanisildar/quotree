import { Folder } from "@prisma/client";
import prisma from "../../../../prisma/prisma.ts";

type FolderWithSubfolders = Folder & { subFolders: FolderWithSubfolders[] };

export class FolderService {
  async createFolder(userId: number, name: string): Promise<Folder> {
    return await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });
  }

  async getFolderById(folderId: number): Promise<Folder | null> {
    return await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        subFolders: true,
        quotes: true
      },
    });
  }

  async getFoldersByUserId(userId: number): Promise<Folder[]> {
    return await prisma.folder.findMany({
      where: { userId },
      include: {
        quotes: true,
        subFolders: true,
      },
    });
  }

  async updateFolder(
    userId: number,
    folderId: number,
    data: { name: string }
  ): Promise<Folder | null> {
    return await prisma.folder.update({
      where: {
        id: folderId,
        userId,
      },
      data,
    });
  }

  async deleteFolder(userId: number, folderId: number): Promise<void> {
    await prisma.folder.deleteMany({
      where: {
        id: folderId,
        userId,
      },
    });
  }

  async createSubfolder(
    userId: number,
    parentId: number,
    name: string
  ): Promise<Folder> {
    return await prisma.folder.create({
      data: {
        name,
        userId,
        parentId,
      },
    });
  }

  async getFolderWithAllSubfolders(folderId: number): Promise<FolderWithSubfolders | null> {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { subFolders: true, quotes: true },
    });
  
    if (!folder) return null;
  
    const getSubfolders = async (parentFolder: Folder): Promise<FolderWithSubfolders> => {
      const subfolders = await prisma.folder.findMany({
        where: { parentId: parentFolder.id },
        include: { subFolders: true, quotes: true },
      });
  
      return {
        ...parentFolder,
        subFolders: await Promise.all(subfolders.map(getSubfolders)),
      };
    };
  
    return getSubfolders(folder);
  }
  
  
}
