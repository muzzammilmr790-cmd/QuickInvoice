import React from 'react';
import { Landmark } from 'lucide-react';
import type { Invoice } from '../../types/invoice';

interface PaymentSectionProps {
  payment: Invoice['paymentDetails'];
  onChange: (updated: Partial<Invoice['paymentDetails']>) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = React.memo(({
  payment,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-card space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <Landmark className="w-4 h-4" />
        </div>
        <h2 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
          5. Payment &amp; Banking Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Bank Name
          </label>
          <input
            type="text"
            value={payment.bankName}
            onChange={(e) => onChange({ bankName: e.target.value })}
            placeholder="e.g. Chase / HDFC / Silicon Valley Bank"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Account Holder Name
          </label>
          <input
            type="text"
            value={payment.accountName}
            onChange={(e) => onChange({ accountName: e.target.value })}
            placeholder="Mohammad Hadi Muzammil"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Account / IBAN Number
          </label>
          <input
            type="text"
            value={payment.accountNumber}
            onChange={(e) => onChange({ accountNumber: e.target.value })}
            placeholder="•••••••• 8920"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Routing / IFSC / Sort Code
          </label>
          <input
            type="text"
            value={payment.routingOrIfsc}
            onChange={(e) => onChange({ routingOrIfsc: e.target.value })}
            placeholder="SVCB0009842 / 121000358"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            UPI ID / PayPal Email / Stripe Link
          </label>
          <input
            type="text"
            value={payment.upiOrPaypal || ''}
            onChange={(e) => onChange({ upiOrPaypal: e.target.value })}
            placeholder="hadidev@upi / paypal.me/hadidev"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Swift / BIC Code (for International)
          </label>
          <input
            type="text"
            value={payment.swiftBic || ''}
            onChange={(e) => onChange({ swiftBic: e.target.value })}
            placeholder="SVCBUS33XXX"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors font-mono"
          />
        </div>

      </div>

      <div>
        <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Payment Instructions &amp; Remittance Memo
        </label>
        <textarea
          rows={2}
          value={payment.paymentInstructions || ''}
          onChange={(e) => onChange({ paymentInstructions: e.target.value })}
          placeholder="e.g. Please include invoice number in wire memo."
          className="w-full px-3 py-1.5 text-xs font-medium bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
        />
      </div>

    </div>
  );
});

PaymentSection.displayName = 'PaymentSection';

