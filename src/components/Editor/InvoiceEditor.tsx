import React from 'react';
import type { TemplateTheme } from '../../types/invoice';
import { useInvoiceContext } from '../../context/InvoiceContext';
import { MetaAndBusinessSection } from './MetaAndBusinessSection';
import { ClientSection } from './ClientSection';
import { LineItemsSection } from './LineItemsSection';
import { SummarySection } from './SummarySection';
import { PaymentSection } from './PaymentSection';
import { NotesAndSignatureSection } from './NotesAndSignatureSection';
import { LayoutTemplate, Check } from 'lucide-react';

const THEME_CARDS: { id: TemplateTheme; title: string; desc: string; previewColor: string }[] = [
  {
    id: 'modern',
    title: 'Modern Emerald',
    desc: 'Contemporary tech & freelancer aesthetic with emerald highlights.',
    previewColor: 'from-emerald-500 to-brand-600',
  },
  {
    id: 'executive',
    title: 'Executive Slate',
    desc: 'Classic corporate layout with crisp borders & monochrome luxury.',
    previewColor: 'from-slate-700 to-slate-900',
  },
  {
    id: 'minimal',
    title: 'Minimal Clean',
    desc: 'Ultra-clean spacing, modern typography & subtle tabular lines.',
    previewColor: 'from-teal-400 to-emerald-500',
  },
];

export const InvoiceEditor: React.FC = () => {
  const {
    invoice,
    calculations,
    updateInvoice,
    updateBusiness,
    updateClient,
    updateItems,
    updatePayment,
    updateSignature,
  } = useInvoiceContext();

  return (
    <div className="space-y-5 pb-12">
      
      {/* Template Theme Selector Box inside left form */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-2.5">
          <div className="w-6 h-6 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <LayoutTemplate className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display font-bold text-xs text-neutral-900 uppercase tracking-wider">
            Document Template Theme
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {THEME_CARDS.map((theme) => {
            const isSelected = invoice.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateInvoice({ theme: theme.id })}
                className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-neutral-900">
                      {theme.title}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 leading-snug">
                    {theme.desc}
                  </p>
                </div>
                <div className={`mt-2 h-1.5 w-full rounded-full bg-gradient-to-r ${theme.previewColor}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Meta & Business Details */}
      <MetaAndBusinessSection
        invoice={invoice}
        onChange={updateInvoice}
        onBusinessChange={updateBusiness}
      />

      {/* 2. Client / Billed To */}
      <ClientSection
        client={invoice.client}
        onChange={updateClient}
      />

      {/* 3. Items & Services */}
      <LineItemsSection
        items={invoice.items}
        currency={invoice.currency}
        taxMode={invoice.taxMode}
        onChange={updateItems}
      />

      {/* 4. Discounts, Taxes & Summary */}
      <SummarySection
        invoice={invoice}
        calculations={calculations}
        currency={invoice.currency}
        onChange={updateInvoice}
      />

      {/* 5. Payment & Banking */}
      <PaymentSection
        payment={invoice.paymentDetails}
        onChange={updatePayment}
      />

      {/* 6. Notes, Terms & Digital Signature */}
      <NotesAndSignatureSection
        invoice={invoice}
        onChange={updateInvoice}
        onSignatureChange={updateSignature}
      />

    </div>
  );
};
