
import { quotes, savedQuotes, type Quote, type SavedQuote, type InsertQuote, type QuoteFormData, type SavedQuoteFormData } from "@shared/schema";
import { promises as fs } from "fs";
import path from "path";

export interface IStorage {
  createQuote(quoteData: QuoteFormData): Promise<Quote>;
  getQuote(id: number): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuote(id: number, quoteData: Partial<QuoteFormData>): Promise<Quote | undefined>;
  deleteQuote(id: number): Promise<boolean>;
  createSavedQuote(savedQuoteData: SavedQuoteFormData): Promise<SavedQuote>;
  getAllSavedQuotes(): Promise<SavedQuote[]>;
  deleteSavedQuote(id: number): Promise<boolean>;
}

export class FileStorage implements IStorage {
  private quotesFilePath: string;
  private savedQuotesFilePath: string;
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.quotesFilePath = path.join(this.dataDir, 'quotes.json');
    this.savedQuotesFilePath = path.join(this.dataDir, 'saved-quotes.json');
    this.ensureDataDir();
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  private async loadQuotes(): Promise<{ quotes: Quote[], nextId: number }> {
    try {
      const data = await fs.readFile(this.quotesFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        quotes: parsed.quotes || [],
        nextId: parsed.nextId || 1
      };
    } catch {
      return { quotes: [], nextId: 1 };
    }
  }

  private async saveQuotes(quotes: Quote[], nextId: number): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(this.quotesFilePath, JSON.stringify({ quotes, nextId }, null, 2));
  }

  private async loadSavedQuotes(): Promise<{ savedQuotes: SavedQuote[], nextId: number }> {
    try {
      const data = await fs.readFile(this.savedQuotesFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        savedQuotes: parsed.savedQuotes || [],
        nextId: parsed.nextId || 1
      };
    } catch {
      return { savedQuotes: [], nextId: 1 };
    }
  }

  private async saveSavedQuotes(savedQuotes: SavedQuote[], nextId: number): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(this.savedQuotesFilePath, JSON.stringify({ savedQuotes, nextId }, null, 2));
  }

  async createQuote(quoteData: QuoteFormData): Promise<Quote> {
    const { quotes, nextId } = await this.loadQuotes();
    const total = quoteData.services.reduce((sum, service) => sum + service.price, 0);
    
    const quote: Quote = {
      id: nextId,
      serviceOrder: quoteData.serviceOrder,
      date: quoteData.date,
      companyWhatsapp: quoteData.companyWhatsapp,
      clientName: quoteData.clientName,
      clientPhone: quoteData.clientPhone,
      equipmentType: quoteData.equipmentType,
      equipmentModel: quoteData.equipmentModel,
      equipmentAccessories: quoteData.equipmentAccessories,
      equipmentPassword: quoteData.equipmentPassword,
      diagnostics: quoteData.diagnostics,
      services: JSON.stringify(quoteData.services),
      total: total.toString(),
      technicianName: quoteData.technicianName,
      createdAt: new Date(),
    };

    quotes.push(quote);
    await this.saveQuotes(quotes, nextId + 1);
    return quote;
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const { quotes } = await this.loadQuotes();
    return quotes.find(quote => quote.id === id);
  }

  async getAllQuotes(): Promise<Quote[]> {
    const { quotes } = await this.loadQuotes();
    return quotes;
  }

  async updateQuote(id: number, quoteData: Partial<QuoteFormData>): Promise<Quote | undefined> {
    const { quotes, nextId } = await this.loadQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === id);
    
    if (quoteIndex === -1) return undefined;

    const existingQuote = quotes[quoteIndex];
    const total = quoteData.services 
      ? quoteData.services.reduce((sum, service) => sum + service.price, 0)
      : parseFloat(existingQuote.total);

    const updatedQuote: Quote = {
      ...existingQuote,
      ...quoteData,
      services: quoteData.services ? JSON.stringify(quoteData.services) : existingQuote.services,
      total: total.toString(),
    };

    quotes[quoteIndex] = updatedQuote;
    await this.saveQuotes(quotes, nextId);
    return updatedQuote;
  }

  async deleteQuote(id: number): Promise<boolean> {
    const { quotes, nextId } = await this.loadQuotes();
    const initialLength = quotes.length;
    const filteredQuotes = quotes.filter(quote => quote.id !== id);
    
    if (filteredQuotes.length === initialLength) return false;
    
    await this.saveQuotes(filteredQuotes, nextId);
    return true;
  }

  async createSavedQuote(savedQuoteData: SavedQuoteFormData): Promise<SavedQuote> {
    const { savedQuotes, nextId } = await this.loadSavedQuotes();
    
    const savedQuote: SavedQuote = {
      id: nextId,
      name: savedQuoteData.name,
      serviceOrder: savedQuoteData.serviceOrder,
      date: savedQuoteData.date,
      companyWhatsapp: savedQuoteData.companyWhatsapp,
      clientName: savedQuoteData.clientName,
      clientPhone: savedQuoteData.clientPhone,
      equipmentType: savedQuoteData.equipmentType,
      equipmentModel: savedQuoteData.equipmentModel,
      equipmentAccessories: savedQuoteData.equipmentAccessories,
      equipmentPassword: savedQuoteData.equipmentPassword,
      diagnostics: savedQuoteData.diagnostics,
      services: JSON.stringify(savedQuoteData.services),
      technicianName: savedQuoteData.technicianName,
      createdAt: new Date(),
    };

    savedQuotes.push(savedQuote);
    await this.saveSavedQuotes(savedQuotes, nextId + 1);
    return savedQuote;
  }

  async getAllSavedQuotes(): Promise<SavedQuote[]> {
    const { savedQuotes } = await this.loadSavedQuotes();
    return savedQuotes;
  }

  async deleteSavedQuote(id: number): Promise<boolean> {
    const { savedQuotes, nextId } = await this.loadSavedQuotes();
    const initialLength = savedQuotes.length;
    const filteredSavedQuotes = savedQuotes.filter(savedQuote => savedQuote.id !== id);
    
    if (filteredSavedQuotes.length === initialLength) return false;
    
    await this.saveSavedQuotes(filteredSavedQuotes, nextId);
    return true;
  }
}

export const storage = new FileStorage();
