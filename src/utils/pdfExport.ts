import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice, InvoiceCalculations, TemplateTheme } from '../types/invoice';
import { calculateInvoiceTotals } from './calculations';
import { formatCurrency } from './currencies';

interface ThemePalette {
  primary: [number, number, number];
  primaryDark: [number, number, number];
  accentBg: [number, number, number];
  textDark: [number, number, number];
  textMuted: [number, number, number];
  tableHeaderBg: [number, number, number];
  tableHeaderColor: [number, number, number];
  border: [number, number, number];
}

const getPalette = (theme: TemplateTheme): ThemePalette => {
  switch (theme) {
    case 'modern':
      return {
        primary: [5, 150, 105],       // Emerald 600 #059669
        primaryDark: [4, 120, 87],    // Emerald 700 #047857
        accentBg: [240, 253, 244],   // Emerald 50 #f0fdf4
        textDark: [24, 24, 27],       // Zinc 900
        textMuted: [113, 113, 122],   // Zinc 500
        tableHeaderBg: [5, 150, 105],
        tableHeaderColor: [255, 255, 255],
        border: [228, 228, 231],
      };
    case 'executive':
      return {
        primary: [30, 58, 138],       // Blue 900 #1e3a8a
        primaryDark: [30, 64, 175],   // Blue 700 #1e40af
        accentBg: [240, 249, 255],   // Sky 50 #f0f9ff
        textDark: [15, 23, 42],       // Slate 900
        textMuted: [100, 116, 139],   // Slate 500
        tableHeaderBg: [30, 58, 138],
        tableHeaderColor: [255, 255, 255],
        border: [226, 232, 240],
      };
    case 'minimal':
    default:
      return {
        primary: [24, 24, 27],        // Zinc 900 #18181b
        primaryDark: [39, 39, 42],    // Zinc 800
        accentBg: [244, 244, 245],   // Zinc 100 #f4f4f5
        textDark: [24, 24, 27],
        textMuted: [113, 113, 122],
        tableHeaderBg: [24, 24, 27],
        tableHeaderColor: [255, 255, 255],
        border: [228, 228, 231],
      };
  }
};

/**
 * Asynchronously loads an image from a URL or Data URL
 */
const loadImage = (src?: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

/**
 * High-performance vector PDF export engine.
 * Generates selectable, searchable, small vector-based PDFs with intelligent page breaking.
 */
export const exportInvoiceToPDF = async (
  arg1: HTMLElement | Invoice,
  arg2?: Invoice | InvoiceCalculations,
  arg3?: InvoiceCalculations
): Promise<void> => {
  try {
    let invoice: Invoice;
    let calculations: InvoiceCalculations;

    // Support flexible function signatures:
    // 1. (invoice, calculations)
    // 2. (element, invoice, calculations)
    if ('invoiceNumber' in arg1) {
      invoice = arg1 as Invoice;
      calculations = (arg2 as InvoiceCalculations) || calculateInvoiceTotals(invoice);
    } else {
      invoice = arg2 as Invoice;
      calculations = arg3 || calculateInvoiceTotals(invoice);
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const palette = getPalette(invoice.theme);
    const currency = invoice.currency;

    // Load assets in parallel
    const [logoImg, signatureImg] = await Promise.all([
      loadImage(invoice.business.logoUrl),
      loadImage(invoice.signature.dataUrl),
    ]);

    const marginX = 15;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - marginX * 2; // 180mm
    let currentY = 15;

    // --- Helper for Page Breaks ---
    const checkAddPage = (neededHeight: number) => {
      if (currentY + neededHeight > pageHeight - 20) {
        doc.addPage();
        currentY = 15;
        return true;
      }
      return false;
    };

    // --- Top Watermark for Paid Invoices ---
    if (invoice.status === 'paid') {
      doc.saveGraphicsState();
      doc.setTextColor(16, 185, 129); // Emerald
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(60);
      // doc.setGState(new doc.GState({ opacity: 0.15 })); // watermark opacity
      doc.text('PAID', pageWidth / 2, 80, { align: 'center', angle: -20 });
      doc.restoreGraphicsState();
    }

    // --- Header Section ---
    const headerStartY = currentY;

    // Business Info (Left side)
    if (logoImg) {
      const maxLogoW = 50;
      const maxLogoH = 20;
      const imgRatio = logoImg.width / logoImg.height;
      let w = maxLogoW;
      let h = maxLogoW / imgRatio;
      if (h > maxLogoH) {
        h = maxLogoH;
        w = maxLogoH * imgRatio;
      }
      doc.addImage(logoImg, 'PNG', marginX, currentY, w, h);
      currentY += h + 4;
    } else {
      // Business Icon Badge & Name
      doc.setFillColor(...palette.primary);
      doc.roundedRect(marginX, currentY, 8, 8, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      const initial = (invoice.business.name || 'Q').charAt(0).toUpperCase();
      doc.text(initial, marginX + 4, currentY + 5.5, { align: 'center' });

      doc.setTextColor(...palette.textDark);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(invoice.business.name || 'Your Business Name', marginX + 11, currentY + 6.5);
      currentY += 12;
    }

    // Business details address text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...palette.textMuted);

    const busDetails: string[] = [];
    if (invoice.business.address) busDetails.push(invoice.business.address);
    if (invoice.business.cityStateZip || invoice.business.country) {
      busDetails.push(
        [invoice.business.cityStateZip, invoice.business.country].filter(Boolean).join(', ')
      );
    }
    const contactLine = [invoice.business.email, invoice.business.phone].filter(Boolean).join(' • ');
    if (contactLine) busDetails.push(contactLine);

    if (invoice.business.taxIdValue) {
      busDetails.push(
        `${invoice.business.taxIdLabel || 'Tax ID'}: ${invoice.business.taxIdValue}`
      );
    }

    busDetails.forEach((line) => {
      doc.text(line, marginX, currentY);
      currentY += 3.8;
    });

    const busInfoEndY = currentY;

    // Invoice Title & Meta (Right side)
    let metaY = headerStartY;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...palette.primary);
    doc.text('INVOICE', pageWidth - marginX, metaY + 4, { align: 'right' });

    metaY += 10;
    doc.setFontSize(10);
    doc.setTextColor(...palette.textDark);
    doc.text(`#${invoice.invoiceNumber || 'INV-001'}`, pageWidth - marginX, metaY, { align: 'right' });

    metaY += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...palette.textMuted);

    if (invoice.poNumber) {
      doc.text(`P.O. #: ${invoice.poNumber}`, pageWidth - marginX, metaY, { align: 'right' });
      metaY += 4;
    }
    doc.text(`Issue Date: ${invoice.issueDate || '-'}`, pageWidth - marginX, metaY, { align: 'right' });
    metaY += 4;
    doc.text(`Due Date: ${invoice.dueDate || '-'}`, pageWidth - marginX, metaY, { align: 'right' });
    metaY += 5;

    // Status Badge
    const statusText = (invoice.status || 'draft').toUpperCase();
    const badgeW = doc.getTextWidth(statusText) + 8;
    const badgeH = 5;
    const badgeX = pageWidth - marginX - badgeW;

    let badgeBg: [number, number, number] = [244, 244, 245];
    let badgeFg: [number, number, number] = [82, 82, 91];

    if (invoice.status === 'paid') {
      badgeBg = [209, 250, 229];
      badgeFg = [4, 120, 87];
    } else if (invoice.status === 'pending') {
      badgeBg = [254, 243, 199];
      badgeFg = [180, 83, 9];
    } else if (invoice.status === 'overdue') {
      badgeBg = [254, 226, 226];
      badgeFg = [190, 18, 60];
    }

    doc.setFillColor(...badgeBg);
    doc.roundedRect(badgeX, metaY, badgeW, badgeH, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...badgeFg);
    doc.text(statusText, badgeX + badgeW / 2, metaY + 3.5, { align: 'center' });

    // Set currentY past header
    currentY = Math.max(busInfoEndY, metaY + badgeH) + 6;

    // Header Divider Line
    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.4);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 6;

    // --- Billed To Section & Balance Due Card ---
    const billedToStartY = currentY;

    // Left Column: Client Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...palette.primaryDark);
    doc.text('BILLED TO:', marginX, currentY);

    currentY += 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...palette.textDark);
    doc.text(invoice.client.name || 'Client Name / Contact', marginX, currentY);

    currentY += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...palette.textMuted);

    if (invoice.client.companyName) {
      doc.text(invoice.client.companyName, marginX, currentY);
      currentY += 4;
    }
    if (invoice.client.address) {
      doc.text(invoice.client.address, marginX, currentY);
      currentY += 4;
    }
    if (invoice.client.cityStateZip || invoice.client.country) {
      doc.text(
        [invoice.client.cityStateZip, invoice.client.country].filter(Boolean).join(', '),
        marginX,
        currentY
      );
      currentY += 4;
    }
    const clientContact = [invoice.client.email, invoice.client.phone].filter(Boolean).join(' • ');
    if (clientContact) {
      doc.text(clientContact, marginX, currentY);
      currentY += 4;
    }
    if (invoice.client.taxIdValue) {
      doc.text(
        `${invoice.client.taxIdLabel || 'Tax ID'}: ${invoice.client.taxIdValue}`,
        marginX,
        currentY
      );
      currentY += 4;
    }

    const clientInfoEndY = currentY;

    // Right Column Box: Total Balance Due Highlight
    const cardWidth = 70;
    const cardHeight = 22;
    const cardX = pageWidth - marginX - cardWidth;
    const cardY = billedToStartY;

    doc.setFillColor(...palette.accentBg);
    doc.setDrawColor(...palette.border);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...palette.primaryDark);
    doc.text('TOTAL BALANCE DUE', cardX + cardWidth - 6, cardY + 5.5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...palette.textDark);
    const balanceText = formatCurrency(calculations.balanceDue, currency);
    doc.text(balanceText, cardX + cardWidth - 6, cardY + 12.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...palette.textMuted);
    doc.text(`Due: ${invoice.dueDate || 'Upon Receipt'}`, cardX + cardWidth - 6, cardY + 18, {
      align: 'right',
    });

    currentY = Math.max(clientInfoEndY, cardY + cardHeight) + 6;

    // --- Line Items Table ---
    const isPerItemTax = invoice.taxMode === 'per_item';
    const tableHeaders = isPerItemTax
      ? ['Item & Description', 'Qty', 'Unit Price', 'Tax %', 'Amount']
      : ['Item & Description', 'Qty', 'Unit Price', 'Amount'];

    const tableRows = invoice.items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const lineTotal = qty * price;
      const desc = item.details
        ? `${item.description || 'Item'}\n${item.details}`
        : item.description || 'Item';

      if (isPerItemTax) {
        return [
          desc,
          qty.toString(),
          formatCurrency(price, currency),
          item.taxRate ? `${item.taxRate}%` : '0%',
          formatCurrency(lineTotal, currency),
        ];
      }
      return [
        desc,
        qty.toString(),
        formatCurrency(price, currency),
        formatCurrency(lineTotal, currency),
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableRows,
      theme: 'grid',
      margin: { left: marginX, right: marginX },
      headStyles: {
        fillColor: palette.tableHeaderBg,
        textColor: palette.tableHeaderColor,
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: 3.5,
      },
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 3.5,
        textColor: palette.textDark,
        overflow: 'linebreak',
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: isPerItemTax
        ? {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 16, halign: 'center' },
            2: { cellWidth: 32, halign: 'right' },
            3: { cellWidth: 20, halign: 'right' },
            4: { cellWidth: 32, halign: 'right' },
          }
        : {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 40, halign: 'right' },
            3: { cellWidth: 40, halign: 'right' },
          },
    });

    // Get table bottom Y coordinate
    currentY = (doc as any).lastAutoTable.finalY + 8;

    // --- Financial Totals Breakdown & Notes/Payment ---
    checkAddPage(50);

    const totalsStartX = pageWidth - marginX - 75;
    const totalsWidth = 75;
    let totalsY = currentY;

    // Build Totals Rows
    const totalsData: Array<{ label: string; value: string; isBold?: boolean; isHighlight?: boolean }> = [
      { label: 'Subtotal', value: formatCurrency(calculations.subtotal, currency) },
    ];

    if (calculations.discountAmount > 0) {
      const discLabel =
        invoice.discountType === 'percentage'
          ? `Discount (${invoice.discountValue}%)`
          : 'Discount';
      totalsData.push({
        label: discLabel,
        value: `-${formatCurrency(calculations.discountAmount, currency)}`,
      });
    }

    if (calculations.taxAmount > 0) {
      const taxLabel =
        invoice.taxMode === 'global'
          ? `${invoice.taxLabel || 'Tax'} (${invoice.globalTaxRate}%)`
          : `${invoice.taxLabel || 'Tax'}`;
      totalsData.push({
        label: taxLabel,
        value: formatCurrency(calculations.taxAmount, currency),
      });
    }

    if (calculations.shippingFee > 0) {
      totalsData.push({
        label: 'Shipping / Handling',
        value: formatCurrency(calculations.shippingFee, currency),
      });
    }

    totalsData.push({
      label: 'Grand Total',
      value: formatCurrency(calculations.grandTotal, currency),
      isBold: true,
    });

    if (calculations.amountPaid > 0) {
      totalsData.push({
        label: 'Amount Paid',
        value: `-${formatCurrency(calculations.amountPaid, currency)}`,
      });
      totalsData.push({
        label: 'Balance Due',
        value: formatCurrency(calculations.balanceDue, currency),
        isBold: true,
        isHighlight: true,
      });
    }

    // Render Financial Summary Table
    totalsData.forEach((row) => {
      if (row.isHighlight) {
        doc.setFillColor(...palette.accentBg);
        doc.roundedRect(totalsStartX - 2, totalsY - 3.5, totalsWidth + 2, 7, 1, 1, 'F');
      }

      doc.setFont('helvetica', row.isBold ? 'bold' : 'normal');
      doc.setFontSize(row.isBold ? 9.5 : 8.5);
      doc.setTextColor(row.isHighlight ? palette.primaryDark[0] : palette.textDark[0], row.isHighlight ? palette.primaryDark[1] : palette.textDark[1], row.isHighlight ? palette.primaryDark[2] : palette.textDark[2]);

      doc.text(row.label, totalsStartX, totalsY);
      doc.text(row.value, totalsStartX + totalsWidth, totalsY, { align: 'right' });
      totalsY += 5.5;
    });

    // Left Column: Payment Details
    let leftSectionY = currentY;

    const hasPaymentInfo =
      invoice.paymentDetails.bankName ||
      invoice.paymentDetails.accountNumber ||
      invoice.paymentDetails.upiOrPaypal ||
      invoice.paymentDetails.paymentInstructions;

    if (hasPaymentInfo) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...palette.primaryDark);
      doc.text('PAYMENT DETAILS', marginX, leftSectionY);
      leftSectionY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...palette.textDark);

      const payLines: string[] = [];
      if (invoice.paymentDetails.bankName) {
        payLines.push(`Bank: ${invoice.paymentDetails.bankName}`);
      }
      if (invoice.paymentDetails.accountName) {
        payLines.push(`Account Name: ${invoice.paymentDetails.accountName}`);
      }
      if (invoice.paymentDetails.accountNumber) {
        payLines.push(`Account #: ${invoice.paymentDetails.accountNumber}`);
      }
      if (invoice.paymentDetails.routingOrIfsc) {
        payLines.push(`Routing/IFSC: ${invoice.paymentDetails.routingOrIfsc}`);
      }
      if (invoice.paymentDetails.swiftBic) {
        payLines.push(`SWIFT/BIC: ${invoice.paymentDetails.swiftBic}`);
      }
      if (invoice.paymentDetails.upiOrPaypal) {
        payLines.push(`UPI/PayPal: ${invoice.paymentDetails.upiOrPaypal}`);
      }
      if (invoice.paymentDetails.paymentInstructions) {
        payLines.push(`Note: ${invoice.paymentDetails.paymentInstructions}`);
      }

      payLines.forEach((line) => {
        doc.text(line, marginX, leftSectionY);
        leftSectionY += 3.8;
      });

      leftSectionY += 4;
    }

    currentY = Math.max(totalsY, leftSectionY) + 6;

    // --- Notes & Terms Section ---
    if (invoice.notes || invoice.terms) {
      checkAddPage(30);

      if (invoice.notes) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...palette.primaryDark);
        doc.text('NOTES:', marginX, currentY);
        currentY += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...palette.textMuted);
        const splitNotes = doc.splitTextToSize(invoice.notes, contentWidth);
        doc.text(splitNotes, marginX, currentY);
        currentY += splitNotes.length * 3.5 + 4;
      }

      if (invoice.terms) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...palette.primaryDark);
        doc.text('TERMS & CONDITIONS:', marginX, currentY);
        currentY += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...palette.textMuted);
        const splitTerms = doc.splitTextToSize(invoice.terms, contentWidth);
        doc.text(splitTerms, marginX, currentY);
        currentY += splitTerms.length * 3.5 + 4;
      }
    }

    // --- Signature Section ---
    if (invoice.signature && invoice.signature.type !== 'none') {
      checkAddPage(35);
      currentY += 4;

      const sigBoxWidth = 60;
      const sigX = pageWidth - marginX - sigBoxWidth;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...palette.primaryDark);
      doc.text('AUTHORIZED SIGNATURE:', sigX, currentY);
      currentY += 4;

      if ((invoice.signature.type === 'drawn' || invoice.signature.type === 'image') && signatureImg) {
        const sigH = 15;
        const sigW = 40;
        doc.addImage(signatureImg, 'PNG', sigX, currentY, sigW, sigH);
        currentY += sigH + 2;
      } else if (invoice.signature.type === 'typed' && invoice.signature.signeeName) {
        doc.setFont('times', 'italic');
        doc.setFontSize(16);
        doc.setTextColor(...palette.textDark);
        doc.text(invoice.signature.signeeName, sigX, currentY + 6);
        currentY += 10;
      } else {
        currentY += 10;
      }

      doc.setDrawColor(...palette.border);
      doc.line(sigX, currentY, sigX + sigBoxWidth, currentY);
      currentY += 4;

      if (invoice.signature.signeeName) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...palette.textDark);
        doc.text(invoice.signature.signeeName, sigX, currentY);
        currentY += 3.5;
      }

      if (invoice.signature.title) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...palette.textMuted);
        doc.text(invoice.signature.title, sigX, currentY);
      }
    }

    // --- Pagination / Footer on All Pages ---
    const totalPages = (doc as any).internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const footerY = pageHeight - 10;

      doc.setDrawColor(...palette.border);
      doc.setLineWidth(0.3);
      doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...palette.textMuted);

      doc.text(
        invoice.business.name ? `Thank you for your business! — ${invoice.business.name}` : 'Thank you for your business!',
        marginX,
        footerY
      );

      doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX, footerY, { align: 'right' });
    }

    // Save File
    const sanitizedNumber = (invoice.invoiceNumber || 'INV-001').replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `Invoice-${sanitizedNumber}.pdf`;

    doc.save(filename);
  } catch (error) {
    console.error('Error generating vector PDF:', error);
    window.print();
  }
};
