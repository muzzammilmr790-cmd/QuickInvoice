import React from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Percent 
} from 'lucide-react';
import type { Invoice, InvoiceItem, Currency } from '../../types/invoice';
import { formatCurrency } from '../../utils/currencies';

interface LineItemsSectionProps {
  items: InvoiceItem[];
  currency: Currency;
  taxMode: Invoice['taxMode'];
  onChange: (items: InvoiceItem[]) => void;
}

export const LineItemsSection: React.FC<LineItemsSectionProps> = React.memo(({
  items,
  currency,
  taxMode,
  onChange,
}) => {
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now(),
      description: '',
      details: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: taxMode === 'per_item' ? 18 : 0,
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id: string, updated: Partial<InvoiceItem>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      onChange([{
        id: 'item_' + Date.now(),
        description: '',
        details: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
      }]);
      return;
    }
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-card space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
            3. Items &amp; Services
          </h2>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/70 rounded-lg transition-all active:scale-95 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Line Item</span>
        </button>
      </div>

      {/* Items Table / List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const qty = Number(item.quantity) || 0;
          const price = Number(item.unitPrice) || 0;
          const rowSubtotal = qty * price;

          return (
            <div
              key={item.id}
              className="p-3 bg-neutral-50/70 hover:bg-neutral-50 rounded-xl border border-neutral-200/80 transition-all space-y-2 group"
            >
              <div className="grid grid-cols-12 gap-2 sm:gap-3 items-start">
                
                {/* Index badge */}
                <div className="col-span-12 sm:col-span-6 flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1.5">
                    {index + 1}
                  </span>
                  <div className="w-full space-y-1.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                      placeholder="Item or service description (e.g. Full-Stack Development)"
                      className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      value={item.details || ''}
                      onChange={(e) => handleUpdateItem(item.id, { details: e.target.value })}
                      placeholder="Additional details / scope (optional)"
                      className="w-full px-2.5 py-1 text-[11px] text-neutral-500 bg-white/70 border border-neutral-200/70 rounded-md focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-0.5 sm:hidden">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="Qty"
                    className="w-full px-2 py-1.5 text-xs font-semibold text-center bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-0.5 sm:hidden">
                    Price ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="Rate"
                    className="w-full px-2 py-1.5 text-xs font-semibold text-right bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Line Total & Delete */}
                <div className="col-span-4 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-1.5">
                  <span className="font-mono font-bold text-xs text-neutral-900">
                    {formatCurrency(rowSubtotal, currency)}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Per-Item Tax Rate if enabled */}
              {taxMode === 'per_item' && (
                <div className="flex items-center justify-end gap-2 text-[11px] text-neutral-500 pr-2">
                  <Percent className="w-3 h-3 text-neutral-400" />
                  <span>Item Tax %:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.taxRate || 0}
                    onChange={(e) => handleUpdateItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1.5 py-0.5 text-xs font-semibold text-center bg-white border border-neutral-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <span>%</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
});

LineItemsSection.displayName = 'LineItemsSection';

