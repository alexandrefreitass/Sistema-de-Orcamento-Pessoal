import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  serviceOrder: text("service_order").notNull(),
  date: text("date").notNull(),
  companyWhatsapp: text("company_whatsapp").notNull(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  equipmentType: text("equipment_type").notNull(),
  equipmentModel: text("equipment_model").notNull(),
  equipmentAccessories: text("equipment_accessories").notNull(),
  equipmentPassword: text("equipment_password").notNull(),
  diagnostics: text("diagnostics").array().notNull(),
  services: text("services").notNull(), // JSON string
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  technicianName: text("technician_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

// Service item schema for form validation
export const serviceItemSchema = z.object({
  name: z.string().min(1, "Nome do serviço é obrigatório"),
  price: z.number().min(0, "Preço deve ser positivo"),
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;

// Complete quote form schema
export const quoteFormSchema = z.object({
  serviceOrder: z.string().min(1, "Ordem de serviço é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  companyWhatsapp: z.string().min(1, "WhatsApp é obrigatório"),
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientPhone: z.string().min(1, "Telefone do cliente é obrigatório"),
  equipmentType: z.string().min(1, "Tipo do equipamento é obrigatório"),
  equipmentModel: z.string().min(1, "Modelo do equipamento é obrigatório"),
  equipmentAccessories: z.string(),
  equipmentPassword: z.string(),
  diagnostics: z.array(z.string()).min(1, "Pelo menos um diagnóstico é obrigatório"),
  services: z.array(serviceItemSchema).min(1, "Pelo menos um serviço é obrigatório"),
  technicianName: z.string().min(1, "Nome do técnico é obrigatório"),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;
