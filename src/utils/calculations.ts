import type { Invoice, InvoiceCalculations } from '../types/invoice';

/**
 * Pure calculation engine for invoice financials
 */
export const calculateInvoiceTotals = (invoice: Invoice): InvoiceCalculations => {
  const itemTotals: Record<string, { lineTotal: number; itemTax: number }> = {};
  
  let subtotal = 0;
  let totalPerItemTax = 0;

  invoice.items.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const lineTotal = qty * price;
    
    let itemTax = 0;
    if (invoice.taxMode === 'per_item') {
      const taxRate = Number(item.taxRate) || 0;
      itemTax = (lineTotal * taxRate) / 100;
      totalPerItemTax += itemTax;
    }

    itemTotals[item.id] = {
      lineTotal,
      itemTax,
    };

    subtotal += lineTotal;
  });

  // Calculate Discount
  let discountAmount = 0;
  const discountVal = Number(invoice.discountValue) || 0;
  if (discountVal > 0) {
    if (invoice.discountType === 'percentage') {
      discountAmount = (subtotal * Math.min(100, Math.max(0, discountVal))) / 100;
    } else {
      discountAmount = Math.min(subtotal, Math.max(0, discountVal));
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // Calculate Tax
  let taxAmount = 0;
  if (invoice.taxMode === 'global') {
    const taxRate = Number(invoice.globalTaxRate) || 0;
    taxAmount = (taxableAmount * Math.max(0, taxRate)) / 100;
  } else {
    taxAmount = totalPerItemTax;
  }

  const shippingFee = Math.max(0, Number(invoice.shippingFee) || 0);
  const grandTotal = Math.max(0, taxableAmount + taxAmount + shippingFee);
  
  const amountPaid = Math.max(0, Number(invoice.amountPaid) || 0);
  const balanceDue = Math.max(0, grandTotal - amountPaid);

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    shippingFee,
    grandTotal,
    amountPaid,
    balanceDue,
    itemTotals,
  };
};
