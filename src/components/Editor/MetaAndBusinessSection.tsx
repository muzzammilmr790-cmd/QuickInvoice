import React from 'react';
import { 
  Building2, 
  Calendar, 
  Hash, 
  FileText, 
  Tag 
} from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../../types/invoice';

interface MetaAndBusinessSectionProps {
  invoice: Invoice;
  onChange: (updated: Partial<Invoice>) => void;
  onBusinessChange: (updated: Partial<Invoice['business']>) => void;
}

const STATUS_OPTIONS: { value: InvoiceStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'bg-neutral-100 text-neutral-700 border-neutral-300' },
  { value: 'pending', label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  { value: 'paid', label: 'Paid', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { value: 'overdue', label: 'Overdue', color: 'bg-rose-50 text-rose-700 border-rose-300' },
];

export const MetaAndBusinessSection: React.FC<MetaAndBusinessSectionProps> = React.memo(({
  invoice,
  onChange,
  onBusinessChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-card space-y-5">
      
      {/* Header with Title & Status Badge */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <Building2 className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
            1. Invoice &amp; Business Details
          </h2>
        </div>

        {/* Invoice Status Selector */}
        <div className="flex items-center gap-1.5 bg-neutral-50 p-1 rounded-lg border border-neutral-200/60">
          <Tag className="w-3 h-3 text-neutral-400 ml-1" />
          <div className="flex items-center gap-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ status: opt.value })}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                  invoice.status === opt.value
                    ? `${opt.color} shadow-xs`
                    : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Meta Grid (Number, PO, Dates) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Invoice Number */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Invoice No. <span className="text-brand-600">*</span>
          </label>
          <div className="relative">
            <Hash className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => onChange({ invoiceNumber: e.target.value })}
              placeholder="INV-001"
              className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* PO Number */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            P.O. Number
          </label>
          <div className="relative">
            <FileText className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={invoice.poNumber || ''}
              onChange={(e) => onChange({ poNumber: e.target.value })}
              placeholder="PO-Optional"
              className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Issue Date */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Issue Date <span className="text-brand-600">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => onChange({ issueDate: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Due Date <span className="text-brand-600">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onChange({ dueDate: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

      </div>

      {/* Business Details Section */}
      <div className="pt-2 border-t border-neutral-100 space-y-3">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Your Name / Business <span className="text-brand-600">*</span>
            </label>
            <input
              type="text"
              value={invoice.business.name}
              onChange={(e) => onBusinessChange({ name: e.target.value })}
              placeholder="e.g. Hadi DevStudio"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Email Address <span className="text-brand-600">*</span>
            </label>
            <input
              type="email"
              value={invoice.business.email}
              onChange={(e) => onBusinessChange({ email: e.target.value })}
              placeholder="yourname@domain.com"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={invoice.business.phone}
              onChange={(e) => onBusinessChange({ phone: e.target.value })}
              placeholder="+91 86055 33408"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Website / Portfolio
            </label>
            <input
              type="text"
              value={invoice.business.website || ''}
              onChange={(e) => onBusinessChange({ website: e.target.value })}
              placeholder="github.com/yourhandle"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={invoice.business.address}
              onChange={(e) => onBusinessChange({ address: e.target.value })}
              placeholder="74 Innovation Boulevard, Suite 300"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              City, State, Zip
            </label>
            <input
              type="text"
              value={invoice.business.cityStateZip}
              onChange={(e) => onBusinessChange({ cityStateZip: e.target.value })}
              placeholder="Nanded, MH 431601"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tax ID / GSTIN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Tax ID Label (e.g. GSTIN, PAN, EIN)
            </label>
            <input
              type="text"
              value={invoice.business.taxIdLabel}
              onChange={(e) => onBusinessChange({ taxIdLabel: e.target.value })}
              placeholder="GSTIN / PAN"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Tax ID Value
            </label>
            <input
              type="text"
              value={invoice.business.taxIdValue}
              onChange={(e) => onBusinessChange({ taxIdValue: e.target.value })}
              placeholder="27AABCM8920C1Z5"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors font-mono"
            />
          </div>
        </div>

      </div>

    </div>
  );
});

MetaAndBusinessSection.displayName = 'MetaAndBusinessSection';

