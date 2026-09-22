import React from 'react';
import type { Invoice, InvoiceCalculations } from '../../../types/invoice';
import { formatCurrency } from '../../../utils/currencies';

interface TemplateProps {
  invoice: Invoice;
  calculations: InvoiceCalculations;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({
  invoice,
  calculations,
}) => {
  const { business, client, currency, items, paymentDetails, signature } = invoice;

  return (
    <div className="relative bg-white text-neutral-900 p-8 sm:p-10 font-sans text-[12px] leading-relaxed min-h-[1050px] flex flex-col justify-between select-text border-t-[8px] border-slate-900">

      {/* Paid Watermark Stamp */}
      {invoice.status === 'paid' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-slate-900/25 text-slate-900/25 font-display font-extrabold text-7xl uppercase px-12 py-3 rounded-xl pointer-events-none tracking-widest z-0 select-none">
          PAID
        </div>
      )}

      {/* Top Main Section */}
      <div className="space-y-6 relative z-10">

        {/* Header: Executive Bold */}
        <div className="flex justify-between items-start border-b border-neutral-300 pb-6 gap-6">

          <div className="space-y-2 max-w-[55%]">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="max-h-14 max-w-[180px] object-contain mb-2"
              />
            ) : (
              <h1 className="font-['Playfair_Display'] font-bold text-2xl text-slate-950 tracking-tight">
                {business.name || 'Your Business Name'}
              </h1>
            )}

            <div className="text-[11px] text-neutral-600 space-y-0.5">
              {business.address && <p>{business.address}</p>}
              {business.cityStateZip && <p>{business.cityStateZip}, {business.country}</p>}
              <p>
                {business.email && <span>{business.email}</span>}
                {business.phone && <span> &bull; {business.phone}</span>}
              </p>
              {business.taxIdValue && (
                <p className="font-mono text-[10.5px] text-neutral-700 pt-0.5">
                  <span className="font-semibold">{business.taxIdLabel || 'Tax ID'}:</span> {business.taxIdValue}
                </p>
              )}
            </div>
          </div>

          <div className="text-right space-y-1.5">
            <h2 className="font-['Playfair_Display'] font-bold text-3xl text-slate-900 tracking-wider">
              INVOICE
            </h2>
            <div className="space-y-0.5 text-[11px] text-neutral-600">
              <p className="font-mono font-bold text-sm text-slate-950">
                #{invoice.invoiceNumber || 'INV-001'}
              </p>
              <p>Date: <span className="font-semibold text-neutral-900">{invoice.issueDate || '-'}</span></p>
              <p>Due Date: <span className="font-semibold text-neutral-900">{invoice.dueDate || '-'}</span></p>
              {invoice.poNumber && <p>PO #: <span className="font-semibold">{invoice.poNumber}</span></p>}

              <div className="pt-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-900 bg-slate-900 text-white">
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Client & Billed To Card */}
        <div className="grid grid-cols-2 gap-6 py-2 border-b border-neutral-200">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              BILLED TO:
            </p>
            <p className="font-bold text-sm text-slate-950">
              {client.name || 'Client Name'}
            </p>
            {client.companyName && (
              <p className="font-semibold text-neutral-700 text-[11px]">{client.companyName}</p>
            )}
            <div className="text-[11px] text-neutral-600 space-y-0.5">
              {client.address && <p>{client.address}</p>}
              {client.cityStateZip && <p>{client.cityStateZip}</p>}
              {client.email && <p>{client.email}</p>}
            </div>
          </div>

          <div className="text-right flex flex-col justify-end space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              BALANCE DUE:
            </p>
            <p className="font-['Playfair_Display'] font-bold text-3xl text-slate-950">
              {formatCurrency(calculations.balanceDue, currency)}
            </p>
          </div>
        </div>

        {/* Executive Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-[11px] font-bold uppercase tracking-wider text-slate-900">
              <th className="py-2.5 px-2 w-10 text-center">#</th>
              <th className="py-2.5 px-2">Description</th>
              <th className="py-2.5 px-2 text-center w-16">Qty</th>
              <th className="py-2.5 px-2 text-right w-24">Price</th>
              {invoice.taxMode === 'per_item' && (
                <th className="py-2.5 px-2 text-center w-16">Tax %</th>
              )}
              <th className="py-2.5 px-2 text-right w-28">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-[11.5px]">
            {items.map((item, idx) => {
              const qty = Number(item.quantity) || 0;
              const rate = Number(item.unitPrice) || 0;
              const rowTotal = qty * rate;

              return (
                <tr key={item.id}>
                  <td className="py-3 px-2 text-center text-neutral-400 font-mono text-[10.5px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-slate-950 leading-snug">
                      {item.description || 'Service Description'}
                    </p>
                    {item.details && (
                      <p className="text-[10.5px] text-neutral-500 mt-0.5 leading-snug">
                        {item.details}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-neutral-800">
                    {qty}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-neutral-800">
                    {formatCurrency(rate, currency)}
                  </td>
                  {invoice.taxMode === 'per_item' && (
                    <td className="py-3 px-2 text-center font-mono text-neutral-600 text-[10.5px]">
                      {item.taxRate || 0}%
                    </td>
                  )}
                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-950">
                    {formatCurrency(rowTotal, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Calculation Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-1.5 text-[11px] border-t border-neutral-200 pt-2">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-neutral-900">
                {formatCurrency(calculations.subtotal, currency)}
              </span>
            </div>

            {calculations.discountAmount > 0 && (
              <div className="flex justify-between text-neutral-800 font-medium">
                <span>Discount:</span>
                <span className="font-mono font-semibold">
                  -{formatCurrency(calculations.discountAmount, currency)}
                </span>
              </div>
            )}

            {calculations.taxAmount > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>{invoice.taxLabel || 'Tax'}:</span>
                <span className="font-mono font-semibold text-neutral-900">
                  +{formatCurrency(calculations.taxAmount, currency)}
                </span>
              </div>
            )}

            {calculations.shippingFee > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Shipping:</span>
                <span className="font-mono font-semibold text-neutral-900">
                  +{formatCurrency(calculations.shippingFee, currency)}
                </span>
              </div>
            )}

            <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center text-[13px] font-bold text-slate-950">
              <span>Total:</span>
              <span className="font-mono font-bold text-base">
                {formatCurrency(calculations.grandTotal, currency)}
              </span>
            </div>

            {calculations.amountPaid > 0 && (
              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>Amount Paid:</span>
                <span className="font-mono font-semibold">
                  -{formatCurrency(calculations.amountPaid, currency)}
                </span>
              </div>
            )}

            <div className="border-t border-dashed border-neutral-300 pt-1.5 flex justify-between items-center font-bold text-[12px] text-slate-950">
              <span>Balance Due:</span>
              <span className="font-mono font-extrabold text-sm">
                {formatCurrency(calculations.balanceDue, currency)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-neutral-300 space-y-4 relative z-10">

        <div className="grid grid-cols-12 gap-6 items-start">

          <div className="col-span-8 space-y-1 text-[10.5px]">
            <p className="font-bold uppercase tracking-wider text-slate-900">
              Banking &amp; Remittance Information
            </p>
            <div className="text-neutral-600 space-y-0.5 font-mono text-[10.5px]">
              {paymentDetails.bankName && <p><span className="font-sans font-semibold">Bank:</span> {paymentDetails.bankName}</p>}
              {paymentDetails.accountName && <p><span className="font-sans font-semibold">Account:</span> {paymentDetails.accountName}</p>}
              {paymentDetails.accountNumber && <p><span className="font-sans font-semibold">Number:</span> {paymentDetails.accountNumber}</p>}
              {paymentDetails.routingOrIfsc && <p><span className="font-sans font-semibold">Routing/IFSC:</span> {paymentDetails.routingOrIfsc}</p>}
              {paymentDetails.upiOrPaypal && <p><span className="font-sans font-semibold">UPI/PayPal:</span> {paymentDetails.upiOrPaypal}</p>}
            </div>
          </div>

          <div className="col-span-4 text-right flex flex-col justify-end items-end">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
              AUTHORIZED BY
            </p>
            {signature.type === 'drawn' && signature.dataUrl ? (
              <img
                src={signature.dataUrl}
                alt="Signature"
                className="max-h-12 max-w-[130px] object-contain border-b border-slate-900 pb-1"
              />
            ) : (
              <div className="border-b border-slate-900 pb-1 min-w-[120px] text-center">
                <span className="font-['Playfair_Display'] italic text-lg text-slate-950 font-bold">
                  {signature.signeeName || business.name || 'Mohammad Hadi'}
                </span>
              </div>
            )}
            <p className="font-bold text-[11px] text-slate-950 pt-0.5">
              {signature.signeeName || business.name}
            </p>
            {signature.title && (
              <p className="text-[10px] text-neutral-500">{signature.title}</p>
            )}
          </div>

        </div>

        {(invoice.notes || invoice.terms) && (
          <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 space-y-0.5">
            {invoice.notes && <p><span className="font-semibold text-neutral-700">Note:</span> {invoice.notes}</p>}
            {invoice.terms && <p><span className="font-semibold text-neutral-700">Terms:</span> {invoice.terms}</p>}
          </div>
        )}

      </div>

    </div>
  );
};
