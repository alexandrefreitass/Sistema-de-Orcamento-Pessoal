
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPhone } from './quote-utils';
import type { QuoteFormData } from '@shared/schema';

export async function generatePDF(data: QuoteFormData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 8;
  let yPosition = 8;

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

  // Header direito - com espaçamento reduzido e uniforme
  const rightContentX = pageWidth - margin;
  
  // Texto de orçamento
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', rightContentX, yPosition + 8, { align: 'right' });
  
  // Ordem de Serviço - espaçamento reduzido
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  const osText = 'Ordem de Serviço: ';
  const osWidth = doc.getTextWidth(osText);
  doc.text(osText, rightContentX - osWidth - doc.getTextWidth(data.serviceOrder), yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.serviceOrder, rightContentX, yPosition + 16, { align: 'right' });
  
  // Data - espaçamento reduzido
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  const dateText = 'Data: ';
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, rightContentX - dateWidth - doc.getTextWidth(data.date), yPosition + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(data.date, rightContentX, yPosition + 22, { align: 'right' });

  // WhatsApp - espaçamento reduzido
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94);
  doc.text(formatPhone(data.companyWhatsapp), rightContentX, yPosition + 28, { align: 'right' });

  // Linha de separação
  yPosition += 34;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

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
  doc.text('Dados do Cliente', margin + 5, yPosition + 8);
  
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

  // Seção Equipamento - com tratamento melhor de texto
  const rightSectionX = margin + sectionWidth + sectionGap;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(rightSectionX, yPosition, sectionWidth, 35, 3, 3, 'F');
  
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Equipamento', rightSectionX + 5, yPosition + 8);
  
  // Função para quebrar texto em múltiplas linhas
  function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    doc.setFontSize(fontSize);
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = doc.getTextWidth(testLine);
      
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  // Campos do equipamento com quebra de linha adequada
  const fieldWidth = (sectionWidth - 10) / 2 - 5;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  // Equipamento
  doc.text('Equipamento:', rightSectionX + 5, yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  const equipmentLines = wrapText(data.equipmentType, fieldWidth, 7);
  equipmentLines.forEach((line, index) => {
    doc.text(line, rightSectionX + 5, yPosition + 20 + (index * 3));
  });
  
  // Modelo
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const modelY = yPosition + 20 + (equipmentLines.length * 3) + 3;
  doc.text('Modelo:', rightSectionX + 5, modelY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  const modelLines = wrapText(data.equipmentModel, fieldWidth, 7);
  modelLines.forEach((line, index) => {
    doc.text(line, rightSectionX + 5, modelY + 4 + (index * 3));
  });
  
  // Coluna direita
  const rightCol = rightSectionX + sectionWidth/2 + 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Acessórios:', rightCol, yPosition + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  const accessoriesLines = wrapText(data.equipmentAccessories || 'N/A', fieldWidth, 7);
  accessoriesLines.forEach((line, index) => {
    doc.text(line, rightCol, yPosition + 20 + (index * 3));
  });
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const passwordY = yPosition + 20 + (accessoriesLines.length * 3) + 3;
  doc.text('Senha:', rightCol, passwordY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.equipmentPassword || 'N/A', rightCol, passwordY + 4);

  // Calcular altura dinâmica baseada no conteúdo do equipamento
  const equipmentLinesCount = equipmentLines.length;
  const modelLinesCount = modelLines.length;
  const accessoriesLinesCount = accessoriesLines.length;
  
  const maxLines = Math.max(equipmentLinesCount + modelLinesCount, accessoriesLinesCount + 1);
  const dynamicHeight = Math.max(35, 16 + (maxLines * 3) + 8);
  
  yPosition += dynamicHeight + 8;

  // Seção Diagnóstico
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico / Problema', margin, yPosition);
  yPosition += 6;

  // Box do diagnóstico - barra vermelha mais estreita
  const diagnosticsHeight = Math.max(data.diagnostics.length * 4 + 8, 15);
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, diagnosticsHeight, 0, 3, 'F');
  
  // Barra vermelha mais estreita
  doc.setFillColor(248, 113, 113);
  doc.rect(margin, yPosition, 1, diagnosticsHeight, 'F');

  // Conteúdo do diagnóstico - sem bullets
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  data.diagnostics.forEach((diagnostic, index) => {
    doc.text(diagnostic, margin + 6, yPosition + 6 + (index * 4));
  });

  yPosition += diagnosticsHeight + 8;

  // Seção Serviços
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Procedimentos Realizados', margin, yPosition);
  yPosition += 6;

  // Tabela de serviços - com bordas suaves e cores mais leves
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
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [71, 85, 105], // slate-600 - mais neutro
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11, // um pouco maior
      halign: 'left',
    },
    bodyStyles: {
      textColor: [51, 65, 85], // slate-700
      fillColor: [255, 255, 255]
    },
    footStyles: {
      fillColor: [248, 250, 252], // slate-50 - fundo muito sutil
      textColor: [71, 85, 105], // slate-600 - mais neutro que o azul
      fontStyle: 'bold',
      fontSize: 12, // ligeiramente maior para destacar
      halign: 'left'
    },
    columnStyles: {
      0: { 
        cellWidth: (pageWidth - 2 * margin) * 0.7,
        halign: 'left'
      },
      1: { 
        cellWidth: (pageWidth - 2 * margin) * 0.3,
        halign: 'right',
        fontStyle: 'normal'
      }
    },
    didParseCell: function (data) {
      // Alinha o cabeçalho "Valor" à direita
      if (data.section === 'head' && data.column.index === 1) {
        data.cell.styles.halign = 'right';
      }
      // Alinha o valor total à direita
      if (data.section === 'foot' && data.column.index === 1) {
        data.cell.styles.halign = 'right';
        data.cell.styles.fontStyle = 'bold';
      }
      // Garante que "Serviço" e "TOTAL" fiquem à esquerda
      if (data.section === 'head' && data.column.index === 0) {
        data.cell.styles.halign = 'left';
      }
      if (data.section === 'foot' && data.column.index === 0) {
        data.cell.styles.halign = 'left';
      }
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50 - muito sutil
    },
    tableLineColor: [226, 232, 240], // slate-200 - mais suave
    tableLineWidth: 0.3,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 6;

  // Verificar se há espaço suficiente para garantia e assinaturas
  const remainingSpace = doc.internal.pageSize.height - yPosition - margin;
  const neededSpace = 12 + 6 + 25; // garantia + espaço + assinaturas
  
  if (remainingSpace < neededSpace) {
    doc.addPage();
    yPosition = margin;
  }

  // Cálculo correto para centralizar verticalmente:
  const warrantyHeight = 10; // ou o valor que estiver usando
  doc.setFillColor(254, 240, 138);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, warrantyHeight, 3, 3, 'F');

  // Centralizar texto no centro da barra
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(
    'GARANTIA DE 30 DIAS DOS SERVIÇOS PRESTADOS',
    pageWidth / 2,
    yPosition + (warrantyHeight / 2) + 1, // ajuste +1 é suficiente para fonte 8
    { align: 'center' }
  );

  yPosition += warrantyHeight + 25; // 12 dá um espaço mais elegante, pode ajustar para mais/menos
  
  const signatureWidth = (pageWidth - 3 * margin) / 2;
  
  // Assinatura do Técnico
  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura do Técnico:', margin, yPosition);
  const signatureY = yPosition + 10;
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.5);
  doc.line(margin, signatureY, margin + signatureWidth, signatureY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(data.technicianName, margin + signatureWidth / 2, signatureY + 4, { align: 'center' });
  
  // Assinatura do Cliente
  const clientSignatureX = margin + signatureWidth + 20;
  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura do Cliente:', clientSignatureX, yPosition);
  doc.line(clientSignatureX, signatureY, clientSignatureX + signatureWidth, signatureY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(data.clientName, clientSignatureX + signatureWidth / 2, signatureY + 4, { align: 'center' });

  // Salvar o PDF
  doc.save(`Orcamento_${data.serviceOrder}_${data.clientName.replace(/\s+/g, '_')}.pdf`);
}
