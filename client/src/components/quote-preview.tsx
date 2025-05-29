import { Button } from "@/components/ui/button";
import { Printer, Download, MessageCircle } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { formatCurrency, formatPhone } from "@/lib/quote-utils";
import { useToast } from "@/hooks/use-toast";
import type { QuoteFormData } from "@shared/schema";
import logoPath from "@assets/Untitled_logo_6_basic-file.png";

interface QuotePreviewProps {
  data: QuoteFormData;
}

export default function QuotePreview({ data }: QuotePreviewProps) {
  const { toast } = useToast();
  const total = data.services.reduce((sum, service) => sum + service.price, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(data);
      toast({
        title: "PDF gerado!",
        description: "O arquivo foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    const phone = data.companyWhatsapp.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá! Segue o orçamento dos serviços realizados.\n\nCliente: ${data.clientName}\nOS: ${data.serviceOrder}\nTotal: ${formatCurrency(total)}\n\nObrigado!`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons - Hidden on print */}
      <div className="flex flex-wrap gap-3 justify-center mb-6 print:hidden">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
        <Button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar PDF
        </Button>
        <Button
          onClick={handleWhatsApp}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Enviar WhatsApp
        </Button>
      </div>

      {/* Quote Document */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img 
                  src={logoPath} 
                  alt="Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ORÇAMENTO</h1>
                <p className="text-blue-100">Assistência Técnica - Ordem de Serviço</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Data</div>
              <div className="font-semibold">{data.date}</div>
              <div className="text-sm text-blue-100 mt-2">
                <i className="fab fa-whatsapp mr-2"></i>
                {formatPhone(data.companyWhatsapp)}
              </div>
            </div>
          </div>
          <div className="mt-4 text-right">
            <span className="text-blue-100">OS:</span>
            <span className="font-bold text-lg ml-2">{data.serviceOrder}</span>
          </div>
        </div>

        <div className="p-8">
          {/* Client and Equipment Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-user mr-3 text-blue-600"></i>
                Dados do Cliente
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Cliente:</span>
                  <div className="font-semibold text-gray-900">{data.clientName}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Telefone:</span>
                  <div className="font-semibold text-gray-900">{formatPhone(data.clientPhone)}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-desktop mr-3 text-blue-600"></i>
                Dados do Equipamento
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Equipamento:</span>
                  <div className="font-semibold text-gray-900">{data.equipmentType}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Modelo:</span>
                  <div className="font-semibold text-gray-900">{data.equipmentModel}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Acessórios:</span>
                  <div className="font-semibold text-gray-900">{data.equipmentAccessories}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Senha:</span>
                  <div className="font-semibold text-gray-900">{data.equipmentPassword}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-search mr-3 text-blue-600"></i>
              Diagnóstico / Problema
            </h3>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <ul className="space-y-2 text-gray-700">
                {data.diagnostics.map((diagnostic, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-red-500 mr-3 mt-1 text-sm"></i>
                    <span>{diagnostic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-tools mr-3 text-blue-600"></i>
              Procedimentos Realizados
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Serviço</th>
                    <th className="text-right py-4 px-6 font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.services.map((service, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">{service.name}</td>
                      <td className="py-4 px-6 text-right font-semibold">{formatCurrency(service.price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td className="py-4 px-6 font-bold text-lg">TOTAL</td>
                    <td className="py-4 px-6 text-right font-bold text-lg text-blue-600">{formatCurrency(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Warranty */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-black-800">GARANTIA DE 30 DIAS DOS SERVIÇOS PRESTADOS</h4>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Assinatura do Técnico:</div>
              <div className="border-t-2 border-gray-300 pt-4 mb-2">
                <div className="h-16 mb-2"></div>
                <div className="font-semibold text-gray-800">{data.technicianName}</div>
                <div className="text-sm text-gray-600">Técnico Responsável</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Assinatura do Cliente:</div>
              <div className="border-t-2 border-gray-300 pt-4 mb-2">
                <div className="h-16 mb-2"></div>
                <div className="font-semibold text-gray-800">{data.clientName}</div>
                <div className="text-sm text-gray-600">Cliente</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body { 
              background: white !important; 
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .print\\:hidden { display: none !important; }
            .print\\:shadow-none { box-shadow: none !important; }
            .print\\:rounded-none { border-radius: 0 !important; }
            .bg-gradient-to-r { 
              background: #1d4ed8 !important; 
              -webkit-print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  );
}
