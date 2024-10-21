import { Tag } from "@prisma/client";
import prisma from "../../../../prisma/prisma.ts";
import { Quote } from "../models/Quote.ts";

export class QuoteService {
  async createQuote(
    userId: number,
    folderId: number,
    content: string,
    tagIds: number[]
  ): Promise<Quote> {
    try {
      const quote = await prisma.quote.create({
        data: {
          userId,
          folderId,
          content,
          tags: {
            connect: tagIds.map((id) => ({ id })), // Connect using the IDs directly
          },
        },
        include: {
          folder: true,
          user: true,
          tags: true,
        },
      });
      return this.mapToQuoteModel(quote);
    } catch (error) {
      this.handlePrismaError(error, "Failed to create quote");
    }
  }

  async getQuotes(userId: number): Promise<Quote[]> {
    try {
      const quotes = await prisma.quote.findMany({
        where: { userId },
        include: { folder: true, user: true, tags: true },
        orderBy: { createdAt: "desc" },
      });
      return quotes.map(this.mapToQuoteModel);
    } catch (error) {
      this.handlePrismaError(error, "Failed to fetch quotes");
    }
  }

  async getQuoteById(id: number): Promise<Quote | null> {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id },
        include: { folder: true, user: true, tags: true },
      });
      return quote ? this.mapToQuoteModel(quote) : null;
    } catch (error) {
      this.handlePrismaError(error, "Failed to fetch quote");
      return null;
    }
  }

  async updateQuote(
    id: number,
    data: Partial<
      Omit<
        Quote,
        | "id"
        | "userId"
        | "folderId"
        | "user"
        | "folder"
        | "createdAt"
        | "updatedAt"
        | "tags"
      >
    >
  ): Promise<Quote> {
    try {
      const updatedQuote = await prisma.quote.update({
        where: { id },
        data,
        include: { folder: true, user: true },
      });
      return this.mapToQuoteModel(updatedQuote);
    } catch (error) {
      this.handlePrismaError(error, "Failed to update quote");
    }
  }

  async deleteQuote(id: number): Promise<void> {
    try {
      await prisma.quote.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, "Failed to delete quote");
    }
  }

  private mapToQuoteModel(prismaQuote: any): Quote {
    return {
      id: prismaQuote.id,
      content: prismaQuote.content,
      userId: prismaQuote.userId,
      user: prismaQuote.user,
      folderId: prismaQuote.folderId,
      folder: prismaQuote.folder,
      createdAt: prismaQuote.createdAt,
      updatedAt: prismaQuote.updatedAt,
      tags: prismaQuote.tags
    };
  }

  private handlePrismaError(error: unknown, message: string): never {
    if (error instanceof Error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2025") {
        throw new Error("Record not found");
      }
    }

    console.error(error);
    throw new Error(message);
  }
}
