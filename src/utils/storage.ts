import type { Invoice } from '../types/invoice';
import { getEmptyInvoice, SAMPLE_INVOICE } from './sampleData';

const SAVED_INVOICES_KEY = 'quickinvoice_saved_invoices_v1';
const ACTIVE_DRAFT_KEY = 'quickinvoice_draft_v1';

/**
 * Get all saved invoices from localStorage.
 */
export function getSavedInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(SAVED_INVOICES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read saved invoices from localStorage:', e);
  }

  // Fallback: If no saved list exists, initialize with sample invoice or migrated draft
  return migrateSingleDraftToHistory();
}

/**
 * Migrate single active draft (if exists) into saved invoices list.
 */
export function migrateSingleDraftToHistory(): Invoice[] {
  let initialList: Invoice[] = [SAMPLE_INVOICE];
  try {
    const draftRaw = localStorage.getItem(ACTIVE_DRAFT_KEY);
    if (draftRaw) {
      const draft = JSON.parse(draftRaw) as Invoice;
      if (draft && draft.id) {
        initialList = [draft];
      }
    }
  } catch (e) {
    console.warn('Failed to migrate draft:', e);
  }

  try {
    localStorage.setItem(SAVED_INVOICES_KEY, JSON.stringify(initialList));
  } catch (e) {
    console.warn('Failed to save initial list to localStorage:', e);
  }

  return initialList;
}

/**
 * Save or update an invoice in localStorage history.
 */
export function saveInvoiceToHistory(invoice: Invoice): Invoice[] {
  try {
    const current = getSavedInvoices();
    const index = current.findIndex((inv) => inv.id === invoice.id);
    let updated: Invoice[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = invoice;
    } else {
      updated = [invoice, ...current];
    }

    localStorage.setItem(SAVED_INVOICES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save invoice to history:', e);
    return getSavedInvoices();
  }
}

/**
 * Delete an invoice from localStorage history.
 */
export function deleteInvoiceFromHistory(id: string): Invoice[] {
  try {
    const current = getSavedInvoices();
    const updated = current.filter((inv) => inv.id !== id);
    localStorage.setItem(SAVED_INVOICES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to delete invoice from history:', e);
    return getSavedInvoices();
  }
}

/**
 * Generate a clean incremented invoice number based on current count.
 */
function generateNextInvoiceNumber(existingInvoices: Invoice[]): string {
  const currentYear = new Date().getFullYear();
  const count = existingInvoices.length + 1;
  const numStr = String(count).padStart(3, '0');
  return `INV-${currentYear}-${numStr}`;
}

/**
 * Duplicate an invoice as a fresh draft.
 */
export function duplicateInvoice(invoice: Invoice): { newInvoice: Invoice; updatedList: Invoice[] } {
  const current = getSavedInvoices();
  const newNum = generateNextInvoiceNumber(current);
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate 14 days due date default
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 14);
  const dueStr = dueDateObj.toISOString().split('T')[0];

  const newInvoice: Invoice = {
    ...JSON.parse(JSON.stringify(invoice)), // Deep clone
    id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    invoiceNumber: newNum,
    poNumber: invoice.poNumber ? `${invoice.poNumber}-COPY` : '',
    issueDate: today,
    dueDate: dueStr,
    status: 'draft',
    amountPaid: 0,
  };

  const updatedList = saveInvoiceToHistory(newInvoice);
  return { newInvoice, updatedList };
}

/**
 * Create a fresh new blank invoice and save to history.
 */
export function createNewBlankInvoice(): { newInvoice: Invoice; updatedList: Invoice[] } {
  const current = getSavedInvoices();
  const fresh = getEmptyInvoice();
  fresh.id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  fresh.invoiceNumber = generateNextInvoiceNumber(current);
  fresh.status = 'draft';

  const updatedList = saveInvoiceToHistory(fresh);
  return { newInvoice: fresh, updatedList };
}
