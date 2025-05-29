
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPhone } from './quote-utils';
import type { QuoteFormData } from '@shared/schema';

export async function generatePDF(data: QuoteFormData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  let yPosition = 15;

  // Header Section - replicando exatamente o layout do preview
  const headerHeight = 45;
  
  // Border around header
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, headerHeight);
  
  // Logo (lado esquerdo)
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
          // Logo com dimensões exatas do preview: w-32 h-24 = 128x96px = ~32x24mm
          doc.addImage(logoDataUrl, 'PNG', margin + 5, yPosition + 8, 32, 24);
        } catch (err) {
          console.warn('Erro ao processar logo:', err);
        }
        resolve(true);
      };
      logoImg.onerror = () => resolve(true);
      logoImg.src = '/assets/logo.png';
    });
  } catch (err) {
    console.warn('Erro ao carregar logo:', err);
  }

  // Header direito - ORÇAMENTO e informações
  doc.setTextColor(31, 41, 55); // text-gray-800
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', pageWidth - margin - 5, yPosition + 15, { align: 'right' });
  
  // Ordem de Serviço
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // text-gray-600
  doc.text('Ordem de Serviço: ', pageWidth - margin - 35, yPosition + 23, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.serviceOrder, pageWidth - margin - 5, yPosition + 23, { align: 'right' });
  
  // Data
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Data: ', pageWidth - margin - 20, yPosition + 30, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.date, pageWidth - margin - 5, yPosition + 30, { align: 'right' });

  // WhatsApp
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94); // text-green-600
  doc.text(formatPhone(data.companyWhatsapp), pageWidth - margin - 5, yPosition + 40, { align: 'right' });

  yPosition += headerHeight + 15;

  // Seções Cliente e Equipamento lado a lado
  const sectionWidth = (pageWidth - 3 * margin) / 2;
  const sectionHeight = 40;
  
  // Seção Cliente (esquerda)
  doc.setFillColor(249, 250, 251); // bg-gray-50
  doc.roundedRect(margin, yPosition, sectionWidth, sectionHeight, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPosition, sectionWidth, sectionHeight, 3, 3, 'S');
  
  doc.setTextColor(31, 41, 55); // text-gray-800
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente', margin + 5, yPosition + 8);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // text-gray-600
  doc.text('Cliente:', margin + 5, yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(data.clientName, margin + 5, yPosition + 21);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Telefone:', margin + 5, yPosition + 29);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(formatPhone(data.clientPhone), margin + 5, yPosition + 34);

  // Seção Equipamento (direita)
  const rightSectionX = margin + sectionWidth + 10;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(rightSectionX, yPosition, sectionWidth, sectionHeight, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(rightSectionX, yPosition, sectionWidth, sectionHeight, 3, 3, 'S');
  
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Equipamento', rightSectionX + 5, yPosition + 8);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Equipamento:', rightSectionX + 5, yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentType, rightSectionX + 5, yPosition + 21);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Modelo:', rightSectionX + 5, yPosition + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentModel, rightSectionX + 5, yPosition + 31);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Acessorios:', rightSectionX + 5, yPosition + 36);

  yPosition += sectionHeight + 15;

  // Seção Diagnóstico
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnostico / Problema', margin, yPosition);
  yPosition += 8;

  // Box do diagnóstico
  const diagnosticsHeight = Math.max(data.diagnostics.length * 5 + 8, 15);
  doc.setFillColor(254, 242, 242); // bg-red-50
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight, 3, 3, 'F');
  
  // Borda vermelha esquerda
  doc.setDrawColor(248, 113, 113); // border-red-400
  doc.setLineWidth(2);
  doc.line(margin, yPosition, margin, yPosition + diagnosticsHeight);
  
  // Borda normal
  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight, 3, 3, 'S');

  doc.setTextColor(55, 65, 81); // text-gray-700
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  data.diagnostics.forEach((diagnostic, index) => {
    doc.text(`• ${diagnostic}`, margin + 5, yPosition + 8 + (index * 5));
  });

  yPosition += diagnosticsHeight + 15;

  // Seção Serviços
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Procedimentos Realizados', margin, yPosition);
  yPosition += 8;

  // Tabela de serviços com estilo exato do preview
  const total = data.services.reduce((sum, service) => sum + service.price, 0);
  
  const tableData = data.services.map(service => [
    service.name,
    formatCurrency(service.price)
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Servico', 'Valor']],
    body: tableData,
    foot: [['TOTAL', formatCurrency(total)]],
    theme: 'grid',
    tableLineColor: [229, 231, 235],
    tableLineWidth: 0.5,
    headStyles: {
      fillColor: [37, 99, 235], // bg-blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      cellPadding: 3,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    footStyles: {
      fillColor: [243, 244, 246], // bg-gray-100
      textColor: [37, 99, 235], // text-blue-600
      fontStyle: 'bold',
      fontSize: 11,
      cellPadding: 3
    },
    columnStyles: {
      0: { 
        cellWidth: (pageWidth - 2 * margin) * 0.75,
        halign: 'left'
      },
      1: { 
        halign: 'right', 
        cellWidth: (pageWidth - 2 * margin) * 0.25,
        fontStyle: 'bold'
      }
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: {
      fillColor: [249, 250, 251] // bg-gray-50
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 12;

  // Seção Garantia - exatamente como no preview
  const warrantyHeight = 12;
  doc.setFillColor(254, 240, 138); // bg-yellow-50
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, warrantyHeight, 3, 3, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, warrantyHeight, 3, 3, 'S');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('GARANTIA DE 30 DIAS DOS SERVICOS PRESTADOS', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  yPosition += warrantyHeight + 15;

  // Seções de Assinatura
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  const signatureWidth = (pageWidth - 3 * margin) / 2;
  
  // Assinatura do Técnico (esquerda)
  doc.text('Assinatura do Tecnico:', margin, yPosition);
  const signatureY = yPosition + 15;
  doc.setDrawColor(209, 213, 219);
  doc.line(margin, signatureY, margin + signatureWidth, signatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.technicianName, margin + signatureWidth / 2, signatureY + 6, { align: 'center' });
  
  // Assinatura do Cliente (direita)
  const clientSignatureX = margin + signatureWidth + 20;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Assinatura do Cliente:', clientSignatureX, yPosition);
  doc.setDrawColor(209, 213, 219);
  doc.line(clientSignatureX, signatureY, clientSignatureX + signatureWidth, signatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.clientName, clientSignatureX + signatureWidth / 2, signatureY + 6, { align: 'center' });

  // Salvar o PDF
  doc.save(`Orcamento_${data.serviceOrder}_${data.clientName.replace(/\s+/g, '_')}.pdf`);
}
