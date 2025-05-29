import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, User, Smartphone, FileText, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { quoteFormSchema, type QuoteFormData } from "@shared/schema";

interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => void;
  initialData?: QuoteFormData;
  loadedData?: QuoteFormData;
}

export default function QuoteForm({ onSubmit, initialData, loadedData }: QuoteFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: initialData || {
      serviceOrder: "",
      date: new Date().toLocaleDateString("pt-BR"),
      companyWhatsapp: "(19) 99308-8395",
      clientName: "",
      clientPhone: "",
      equipmentType: "",
      equipmentModel: "",
      equipmentAccessories: "Nenhum",
      equipmentPassword: "Nenhum",
      diagnostics: [""],
      services: [{ name: "", price: 0 }],
      technicianName: "ALEXANDRE FREITAS",
    },
  });

  const { fields: diagnosticFields, append: appendDiagnostic, remove: removeDiagnostic } = useFieldArray({
    control: form.control,
    name: "diagnostics",
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const createQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Sucesso!",
        description: "Orçamento salvo com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar orçamento",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: QuoteFormData) => {
    // Filter empty diagnostics
    const filteredData = {
      ...data,
      diagnostics: data.diagnostics.filter(d => d.trim() !== ""),
    };
    
    createQuoteMutation.mutate(filteredData);
    onSubmit(filteredData);
  };

  const watchedServices = form.watch("services");
  const total = watchedServices.reduce((sum, service) => sum + (service.price || 0), 0);

  // Handle loaded data from templates
  useEffect(() => {
    if (loadedData) {
      form.reset(loadedData);
    }
  }, [loadedData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="serviceOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="00001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWhatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(19) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome ou empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(19) 9999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Equipment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              Dados do Equipamento
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="equipmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Computador FX 6300 8gb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipmentModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Asrock Phenom 2 (N68-S)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipmentAccessories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acessórios</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mouse, teclado ou Nenhum" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipmentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Senha ou Nenhum" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Diagnostics */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico / Problemas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {diagnosticFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`diagnostics.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Descreva o problema identificado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {diagnosticFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeDiagnostic(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendDiagnostic("")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Problema
            </Button>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Procedimentos Realizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name={`services.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormControl>
                        <Input placeholder="Nome do serviço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`services.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {serviceFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => appendService({ name: "", price: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
              <div className="text-lg font-semibold">
                Total: R$ {total.toFixed(2).replace(".", ",")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technician */}
        <Card>
          <CardHeader>
            <CardTitle>Técnico Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="technicianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Técnico</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={createQuoteMutation.isPending}
          >
            {createQuoteMutation.isPending ? "Gerando..." : "Gerar Orçamento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
