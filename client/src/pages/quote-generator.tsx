import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import QuoteForm from "@/components/quote-form";
import QuotePreview from "@/components/quote-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Edit3 } from "lucide-react";
import type { QuoteFormData } from "@shared/schema";

export default function QuoteGenerator() {
  const { id } = useParams();
  const [quoteData, setQuoteData] = useState<QuoteFormData | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  // Load existing quote if ID is provided
  const { data: existingQuote, isLoading } = useQuery({
    queryKey: ["/api/quotes", id],
    enabled: !!id,
  });

  const handleQuoteSubmit = (data: QuoteFormData) => {
    setQuoteData(data);
    setActiveTab("preview");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Orçamentos
          </h1>
          <p className="text-gray-600">
            Gere orçamentos profissionais para serviços técnicos de informática
          </p>
        </div>

        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Formulário
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Visualizar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <QuoteForm 
                  onSubmit={handleQuoteSubmit}
                  initialData={existingQuote ? {
                    serviceOrder: existingQuote.serviceOrder,
                    date: existingQuote.date,
                    companyWhatsapp: existingQuote.companyWhatsapp,
                    clientName: existingQuote.clientName,
                    clientPhone: existingQuote.clientPhone,
                    equipmentType: existingQuote.equipmentType,
                    equipmentModel: existingQuote.equipmentModel,
                    equipmentAccessories: existingQuote.equipmentAccessories,
                    equipmentPassword: existingQuote.equipmentPassword,
                    diagnostics: existingQuote.diagnostics,
                    services: JSON.parse(existingQuote.services),
                    technicianName: existingQuote.technicianName,
                  } : undefined}
                />
              </TabsContent>

              <TabsContent value="preview">
                {quoteData || existingQuote ? (
                  <QuotePreview 
                    data={quoteData || {
                      serviceOrder: existingQuote!.serviceOrder,
                      date: existingQuote!.date,
                      companyWhatsapp: existingQuote!.companyWhatsapp,
                      clientName: existingQuote!.clientName,
                      clientPhone: existingQuote!.clientPhone,
                      equipmentType: existingQuote!.equipmentType,
                      equipmentModel: existingQuote!.equipmentModel,
                      equipmentAccessories: existingQuote!.equipmentAccessories,
                      equipmentPassword: existingQuote!.equipmentPassword,
                      diagnostics: existingQuote!.diagnostics,
                      services: JSON.parse(existingQuote!.services),
                      technicianName: existingQuote!.technicianName,
                    }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Preencha o formulário para visualizar o orçamento
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
