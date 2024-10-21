import { Tag } from "@prisma/client";
import prisma from "../../../../prisma/prisma.ts";

export class TagService {
  async createTag(
    name: string,
    userId?: number,
    color?: string,
    description?: string
  ): Promise<Tag> {
    try {
      return await prisma.tag.create({
        data: { name, type: "CUSTOM", userId, color, description }, // Set type to "CUSTOM"
        include: { quotes: true },
      });
    } catch (error) {
      this.handlePrismaError(error, "Failed to create tag");
    }
  }

  async getTags(userId?: number, type?: "BUILTIN" | "CUSTOM"): Promise<Tag[]> {
    try {
      const whereClause: any = {};

      if (type === "BUILTIN") {
        whereClause.type = "BUILTIN";
      } else if (type === "CUSTOM") {
        whereClause.type = "CUSTOM";
        whereClause.userId = userId;
      } else {
        // If no type is specified, return both built-in tags and custom tags for the user
        whereClause.OR = [
          { type: "BUILTIN" },
          { type: "CUSTOM", userId: userId },
        ];
      }

      return await prisma.tag.findMany({
        where: whereClause,
        include: { quotes: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.handlePrismaError(error, "Failed to fetch tags");
    }
  }

  async updateTag(
    id: number,
    data: Partial<
      Omit<Tag, "id" | "type" | "userId" | "quotes" | "createdAt" | "updatedAt">
    >
  ): Promise<Tag> {
    try {
      return await prisma.tag.update({
        where: { id },
        data,
        include: { quotes: true },
      });
    } catch (error) {
      this.handlePrismaError(error, "Failed to update tag");
    }
  }

  async deleteTag(id: number): Promise<void> {
    try {
      await prisma.tag.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, "Failed to delete tag");
    }
  }

  private handlePrismaError(error: unknown, message: string): never {
    if (error instanceof Error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2025") {
        throw new Error("Tag not found");
      }
    }

    console.error(error);
    throw new Error(message);
  }
}
