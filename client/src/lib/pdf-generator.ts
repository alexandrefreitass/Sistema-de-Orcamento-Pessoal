
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPhone } from './quote-utils';
import type { QuoteFormData } from '@shared/schema';

export async function generatePDF(data: QuoteFormData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 20;

  // Configurar fonte padrão como helvetica
  doc.setFont('helvetica');

  // Header Section
  const headerStartY = yPosition;

  // Logo
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
          doc.addImage(logoDataUrl, 'PNG', margin, yPosition, 32, 24);
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

  // Header direito
  const rightContentX = pageWidth - margin;
  
  // Texto de orçamento
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', rightContentX, yPosition + 8, { align: 'right' });
  
  // Ordem de Serviço
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  const osText = 'Ordem de Serviço: ';
  const osWidth = doc.getTextWidth(osText);
  doc.text(osText, rightContentX - osWidth - doc.getTextWidth(data.serviceOrder), yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.serviceOrder, rightContentX, yPosition + 16, { align: 'right' });
  
  // Data
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  const dateText = 'Data: ';
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, rightContentX - dateWidth - doc.getTextWidth(data.date), yPosition + 24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.date, rightContentX, yPosition + 24, { align: 'right' });

  // WhatsApp com ícone
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94);
  doc.text('📞 ' + formatPhone(data.companyWhatsapp), rightContentX, yPosition + 34, { align: 'right' });

  // Linha de separação
  yPosition += 40;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 12;

  // Seções Cliente e Equipamento
  const sectionWidth = (pageWidth - 3 * margin) / 2;
  const sectionGap = 15;

  // Seção Cliente
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, yPosition, sectionWidth, 35, 3, 3, 'F');
  
  // Título da seção
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('👤 Dados do Cliente', margin + 5, yPosition + 8);
  
  // Campos do cliente
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Cliente:', margin + 5, yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.clientName, margin + 5, yPosition + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Telefone:', margin + 5, yPosition + 27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(formatPhone(data.clientPhone), margin + 5, yPosition + 31);

  // Seção Equipamento
  const rightSectionX = margin + sectionWidth + sectionGap;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(rightSectionX, yPosition, sectionWidth, 35, 3, 3, 'F');
  
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('💻 Dados do Equipamento', rightSectionX + 5, yPosition + 8);
  
  // Campos do equipamento
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  doc.text('Equipamento:', rightSectionX + 5, yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentType.substring(0, 15) + '...', rightSectionX + 5, yPosition + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Modelo:', rightSectionX + 5, yPosition + 27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentModel.substring(0, 15) + '...', rightSectionX + 5, yPosition + 31);
  
  const rightCol = rightSectionX + sectionWidth/2 + 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Acessórios:', rightCol, yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentAccessories.substring(0, 12) + '...', rightCol, yPosition + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Senha:', rightCol, yPosition + 27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentPassword || 'N/A', rightCol, yPosition + 31);

  yPosition += 35 + 12;

  // Seção Diagnóstico
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🔍 Diagnóstico / Problema', margin, yPosition);
  yPosition += 8;

  // Box do diagnóstico
  const diagnosticsHeight = Math.max(data.diagnostics.length * 4 + 8, 15);
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight, 0, 3, 'F');
  
  doc.setFillColor(248, 113, 113);
  doc.rect(margin, yPosition, 2, diagnosticsHeight, 'F');

  // Conteúdo do diagnóstico
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  data.diagnostics.forEach((diagnostic, index) => {
    doc.text(`⚠️ ${diagnostic}`, margin + 8, yPosition + 6 + (index * 4));
  });

  yPosition += diagnosticsHeight + 12;

  // Seção Serviços
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🔧 Procedimentos Realizados', margin, yPosition);
  yPosition += 8;

  // Tabela de serviços
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
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'left'
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    footStyles: {
      fillColor: [243, 244, 246],
      textColor: [37, 99, 235],
      fontStyle: 'bold',
      fontSize: 11
    },
    columnStyles: {
      0: { 
        cellWidth: (pageWidth - 2 * margin) * 0.7,
        halign: 'left'
      },
      1: { 
        halign: 'right', 
        cellWidth: (pageWidth - 2 * margin) * 0.3,
        fontStyle: 'bold'
      }
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    tableLineColor: [229, 231, 235],
    tableLineWidth: 0.3
  });

  yPosition = (doc as any).lastAutoTable.finalY + 12;

  // Seção Garantia
  const warrantyHeight = 12;
  doc.setFillColor(254, 240, 138);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, warrantyHeight, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('GARANTIA DE 30 DIAS DOS SERVIÇOS PRESTADOS', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  yPosition += warrantyHeight + 15;

  // Seções de Assinatura
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  const signatureWidth = (pageWidth - 3 * margin) / 2;
  
  // Assinatura do Técnico
  doc.text('Assinatura do Técnico:', margin, yPosition);
  const signatureY = yPosition + 12;
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.5);
  doc.line(margin, signatureY, margin + signatureWidth, signatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.technicianName, margin + signatureWidth / 2, signatureY + 5, { align: 'center' });
  
  // Assinatura do Cliente
  const clientSignatureX = margin + signatureWidth + 20;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Assinatura do Cliente:', clientSignatureX, yPosition);
  doc.line(clientSignatureX, signatureY, clientSignatureX + signatureWidth, signatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.clientName, clientSignatureX + signatureWidth / 2, signatureY + 5, { align: 'center' });

  // Salvar o PDF
  doc.save(`Orcamento_${data.serviceOrder}_${data.clientName.replace(/\s+/g, '_')}.pdf`);
}

