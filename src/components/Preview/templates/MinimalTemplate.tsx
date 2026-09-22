import React from 'react';
import type { Invoice, InvoiceCalculations } from '../../../types/invoice';
import { formatCurrency } from '../../../utils/currencies';

interface TemplateProps {
  invoice: Invoice;
  calculations: InvoiceCalculations;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({
  invoice,
  calculations,
}) => {
  const { business, client, currency, items, paymentDetails, signature } = invoice;

  return (
    <div className="relative bg-white text-neutral-800 p-8 sm:p-10 font-sans text-[12px] leading-relaxed min-h-[1050px] flex flex-col justify-between select-text">
      
      {/* Paid Watermark Stamp */}
      {invoice.status === 'paid' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-2 border-emerald-500/20 text-emerald-600/20 font-display font-bold text-7xl uppercase px-12 py-3 rounded-3xl pointer-events-none tracking-widest z-0 select-none">
          PAID
        </div>
      )}

      {/* Top Main Section */}
      <div className="space-y-8 relative z-10">
        
        {/* Header: Minimal Spacing */}
        <div className="flex justify-between items-start">
          
          <div className="space-y-1">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="max-h-12 max-w-[160px] object-contain mb-2 rounded"
              />
            ) : (
              <h1 className="font-display font-extrabold text-xl text-neutral-900 tracking-tight">
                {business.name || 'Your Business Name'}
              </h1>
            )}
            
            <div className="text-[11px] text-neutral-400 space-y-0.5">
              {business.address && <p>{business.address}</p>}
              {business.cityStateZip && <p>{business.cityStateZip}, {business.country}</p>}
              <p>{business.email}</p>
              {business.taxIdValue && (
                <p className="font-mono text-[10px] text-neutral-500">
                  {business.taxIdLabel || 'Tax ID'}: {business.taxIdValue}
                </p>
              )}
            </div>
          </div>

          <div className="text-right space-y-1">
            <h2 className="font-display font-bold text-xl text-neutral-900 tracking-tight">
              Invoice
            </h2>
            <div className="text-[11px] text-neutral-400 space-y-0.5">
              <p className="font-mono text-neutral-800 font-semibold">
                #{invoice.invoiceNumber || 'INV-001'}
              </p>
              <p>Issued: <span className="text-neutral-700">{invoice.issueDate || '-'}</span></p>
              <p>Due: <span className="text-neutral-700">{invoice.dueDate || '-'}</span></p>
            </div>
          </div>

        </div>

        {/* Minimal Client Info */}
        <div className="grid grid-cols-2 gap-8 border-t border-b border-neutral-100 py-4">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Billed To
            </p>
            <p className="font-bold text-neutral-900 text-xs">{client.name}</p>
            {client.companyName && <p className="text-neutral-600 text-[11px]">{client.companyName}</p>}
            <p className="text-[11px] text-neutral-400">{client.address}</p>
            <p className="text-[11px] text-neutral-400">{client.email}</p>
          </div>

          <div className="text-right flex flex-col justify-end">
            <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Amount Due
            </p>
            <p className="font-display font-extrabold text-2xl text-neutral-900 font-mono">
              {formatCurrency(calculations.balanceDue, currency)}
            </p>
          </div>
        </div>

        {/* Minimal Items Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 text-[10.5px] font-bold uppercase tracking-wider text-neutral-400">
              <th className="py-2 px-1">Description</th>
              <th className="py-2 px-1 text-center w-16">Qty</th>
              <th className="py-2 px-1 text-right w-24">Price</th>
              {invoice.taxMode === 'per_item' && (
                <th className="py-2 px-1 text-center w-16">Tax</th>
              )}
              <th className="py-2 px-1 text-right w-24">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-[11.5px]">
            {items.map((item) => {
              const qty = Number(item.quantity) || 0;
              const rate = Number(item.unitPrice) || 0;
              const rowTotal = qty * rate;

              return (
                <tr key={item.id}>
                  <td className="py-3 px-1">
                    <p className="font-semibold text-neutral-900">{item.description}</p>
                    {item.details && (
                      <p className="text-[10px] text-neutral-400 mt-0.5">{item.details}</p>
                    )}
                  </td>
                  <td className="py-3 px-1 text-center font-mono text-neutral-600">{qty}</td>
                  <td className="py-3 px-1 text-right font-mono text-neutral-600">
                    {formatCurrency(rate, currency)}
                  </td>
                  {invoice.taxMode === 'per_item' && (
                    <td className="py-3 px-1 text-center font-mono text-neutral-400 text-[10.5px]">
                      {item.taxRate || 0}%
                    </td>
                  )}
                  <td className="py-3 px-1 text-right font-mono font-semibold text-neutral-900">
                    {formatCurrency(rowTotal, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Minimal Totals */}
        <div className="flex justify-end pt-1">
          <div className="w-60 space-y-1.5 text-[11px] border-t border-neutral-200 pt-3">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal:</span>
              <span className="font-mono text-neutral-800">
                {formatCurrency(calculations.subtotal, currency)}
              </span>
            </div>

            {calculations.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-mono">
                  -{formatCurrency(calculations.discountAmount, currency)}
                </span>
              </div>
            )}

            {calculations.taxAmount > 0 && (
              <div className="flex justify-between text-neutral-500">
                <span>{invoice.taxLabel || 'Tax'}:</span>
                <span className="font-mono text-neutral-800">
                  +{formatCurrency(calculations.taxAmount, currency)}
                </span>
              </div>
            )}

            {calculations.shippingFee > 0 && (
              <div className="flex justify-between text-neutral-500">
                <span>Shipping:</span>
                <span className="font-mono text-neutral-800">
                  +{formatCurrency(calculations.shippingFee, currency)}
                </span>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-2 flex justify-between items-center text-xs font-bold text-neutral-900">
              <span>Total:</span>
              <span className="font-mono text-sm">
                {formatCurrency(calculations.grandTotal, currency)}
              </span>
            </div>

            {calculations.amountPaid > 0 && (
              <div className="flex justify-between text-neutral-500 text-[10.5px]">
                <span>Paid:</span>
                <span className="font-mono">
                  -{formatCurrency(calculations.amountPaid, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center font-bold text-xs text-neutral-900 pt-1">
              <span>Balance Due:</span>
              <span className="font-mono font-extrabold text-brand-700">
                {formatCurrency(calculations.balanceDue, currency)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Minimal Footer */}
      <div className="mt-8 pt-6 border-t border-neutral-100 space-y-3 relative z-10">
        
        <div className="grid grid-cols-12 gap-4 items-start text-[10.5px]">
          
          <div className="col-span-8 space-y-0.5 text-neutral-500">
            <p className="font-semibold text-neutral-800 uppercase text-[9.5px] tracking-wider">
              Payment Instructions
            </p>
            {paymentDetails.bankName && <p>{paymentDetails.bankName} &bull; Acc: {paymentDetails.accountNumber}</p>}
            {paymentDetails.routingOrIfsc && <p>Routing/IFSC: {paymentDetails.routingOrIfsc}</p>}
            {paymentDetails.upiOrPaypal && <p>UPI/PayPal: {paymentDetails.upiOrPaypal}</p>}
          </div>

          <div className="col-span-4 text-right flex flex-col items-end">
            <p className="text-[9.5px] uppercase font-semibold text-neutral-400 tracking-wider mb-1">
              Signee
            </p>
            {signature.type === 'drawn' && signature.dataUrl ? (
              <img
                src={signature.dataUrl}
                alt="Signature"
                className="max-h-10 max-w-[120px] object-contain border-b border-neutral-200 pb-0.5"
              />
            ) : (
              <div className="border-b border-neutral-200 pb-0.5 min-w-[100px] text-center">
                <span className="font-['Playfair_Display'] italic text-base text-neutral-800">
                  {signature.signeeName || business.name || 'Mohammad Hadi'}
                </span>
              </div>
            )}
            <p className="font-bold text-[10px] text-neutral-800 pt-0.5">
              {signature.signeeName || business.name}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
