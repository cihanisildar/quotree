// src/modules/quote/controllers/quoteController.ts

import { Request, Response } from "express";
import { QuoteService } from "../services/quoteService.ts";
import { Quote } from "../models/Quote.ts";

export class QuoteController {
  private quoteService: QuoteService;

  constructor() {
    this.quoteService = new QuoteService();
  }

  public createQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, folderId, content, tagIds } = req.body;
      const quote: Quote = await this.quoteService.createQuote(
        userId,
        folderId,
        content,
        tagIds
      );
      res.status(201).json(quote);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating quote", error: error.message });
    }
  };

  public getQuotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const quotes: Quote[] = await this.quoteService.getQuotes(userId);
      res.status(200).json(quotes);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching quotes", error: error.message });
    }
  };

  public getQuoteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const quote: Quote | null = await this.quoteService.getQuoteById(id);
      if (quote) {
        res.status(200).json(quote);
      } else {
        res.status(404).json({ message: "Quote not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching quote", error: error.message });
    }
  };

  public updateQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { content } = req.body;
      const updatedQuote: Quote = await this.quoteService.updateQuote(id, {
        content,
      });
      res.status(200).json(updatedQuote);
    } catch (error: any) {
      if (error.message === "Quote not found") {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error updating quote", error: error.message });
      }
    }
  };

  public deleteQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.quoteService.deleteQuote(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === "Quote not found") {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error deleting quote", error: error.message });
      }
    }
  };
}
