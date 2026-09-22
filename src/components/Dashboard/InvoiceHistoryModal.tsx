import React, { useState, useMemo } from 'react';
import type { Invoice, InvoiceStatus } from '../../types/invoice';
import { calculateInvoiceTotals } from '../../utils/calculations';
import { exportInvoiceToPDF } from '../../utils/pdfExport';
import { useInvoiceContext } from '../../context/InvoiceContext';
import {
  X,
  Plus,
  Search,
  Copy,
  Trash2,
  Download,
  Edit3,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  ArrowUpDown,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; bg: string; text: string; border: string; icon: React.FC<{ className?: string }> }
> = {
  draft: {
    label: 'Draft',
    bg: 'bg-neutral-100',
    text: 'text-neutral-700',
    border: 'border-neutral-300',
    icon: Clock,
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    icon: AlertCircle,
  },
  paid: {
    label: 'Paid',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    icon: CheckCircle2,
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-300',
    icon: AlertCircle,
  },
};

export const InvoiceHistoryModal: React.FC = React.memo(() => {
  const {
    isHistoryOpen,
    setIsHistoryOpen,
    savedInvoices,
    invoice: activeInvoice,
    selectInvoice,
    createNewInvoice,
    duplicateInvoiceAction,
    deleteInvoiceAction,
    updateStatusInHistory,
  } = useInvoiceContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | 'all'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Financial Metrics Summary
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;

    savedInvoices.forEach((inv) => {
      const calc = calculateInvoiceTotals(inv);
      if (inv.status === 'paid') {
        totalRevenue += calc.grandTotal;
      } else if (inv.status === 'pending') {
        pendingAmount += calc.balanceDue;
      } else if (inv.status === 'overdue') {
        overdueAmount += calc.balanceDue;
      }
    });

    return {
      count: savedInvoices.length,
      totalRevenue,
      pendingAmount,
      overdueAmount,
    };
  }, [savedInvoices]);

  // Counts by status
  const statusCounts = useMemo(() => {
    const counts: Record<InvoiceStatus | 'all', number> = {
      all: savedInvoices.length,
      draft: 0,
      pending: 0,
      paid: 0,
      overdue: 0,
    };
    savedInvoices.forEach((inv) => {
      if (counts[inv.status] !== undefined) {
        counts[inv.status]++;
      }
    });
    return counts;
  }, [savedInvoices]);

  // Filtered & Searched Invoices
  const filteredInvoices = useMemo(() => {
    return savedInvoices.filter((inv) => {
      // Status filter
      if (selectedStatus !== 'all' && inv.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        (inv.poNumber && inv.poNumber.toLowerCase().includes(q)) ||
        inv.client.name.toLowerCase().includes(q) ||
        (inv.client.companyName && inv.client.companyName.toLowerCase().includes(q)) ||
        inv.client.email.toLowerCase().includes(q)
      );
    });
  }, [savedInvoices, selectedStatus, searchQuery]);

  if (!isHistoryOpen) return null;

  const handleClose = () => setIsHistoryOpen(false);

  const handleDownloadSinglePDF = async (e: React.MouseEvent, inv: Invoice) => {
    e.stopPropagation();
    setDownloadingId(inv.id);
    try {
      const calc = calculateInvoiceTotals(inv);
      await exportInvoiceToPDF(inv, calc);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-xs">
              <FolderKanban className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-neutral-900 leading-tight">
                Invoice History &amp; Dashboard
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Manage, track, duplicate, and search all your saved invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                createNewInvoice();
                handleClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-neutral-200 bg-white divide-x divide-y sm:divide-y-0 divide-neutral-100">
          <div className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 mb-1">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Total Invoices</span>
            </div>
            <div className="font-display font-bold text-xl text-neutral-900">{metrics.count}</div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Total Collected</span>
            </div>
            <div className="font-display font-bold text-xl text-emerald-700">
              ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Amount</span>
            </div>
            <div className="font-display font-bold text-xl text-amber-700">
              ${metrics.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Overdue Amount</span>
            </div>
            <div className="font-display font-bold text-xl text-rose-700">
              ${metrics.overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 bg-neutral-50/50 border-b border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-neutral-200/60 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {(['all', 'draft', 'pending', 'paid', 'overdue'] as const).map((st) => {
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isSelected ? 'bg-neutral-100 text-neutral-700' : 'bg-neutral-300/50 text-neutral-600'
                    }`}
                  >
                    {statusCounts[st]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice #, client..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>

        </div>

        {/* Invoice List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h3 className="font-display font-bold text-sm text-neutral-700">No invoices found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Try clearing your search filters or selected status tab.'
                  : 'Start by creating your first invoice!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredInvoices.map((inv) => {
                const isActive = inv.id === activeInvoice.id;
                const totals = calculateInvoiceTotals(inv);
                const statusCfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.draft;
                const StatusIcon = statusCfg.icon;

                return (
                  <div
                    key={inv.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isActive
                        ? 'border-brand-500 bg-brand-50/20 shadow-xs ring-1 ring-brand-500/30'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                    }`}
                  >
                    {/* Left: Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 font-mono text-xs font-bold shrink-0">
                        #
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-sm text-neutral-900 font-mono">
                            {inv.invoiceNumber}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white">
                              Active Editor
                            </span>
                          )}

                          {/* Status Badge Dropdown */}
                          <div className="relative inline-flex items-center">
                            <select
                              value={inv.status}
                              onChange={(e) => updateStatusInHistory(inv.id, e.target.value as InvoiceStatus)}
                              onClick={(e) => e.stopPropagation()}
                              className={`pl-6 pr-6 py-0.5 rounded text-[11px] font-semibold border appearance-none cursor-pointer focus:outline-none transition-colors ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                              title="Click to change invoice status"
                            >
                              <option value="draft">Draft</option>
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </select>
                            <StatusIcon className={`w-3 h-3 absolute left-2 pointer-events-none ${statusCfg.text}`} />
                            <ArrowUpDown className={`w-2.5 h-2.5 absolute right-2 pointer-events-none ${statusCfg.text}`} />
                          </div>
                        </div>

                        <div className="text-xs text-neutral-600 truncate font-medium">
                          <span className="font-bold text-neutral-800">
                            {inv.client.name || 'Unnamed Client'}
                          </span>
                          {inv.client.companyName && (
                            <span className="text-neutral-400"> • {inv.client.companyName}</span>
                          )}
                        </div>

                        <div className="text-[11px] text-neutral-400 flex items-center gap-3 flex-wrap">
                          <span>Issued: {inv.issueDate || 'N/A'}</span>
                          <span>Due: {inv.dueDate || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Total & Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-neutral-100 pt-3 sm:pt-0">
                      
                      {/* Amount */}
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                          Grand Total
                        </div>
                        <div className="font-display font-bold text-base text-neutral-900 font-mono">
                          {inv.currency.symbol}
                          {totals.grandTotal.toLocaleString(undefined, {
                            minimumFractionDigits: inv.currency.decimalPlaces,
                            maximumFractionDigits: inv.currency.decimalPlaces,
                          })}
                        </div>
                      </div>

                      {/* Action Button Row */}
                      <div className="flex items-center gap-1.5">
                        
                        {/* Edit / Load Button */}
                        <button
                          type="button"
                          onClick={() => {
                            selectInvoice(inv);
                            handleClose();
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
                          title="Load into active editor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Duplicate Button */}
                        <button
                          type="button"
                          onClick={() => {
                            duplicateInvoiceAction(inv);
                            handleClose();
                          }}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-all active:scale-95"
                          title="Duplicate as new draft"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Download PDF Button */}
                        <button
                          type="button"
                          disabled={downloadingId === inv.id}
                          onClick={(e) => handleDownloadSinglePDF(e, inv)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                          title="Export PDF"
                        >
                          {downloadingId === inv.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete invoice #${inv.invoiceNumber}?`)) {
                              deleteInvoiceAction(inv.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all active:scale-95"
                          title="Delete invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50/80 text-xs text-neutral-500 flex items-center justify-between">
          <span>Showing {filteredInvoices.length} of {savedInvoices.length} saved invoices</span>
          <span className="font-medium text-neutral-400">100% Private Client-Side Storage</span>
        </div>

      </div>
    </div>
  );
});

InvoiceHistoryModal.displayName = 'InvoiceHistoryModal';
