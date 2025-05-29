import { quotes, type Quote, type InsertQuote, type QuoteFormData } from "@shared/schema";

export interface IStorage {
  createQuote(quoteData: QuoteFormData): Promise<Quote>;
  getQuote(id: number): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuote(id: number, quoteData: Partial<QuoteFormData>): Promise<Quote | undefined>;
  deleteQuote(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private quotes: Map<number, Quote>;
  private currentId: number;

  constructor() {
    this.quotes = new Map();
    this.currentId = 1;
  }

  async createQuote(quoteData: QuoteFormData): Promise<Quote> {
    const total = quoteData.services.reduce((sum, service) => sum + service.price, 0);
    
    const quote: Quote = {
      id: this.currentId++,
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

    this.quotes.set(quote.id, quote);
    return quote;
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async updateQuote(id: number, quoteData: Partial<QuoteFormData>): Promise<Quote | undefined> {
    const existingQuote = this.quotes.get(id);
    if (!existingQuote) return undefined;

    const total = quoteData.services 
      ? quoteData.services.reduce((sum, service) => sum + service.price, 0)
      : parseFloat(existingQuote.total);

    const updatedQuote: Quote = {
      ...existingQuote,
      ...quoteData,
      services: quoteData.services ? JSON.stringify(quoteData.services) : existingQuote.services,
      total: total.toString(),
    };

    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }

  async deleteQuote(id: number): Promise<boolean> {
    return this.quotes.delete(id);
  }
}

export const storage = new MemStorage();
