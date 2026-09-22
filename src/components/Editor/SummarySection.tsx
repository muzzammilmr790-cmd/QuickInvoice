import React from 'react';
import { 
  Calculator, 
  Receipt 
} from 'lucide-react';
import type { Invoice, InvoiceCalculations, Currency } from '../../types/invoice';
import { formatCurrency } from '../../utils/currencies';

interface SummarySectionProps {
  invoice: Invoice;
  calculations: InvoiceCalculations;
  currency: Currency;
  onChange: (updated: Partial<Invoice>) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = React.memo(({
  invoice,
  calculations,
  currency,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-card space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Calculator className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
            4. Discounts, Taxes &amp; Summary
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Col: Adjustment Controls */}
        <div className="space-y-3">
          
          {/* Discount Settings */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1">
                <span>Discount</span>
              </label>
              
              {/* Type Toggle */}
              <div className="flex items-center bg-neutral-100 p-0.5 rounded-md border border-neutral-200">
                <button
                  type="button"
                  onClick={() => onChange({ discountType: 'percentage' })}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    invoice.discountType === 'percentage'
                      ? 'bg-white text-brand-700 shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  % Percentage
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ discountType: 'fixed' })}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    invoice.discountType === 'fixed'
                      ? 'bg-white text-brand-700 shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  Fixed ({currency.symbol})
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.discountValue || 0}
                onChange={(e) => onChange({ discountValue: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1.5 text-xs font-bold text-neutral-400">
                {invoice.discountType === 'percentage' ? '%' : currency.symbol}
              </span>
            </div>
          </div>

          {/* Tax Mode & Global Tax Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                Tax Calculation Mode
              </label>

              <div className="flex items-center bg-neutral-100 p-0.5 rounded-md border border-neutral-200">
                <button
                  type="button"
                  onClick={() => onChange({ taxMode: 'global' })}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    invoice.taxMode === 'global'
                      ? 'bg-white text-brand-700 shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  Global Rate
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ taxMode: 'per_item' })}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    invoice.taxMode === 'per_item'
                      ? 'bg-white text-brand-700 shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  Per-Item Tax
                </button>
              </div>
            </div>

            {invoice.taxMode === 'global' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={invoice.taxLabel}
                    onChange={(e) => onChange({ taxLabel: e.target.value })}
                    placeholder="Tax Label (e.g. GST, VAT)"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={invoice.globalTaxRate || 0}
                    onChange={(e) => onChange({ globalTaxRate: parseFloat(e.target.value) || 0 })}
                    placeholder="Rate %"
                    className="w-full pl-3 pr-6 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs font-bold text-neutral-400">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Fee & Amount Paid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Shipping / Misc Fee
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.shippingFee || 0}
                onChange={(e) => onChange({ shippingFee: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
                Amount Paid
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.amountPaid || 0}
                onChange={(e) => onChange({ amountPaid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Right Col: Calculation Breakdown Box */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 flex flex-col justify-between space-y-2">
          
          <div className="space-y-2 text-xs">
            
            {/* Subtotal */}
            <div className="flex justify-between items-center text-neutral-600 font-medium">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-neutral-800">
                {formatCurrency(calculations.subtotal, currency)}
              </span>
            </div>

            {/* Discount */}
            {calculations.discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-medium">
                <span>Discount:</span>
                <span className="font-mono font-semibold">
                  -{formatCurrency(calculations.discountAmount, currency)}
                </span>
              </div>
            )}

            {/* Tax */}
            <div className="flex justify-between items-center text-neutral-600 font-medium">
              <span>{invoice.taxLabel || 'Tax'}:</span>
              <span className="font-mono font-semibold text-neutral-800">
                +{formatCurrency(calculations.taxAmount, currency)}
              </span>
            </div>

            {/* Shipping */}
            {calculations.shippingFee > 0 && (
              <div className="flex justify-between items-center text-neutral-600 font-medium">
                <span>Shipping:</span>
                <span className="font-mono font-semibold text-neutral-800">
                  +{formatCurrency(calculations.shippingFee, currency)}
                </span>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-2 flex justify-between items-center text-sm font-bold text-neutral-900">
              <span>Grand Total:</span>
              <span className="font-mono font-extrabold text-base text-neutral-900">
                {formatCurrency(calculations.grandTotal, currency)}
              </span>
            </div>

            {calculations.amountPaid > 0 && (
              <div className="flex justify-between items-center text-xs text-neutral-600 font-medium">
                <span>Amount Paid:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  -{formatCurrency(calculations.amountPaid, currency)}
                </span>
              </div>
            )}

          </div>

          {/* Balance Due Banner */}
          <div className="bg-white border-2 border-brand-500/40 rounded-lg p-3 flex justify-between items-center shadow-xs">
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Net Balance Due
              </p>
              <p className="text-lg font-display font-extrabold text-brand-700 font-mono">
                {formatCurrency(calculations.balanceDue, currency)}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
});

SummarySection.displayName = 'SummarySection';

