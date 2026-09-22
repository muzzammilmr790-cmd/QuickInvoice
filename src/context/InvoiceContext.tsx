import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Invoice, Currency, TemplateTheme, InvoiceItem, SignatureData, InvoiceStatus, InvoiceCalculations } from '../types/invoice';
import { calculateInvoiceTotals } from '../utils/calculations';
import { getEmptyInvoice } from '../utils/sampleData';
import { exportInvoiceToPDF } from '../utils/pdfExport';
import {
  getSavedInvoices,
  saveInvoiceToHistory,
  deleteInvoiceFromHistory,
  duplicateInvoice,
  createNewBlankInvoice,
} from '../utils/storage';

interface InvoiceContextType {
  invoice: Invoice;
  savedInvoices: Invoice[];
  calculations: InvoiceCalculations;
  activeMobileTab: 'edit' | 'preview';
  setActiveMobileTab: (tab: 'edit' | 'preview') => void;
  isDownloading: boolean;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;

  // Invoice field update actions
  updateInvoice: (updated: Partial<Invoice>) => void;
  updateBusiness: (updated: Partial<Invoice['business']>) => void;
  updateClient: (updated: Partial<Invoice['client']>) => void;
  updateItems: (items: InvoiceItem[]) => void;
  updatePayment: (updated: Partial<Invoice['paymentDetails']>) => void;
  updateSignature: (signature: SignatureData) => void;
  changeCurrency: (currency: Currency) => void;
  changeTheme: (theme: TemplateTheme) => void;
  
  // Dashboard & actions
  loadSampleInvoice: () => void;
  resetInvoiceDraft: () => void;
  selectInvoice: (selected: Invoice) => void;
  createNewInvoice: () => void;
  duplicateInvoiceAction: (target: Invoice) => void;
  deleteInvoiceAction: (id: string) => void;
  updateStatusInHistory: (id: string, status: InvoiceStatus) => void;
  downloadPDF: () => Promise<void>;
  printInvoice: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>(() => getSavedInvoices());
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const list = getSavedInvoices();
    return list.length > 0 ? list[0] : getEmptyInvoice();
  });

  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save active invoice to LocalStorage history
  useEffect(() => {
    if (invoice && invoice.id) {
      const updatedList = saveInvoiceToHistory(invoice);
      setSavedInvoices(updatedList);
    }
  }, [invoice]);

  // Toast auto dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Calculations memoized - only recompute when financial input properties change
  const calculations = useMemo(() => {
    return calculateInvoiceTotals(invoice);
  }, [
    invoice.items,
    invoice.taxMode,
    invoice.globalTaxRate,
    invoice.discountType,
    invoice.discountValue,
    invoice.shippingFee,
    invoice.amountPaid,
  ]);

  // Stable memoized handlers for active invoice editing
  const updateInvoice = useCallback((updated: Partial<Invoice>) => {
    setInvoice((prev) => ({ ...prev, ...updated }));
  }, []);

  const updateBusiness = useCallback((updated: Partial<Invoice['business']>) => {
    setInvoice((prev) => ({
      ...prev,
      business: { ...prev.business, ...updated },
    }));
  }, []);

  const updateClient = useCallback((updated: Partial<Invoice['client']>) => {
    setInvoice((prev) => ({
      ...prev,
      client: { ...prev.client, ...updated },
    }));
  }, []);

  const updateItems = useCallback((items: InvoiceItem[]) => {
    setInvoice((prev) => ({ ...prev, items }));
  }, []);

  const updatePayment = useCallback((updated: Partial<Invoice['paymentDetails']>) => {
    setInvoice((prev) => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, ...updated },
    }));
  }, []);

  const updateSignature = useCallback((signature: SignatureData) => {
    setInvoice((prev) => ({ ...prev, signature }));
  }, []);

  const changeCurrency = useCallback((currency: Currency) => {
    updateInvoice({ currency });
  }, [updateInvoice]);

  const changeTheme = useCallback((theme: TemplateTheme) => {
    updateInvoice({ theme });
  }, [updateInvoice]);

  const loadSampleInvoice = useCallback(() => {
    const freshSample = getEmptyInvoice();
    freshSample.id = `inv_${Date.now()}`;
    freshSample.invoiceNumber = `INV-${new Date().getFullYear()}-${String(savedInvoices.length + 1).padStart(3, '0')}`;
    setInvoice(freshSample);
    setToastMessage('Sample developer invoice loaded!');
  }, [savedInvoices.length]);

  const resetInvoiceDraft = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all invoice fields?')) {
      setInvoice((prev) => {
        const freshInvoice = getEmptyInvoice();
        freshInvoice.id = prev.id;
        freshInvoice.invoiceNumber = prev.invoiceNumber;
        freshInvoice.items = [
          {
            id: 'item_1',
            description: '',
            quantity: 1,
            unitPrice: 0,
            taxRate: 0,
          },
        ];
        return freshInvoice;
      });
      setToastMessage('Invoice draft cleared.');
    }
  }, []);

  const selectInvoice = useCallback((selected: Invoice) => {
    setInvoice(selected);
    setToastMessage(`Loaded Invoice #${selected.invoiceNumber}`);
  }, []);

  const createNewInvoice = useCallback(() => {
    const { newInvoice, updatedList } = createNewBlankInvoice();
    setSavedInvoices(updatedList);
    setInvoice(newInvoice);
    setToastMessage(`Created new Invoice #${newInvoice.invoiceNumber}`);
  }, []);

  const duplicateInvoiceAction = useCallback((target: Invoice) => {
    const { newInvoice, updatedList } = duplicateInvoice(target);
    setSavedInvoices(updatedList);
    setInvoice(newInvoice);
    setToastMessage(`Duplicated as Invoice #${newInvoice.invoiceNumber}`);
  }, []);

  const deleteInvoiceAction = useCallback((id: string) => {
    const updatedList = deleteInvoiceFromHistory(id);
    setSavedInvoices(updatedList);
    setToastMessage('Invoice deleted.');

    setInvoice((prev) => {
      if (prev.id === id) {
        if (updatedList.length > 0) {
          return updatedList[0];
        }
        const { newInvoice } = createNewBlankInvoice();
        return newInvoice;
      }
      return prev;
    });
  }, []);

  const updateStatusInHistory = useCallback((id: string, status: InvoiceStatus) => {
    setInvoice((prev) => {
      if (prev.id === id) {
        return { ...prev, status };
      }
      setSavedInvoices((prevList) => {
        const found = prevList.find((i) => i.id === id);
        if (found) {
          const updated = { ...found, status };
          return saveInvoiceToHistory(updated);
        }
        return prevList;
      });
      return prev;
    });
    setToastMessage(`Status updated to '${status.toUpperCase()}'`);
  }, []);

  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  const downloadPDF = useCallback(async () => {
    setIsDownloading(true);
    try {
      await exportInvoiceToPDF(invoice, calculations);
      setToastMessage(`Invoice #${invoice.invoiceNumber} exported successfully!`);
    } catch (e) {
      console.error(e);
      setToastMessage('Export failed. Printing instead...');
      window.print();
    } finally {
      setIsDownloading(false);
    }
  }, [invoice, calculations]);

  const value = useMemo(
    () => ({
      invoice,
      savedInvoices,
      calculations,
      activeMobileTab,
      setActiveMobileTab,
      isDownloading,
      isHistoryOpen,
      setIsHistoryOpen,
      toastMessage,
      setToastMessage,

      updateInvoice,
      updateBusiness,
      updateClient,
      updateItems,
      updatePayment,
      updateSignature,
      changeCurrency,
      changeTheme,

      loadSampleInvoice,
      resetInvoiceDraft,
      selectInvoice,
      createNewInvoice,
      duplicateInvoiceAction,
      deleteInvoiceAction,
      updateStatusInHistory,
      downloadPDF,
      printInvoice,
    }),
    [
      invoice,
      savedInvoices,
      calculations,
      activeMobileTab,
      isDownloading,
      isHistoryOpen,
      toastMessage,
      updateInvoice,
      updateBusiness,
      updateClient,
      updateItems,
      updatePayment,
      updateSignature,
      changeCurrency,
      changeTheme,
      loadSampleInvoice,
      resetInvoiceDraft,
      selectInvoice,
      createNewInvoice,
      duplicateInvoiceAction,
      deleteInvoiceAction,
      updateStatusInHistory,
      downloadPDF,
      printInvoice,
    ]
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
};

export function useInvoiceContext() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) {
    throw new Error('useInvoiceContext must be used within an InvoiceProvider');
  }
  return ctx;
}
