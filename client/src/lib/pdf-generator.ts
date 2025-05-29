
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPhone } from './quote-utils';
import type { QuoteFormData } from '@shared/schema';

export async function generatePDF(data: QuoteFormData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = 20;

  // Header Section with border matching the preview
  doc.setDrawColor(229, 231, 235); // Gray border
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 50);
  
  // Try to add logo (left side)
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    
    await new Promise((resolve) => {
      logoImg.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = logoImg.width;
          canvas.height = logoImg.height;
          ctx?.drawImage(logoImg, 0, 0);
          
          const logoDataUrl = canvas.toDataURL('image/png');
          // Logo positioned like in preview (32x24 size, centered in left area)
          doc.addImage(logoDataUrl, 'PNG', margin + 10, yPosition + 13, 32, 24);
        } catch (err) {
          console.warn('Erro ao processar logo:', err);
        }
        resolve(true);
      };
      logoImg.onerror = () => {
        console.warn('Logo não encontrado');
        resolve(true);
      };
      logoImg.src = '/assets/logo.png';
    });
  } catch (err) {
    console.warn('Erro ao carregar logo:', err);
  }

  // Header right side - ORÇAMENTO (matching preview layout)
  doc.setTextColor(31, 41, 55); // Gray-800 like preview
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', pageWidth - margin - 10, yPosition + 15, { align: 'right' });
  
  // Service Order info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // Gray-600
  doc.text(`Ordem de Serviço: `, pageWidth - margin - 45, yPosition + 25, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.serviceOrder, pageWidth - margin - 10, yPosition + 25, { align: 'right' });
  
  // Date info
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Data: `, pageWidth - margin - 25, yPosition + 32, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.date, pageWidth - margin - 10, yPosition + 32, { align: 'right' });

  // WhatsApp with green color and phone icon
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94); // Green-600 like preview
  doc.text(`📞 ${formatPhone(data.companyWhatsapp)}`, pageWidth - margin - 10, yPosition + 42, { align: 'right' });

  yPosition += 70;

  // Client and Equipment sections side by side (matching preview grid)
  const sectionWidth = (pageWidth - 3 * margin) / 2;
  
  // Client Data Section (Left) - Gray-50 background like preview
  doc.setFillColor(249, 250, 251); // Gray-50 background
  doc.roundedRect(margin, yPosition, sectionWidth, 50, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPosition, sectionWidth, 50, 3, 3, 'S');
  
  doc.setTextColor(31, 41, 55); // Gray-800
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('👤 Dados do Cliente', margin + 5, yPosition + 12);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // Gray-600
  doc.text('Cliente:', margin + 5, yPosition + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.text(data.clientName, margin + 5, yPosition + 28);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Telefone:', margin + 5, yPosition + 37);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(formatPhone(data.clientPhone), margin + 5, yPosition + 43);

  // Equipment Data Section (Right) - Gray-50 background like preview
  const rightSectionX = margin + sectionWidth + 10;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(rightSectionX, yPosition, sectionWidth, 50, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(rightSectionX, yPosition, sectionWidth, 50, 3, 3, 'S');
  
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('💻 Dados do Equipamento', rightSectionX + 5, yPosition + 12);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Equipamento:', rightSectionX + 5, yPosition + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentType, rightSectionX + 5, yPosition + 28);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Modelo:', rightSectionX + 5, yPosition + 34);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentModel, rightSectionX + 5, yPosition + 40);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Acessórios:', rightSectionX + 5, yPosition + 46);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  // Limit accessories text to fit in the box
  const accessoriesText = data.equipmentAccessories.length > 25 
    ? data.equipmentAccessories.substring(0, 25) + '...' 
    : data.equipmentAccessories;
  doc.text(accessoriesText, rightSectionX + 35, yPosition + 46);

  yPosition += 70;

  // Diagnostics Section (matching red-50 background from preview)
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🔍 Diagnóstico / Problema', margin, yPosition);
  yPosition += 12;

  // Red-bordered box for diagnostics (matching preview style)
  const diagnosticsHeight = Math.max(data.diagnostics.length * 6 + 10, 20);
  doc.setFillColor(254, 242, 242); // Red-50 background
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight, 3, 3, 'F');
  doc.setDrawColor(248, 113, 113); // Red-400 border
  doc.setLineWidth(2);
  doc.line(margin, yPosition, margin, yPosition + diagnosticsHeight); // Left red border
  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight, 3, 3, 'S');

  doc.setTextColor(55, 65, 81); // Gray-700
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  data.diagnostics.forEach((diagnostic, index) => {
    doc.text(`⚠️ ${diagnostic}`, margin + 5, yPosition + 10 + (index * 6));
  });

  yPosition += diagnosticsHeight + 20;

  // Services Section
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🔧 Procedimentos Realizados', margin, yPosition);
  yPosition += 12;

  // Services table with exact styling from preview
  const total = data.services.reduce((sum, service) => sum + service.price, 0);
  
  const tableData = data.services.map(service => [
    service.name,
    formatCurrency(service.price)
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Serviço', 'Valor']],
    body: tableData,
    foot: [['TOTAL', formatCurrency(total)]],
    theme: 'grid',
    tableLineColor: [229, 231, 235], // Gray border
    tableLineWidth: 0.5,
    headStyles: {
      fillColor: [37, 99, 235], // Blue-600 matching preview
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11,
      cellPadding: 6
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: [0, 0, 0]
    },
    footStyles: {
      fillColor: [243, 244, 246], // Gray-100 matching preview
      textColor: [37, 99, 235], // Blue-600 matching preview
      fontStyle: 'bold',
      fontSize: 12,
      cellPadding: 6
    },
    columnStyles: {
      0: { cellWidth: (pageWidth - 2 * margin) * 0.7 },
      1: { halign: 'right', cellWidth: (pageWidth - 2 * margin) * 0.3, fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: {
      fillColor: [249, 250, 251] // Gray-50 for alternating rows
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Warranty Section (matching yellow background from preview)
  doc.setFillColor(254, 240, 138); // Yellow-200 matching preview
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 16, 3, 3, 'F');
  doc.setDrawColor(217, 119, 6); // Yellow-600 border
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 16, 3, 3, 'S');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('GARANTIA DE 30 DIAS DOS SERVIÇOS PRESTADOS', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  yPosition += 35;

  // Signatures Section (matching preview layout)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // Gray-600
  
  const signatureWidth = (pageWidth - 3 * margin) / 2;
  
  // Technician signature (left)
  doc.text('Assinatura do Técnico:', margin, yPosition);
  const techSignatureY = yPosition + 20;
  doc.setDrawColor(209, 213, 219); // Gray-300 line
  doc.line(margin, techSignatureY, margin + signatureWidth, techSignatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.technicianName, margin + signatureWidth / 2, techSignatureY + 8, { align: 'center' });
  
  // Client signature (right)
  const clientSignatureX = margin + signatureWidth + 20;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Assinatura do Cliente:', clientSignatureX, yPosition);
  doc.setDrawColor(209, 213, 219);
  doc.line(clientSignatureX, techSignatureY, clientSignatureX + signatureWidth, techSignatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.clientName, clientSignatureX + signatureWidth / 2, techSignatureY + 8, { align: 'center' });

  // Save the PDF
  doc.save(`Orcamento_${data.serviceOrder}_${data.clientName.replace(/\s+/g, '_')}.pdf`);
}
