import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quoteFormSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new quote
  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = quoteFormSchema.parse(req.body);
      const quote = await storage.createQuote(validatedData);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all quotes
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific quote
  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getQuote(id);
      
      if (!quote) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
      }
      
      res.json(quote);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update a quote
  app.put("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = quoteFormSchema.partial().parse(req.body);
      const quote = await storage.updateQuote(id, validatedData);
      
      if (!quote) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
      }
      
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a quote
  app.delete("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuote(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
      }
      
      res.json({ message: "Orçamento excluído com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
