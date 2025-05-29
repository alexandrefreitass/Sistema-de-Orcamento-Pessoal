
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

  // Header Section
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 60);
  
  // Try to add logo
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
          doc.addImage(logoDataUrl, 'PNG', margin + 10, yPosition + 10, 40, 30);
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

  // Header right side - ORÇAMENTO
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', pageWidth - margin - 10, yPosition + 20, { align: 'right' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Ordem de Serviço: ', pageWidth - margin - 50, yPosition + 30, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.serviceOrder, pageWidth - margin - 10, yPosition + 30, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Data: ', pageWidth - margin - 35, yPosition + 37, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.date, pageWidth - margin - 10, yPosition + 37, { align: 'right' });

  // WhatsApp
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94);
  doc.text(`📞 ${formatPhone(data.companyWhatsapp)}`, pageWidth - margin - 10, yPosition + 50, { align: 'right' });

  yPosition += 80;

  // Client and Equipment sections side by side with gray background
  const sectionWidth = (pageWidth - 3 * margin) / 2;
  
  // Client Data Section (Left)
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, yPosition, sectionWidth, 60, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, yPosition, sectionWidth, 60);
  
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('👤 Dados do Cliente', margin + 5, yPosition + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Cliente:', margin + 5, yPosition + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.clientName, margin + 5, yPosition + 35);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Telefone:', margin + 5, yPosition + 45);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(formatPhone(data.clientPhone), margin + 5, yPosition + 52);

  // Equipment Data Section (Right)
  const rightSectionX = margin + sectionWidth + 10;
  doc.setFillColor(249, 250, 251);
  doc.rect(rightSectionX, yPosition, sectionWidth, 60, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(rightSectionX, yPosition, sectionWidth, 60);
  
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('💻 Dados do Equipamento', rightSectionX + 5, yPosition + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Equipamento:', rightSectionX + 5, yPosition + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentType, rightSectionX + 5, yPosition + 35);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Modelo:', rightSectionX + 5, yPosition + 42);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentModel, rightSectionX + 5, yPosition + 49);

  if (data.equipmentAccessories) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('Acessórios:', rightSectionX + 80, yPosition + 42);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(data.equipmentAccessories, rightSectionX + 80, yPosition + 49);
  }

  if (data.equipmentPassword) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('Senha:', rightSectionX + 5, yPosition + 56);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(data.equipmentPassword, rightSectionX + 30, yPosition + 56);
  }

  yPosition += 80;

  // Diagnostics Section
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🔍 Diagnóstico / Problema', margin, yPosition);
  yPosition += 15;

  // Red-bordered box for diagnostics
  const diagnosticsHeight = Math.max(data.diagnostics.length * 7 + 15, 25);
  doc.setFillColor(254, 242, 242);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight, 'F');
  doc.setDrawColor(248, 113, 113);
  doc.setLineWidth(3);
  doc.line(margin, yPosition, margin, yPosition + diagnosticsHeight);
  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight);

  doc.setTextColor(55, 65, 81);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  data.diagnostics.forEach((diagnostic, index) => {
    doc.text(`⚠️ ${diagnostic}`, margin + 8, yPosition + 12 + (index * 7));
  });

  yPosition += diagnosticsHeight + 20;

  // Services Section
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🔧 Procedimentos Realizados', margin, yPosition);
  yPosition += 15;

  // Services table
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
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11,
      cellPadding: { top: 8, right: 12, bottom: 8, left: 12 }
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: { top: 8, right: 12, bottom: 8, left: 12 },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    },
    footStyles: {
      fillColor: [243, 244, 246],
      textColor: [37, 99, 235],
      fontStyle: 'bold',
      fontSize: 12,
      cellPadding: { top: 8, right: 12, bottom: 8, left: 12 }
    },
    columnStyles: {
      0: { cellWidth: (pageWidth - 2 * margin) * 0.7 },
      1: { halign: 'right', cellWidth: (pageWidth - 2 * margin) * 0.3, fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin },
    styles: {
      lineColor: [209, 213, 219],
      lineWidth: 0.5
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Warranty Section
  doc.setFillColor(254, 240, 138);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('GARANTIA DE 30 DIAS DOS SERVIÇOS PRESTADOS', pageWidth / 2, yPosition + 13, { align: 'center' });
  
  yPosition += 40;

  // Signatures Section
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  const signatureWidth = (pageWidth - 3 * margin) / 2;
  
  // Technician signature (left)
  doc.text('Assinatura do Técnico:', margin, yPosition);
  const techSignatureY = yPosition + 25;
  doc.setDrawColor(209, 213, 219);
  doc.line(margin, techSignatureY, margin + signatureWidth, techSignatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.technicianName, margin + signatureWidth / 2, techSignatureY + 10, { align: 'center' });
  
  // Client signature (right)
  const clientSignatureX = margin + signatureWidth + 20;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Assinatura do Cliente:', clientSignatureX, yPosition);
  doc.line(clientSignatureX, techSignatureY, clientSignatureX + signatureWidth, techSignatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.clientName, clientSignatureX + signatureWidth / 2, techSignatureY + 10, { align: 'center' });

  // Save the PDF
  doc.save(`Orcamento_${data.serviceOrder}_${data.clientName.replace(/\s+/g, '_')}.pdf`);
}
