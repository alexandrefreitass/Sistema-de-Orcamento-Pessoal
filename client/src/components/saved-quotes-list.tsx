
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import type { QuoteFormData, SavedQuote } from "@shared/schema";

interface SavedQuotesListProps {
  onLoadQuote: (data: QuoteFormData) => void;
  currentQuoteData?: QuoteFormData;
}

const saveTemplateSchema = z.object({
  name: z.string().min(1, "Nome do template é obrigatório"),
});

export default function SavedQuotesList({ onLoadQuote, currentQuoteData }: SavedQuotesListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<{ name: string }>({
    resolver: zodResolver(saveTemplateSchema),
    defaultValues: { name: "" },
  });

  // Fetch saved quotes
  const { data: savedQuotes = [], isLoading } = useQuery({
    queryKey: ["/api/saved-quotes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/saved-quotes");
      return response.json();
    },
  });

  // Save current quote as template
  const saveTemplateMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      if (!currentQuoteData) {
        throw new Error("Nenhum orçamento para salvar");
      }
      
      const templateData = {
        ...currentQuoteData,
        name: data.name,
      };
      
      const response = await apiRequest("POST", "/api/saved-quotes", templateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-quotes"] });
      toast({
        title: "Sucesso!",
        description: "Template salvo com sucesso.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar template",
        variant: "destructive",
      });
    },
  });

  // Delete saved quote
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/saved-quotes/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-quotes"] });
      toast({
        title: "Sucesso!",
        description: "Template excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir template",
        variant: "destructive",
      });
    },
  });

  const handleLoadQuote = (savedQuote: SavedQuote) => {
    const quoteData: QuoteFormData = {
      serviceOrder: savedQuote.serviceOrder,
      date: savedQuote.date,
      companyWhatsapp: savedQuote.companyWhatsapp,
      clientName: savedQuote.clientName,
      clientPhone: savedQuote.clientPhone,
      equipmentType: savedQuote.equipmentType,
      equipmentModel: savedQuote.equipmentModel,
      equipmentAccessories: savedQuote.equipmentAccessories,
      equipmentPassword: savedQuote.equipmentPassword,
      diagnostics: savedQuote.diagnostics,
      services: JSON.parse(savedQuote.services),
      technicianName: savedQuote.technicianName,
    };
    
    onLoadQuote(quoteData);
    toast({
      title: "Template carregado!",
      description: "Os dados foram preenchidos no formulário.",
    });
  };

  const handleSaveTemplate = (data: { name: string }) => {
    saveTemplateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Templates Salvos</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              disabled={!currentQuoteData}
            >
              <Plus className="h-4 w-4 mr-2" />
              Salvar Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salvar como Template</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveTemplate)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Template</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Template Desktop Básico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={saveTemplateMutation.isPending}
                  >
                    {saveTemplateMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {savedQuotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">Nenhum template salvo ainda.</p>
            <p className="text-sm text-gray-500">
              Preencha um orçamento e clique em "Salvar Template" para criar seu primeiro template.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedQuotes.map((savedQuote: SavedQuote) => (
            <Card key={savedQuote.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{savedQuote.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Cliente: {savedQuote.clientName} | OS: {savedQuote.serviceOrder}
                    </p>
                    <p className="text-xs text-gray-500">
                      Criado em: {new Date(savedQuote.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleLoadQuote(savedQuote)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Carregar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(savedQuote.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-gray-600">
                  <p><strong>Equipamento:</strong> {savedQuote.equipmentType}</p>
                  <p><strong>Técnico:</strong> {savedQuote.technicianName}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
