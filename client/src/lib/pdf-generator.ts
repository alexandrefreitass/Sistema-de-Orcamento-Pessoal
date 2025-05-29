
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './quote-utils';
import type { QuoteFormData } from '@shared/schema';

export async function generatePDF(data: QuoteFormData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Header
  doc.setFillColor(29, 78, 216); // Blue color
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Try to add logo
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    
    await new Promise((resolve, reject) => {
      logoImg.onload = () => {
        try {
          // Create canvas to convert image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = logoImg.width;
          canvas.height = logoImg.height;
          ctx?.drawImage(logoImg, 0, 0);
          
          const logoDataUrl = canvas.toDataURL('image/png');
          doc.addImage(logoDataUrl, 'PNG', margin, 10, 30, 20);
          resolve(true);
        } catch (err) {
          console.warn('Erro ao processar logo:', err);
          resolve(true); // Continue without logo
        }
      };
      logoImg.onerror = () => {
        console.warn('Logo não encontrado, continuando sem logo');
        resolve(true); // Continue without logo
      };
      logoImg.src = '/assets/logo.png';
    });
  } catch (err) {
    console.warn('Erro ao carregar logo:', err);
  }
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', margin + 35, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Assistência Técnica - Ordem de Serviço', margin + 35, 35);
  
  // Date and Service Order
  doc.text(`Data: ${data.date}`, pageWidth - 80, 25);
  doc.text(`OS: ${data.serviceOrder}`, pageWidth - 80, 35);
  doc.text(`WhatsApp: ${data.companyWhatsapp}`, pageWidth - 80, 45);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 80;

  // Client Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${data.clientName}`, margin, yPosition);
  doc.text(`Telefone: ${data.clientPhone}`, pageWidth / 2, yPosition);
  yPosition += 20;

  // Equipment Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Equipamento', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Equipamento: ${data.equipmentType}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Modelo: ${data.equipmentModel}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Acessórios: ${data.equipmentAccessories}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Senha: ${data.equipmentPassword}`, margin, yPosition);
  yPosition += 20;

  // Diagnostics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico / Problema', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  data.diagnostics.forEach((diagnostic, index) => {
    doc.text(`• ${diagnostic}`, margin, yPosition);
    yPosition += 6;
  });
  yPosition += 10;

  // Services Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Procedimentos Realizados', margin, yPosition);
  yPosition += 10;

  const total = data.services.reduce((sum, service) => sum + service.price, 0);

  const tableData = data.services.map(service => [
    service.name,
    formatCurrency(service.price)
  ]);

  tableData.push(['TOTAL', formatCurrency(total)]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Serviço', 'Valor']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [29, 78, 216],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    footStyles: {
      fillColor: [243, 244, 246],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    columnStyles: {
      1: { halign: 'right' }
    },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Warranty
  doc.setFillColor(254, 240, 138);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GARANTIA DE 30 DIAS DOS SERVIÇOS PRESTADOS', pageWidth / 2, yPosition + 12, { align: 'center' });
  
  yPosition += 40;

  // Signatures
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const signatureY = yPosition + 20;
  doc.line(margin, signatureY, margin + 60, signatureY);
  doc.line(pageWidth - margin - 60, signatureY, pageWidth - margin, signatureY);
  
  doc.text('Assinatura do Técnico:', margin, yPosition);
  doc.text('Assinatura do Cliente:', pageWidth - margin - 60, yPosition);
  
  doc.setFont('helvetica', 'bold');
  doc.text(data.technicianName, margin + 30, signatureY + 10, { align: 'center' });
  doc.text(data.clientName, pageWidth - margin - 30, signatureY + 10, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('Técnico Responsável', margin + 30, signatureY + 16, { align: 'center' });
  doc.text('Cliente', pageWidth - margin - 30, signatureY + 16, { align: 'center' });

  // Save the PDF
  doc.save(`Orcamento_${data.serviceOrder}_${data.clientName.replace(/\s+/g, '_')}.pdf`);
}
