// src/modules/quote/routes/quoteRouters.ts
import express from 'express';
import { QuoteController } from '../modules/quote/controllers/quoteController.ts';
import authMiddleware from '../shared/middlewares/authMiddleware.ts';
const router = express.Router();
const quoteController = new QuoteController();
// Create a new quote
router.post('/', authMiddleware, async (req, res) => {
    try {
        await quoteController.createQuote(req, res);
    }
    catch (error) {
        console.error("Create quote error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get all quotes for a user
router.get('/user/:userId', async (req, res) => {
    try {
        await quoteController.getQuotes(req, res);
    }
    catch (error) {
        console.error("Get quotes error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get a specific quote by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        await quoteController.getQuoteById(req, res);
    }
    catch (error) {
        console.error("Get quote error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update a quote
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        await quoteController.updateQuote(req, res);
    }
    catch (error) {
        console.error("Update quote error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Delete a quote
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await quoteController.deleteQuote(req, res);
    }
    catch (error) {
        console.error("Delete quote error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=quoteRoutes.js.map