import React from 'react';
import type { Invoice, InvoiceCalculations } from '../../../types/invoice';
import { formatCurrency } from '../../../utils/currencies';

interface TemplateProps {
  invoice: Invoice;
  calculations: InvoiceCalculations;
}

export const ModernTemplate: React.FC<TemplateProps> = ({
  invoice,
  calculations,
}) => {
  const { business, client, currency, items, paymentDetails, signature } = invoice;

  return (
    <div className="relative bg-white text-neutral-800 p-8 sm:p-10 font-sans text-[12px] leading-relaxed min-h-[1050px] flex flex-col justify-between select-text">

      {/* Paid Watermark Stamp if status is paid */}
      {invoice.status === 'paid' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-600/30 text-emerald-600/30 font-display font-extrabold text-7xl uppercase px-12 py-3 rounded-2xl pointer-events-none tracking-widest z-0 select-none">
          PAID
        </div>
      )}

      {/* Top Main Section */}
      <div className="space-y-6 relative z-10">

        {/* Header: Logo / Company on Left, Invoice Title & Meta on Right */}
        <div className="flex justify-between items-start border-b-2 border-emerald-600/20 pb-6 gap-6">

          {/* Business Info */}
          <div className="space-y-2 max-w-[55%]">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="max-h-14 max-w-[180px] object-contain mb-2 rounded"
              />
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm font-display">
                  {business.name.charAt(0) || 'Q'}
                </div>
                <h1 className="font-display font-extrabold text-xl text-neutral-900 tracking-tight leading-tight">
                  {business.name || 'Your Business Name'}
                </h1>
              </div>
            )}

            <div className="text-[11px] text-neutral-500 space-y-0.5">
              {business.address && <p>{business.address}</p>}
              {business.cityStateZip && <p>{business.cityStateZip}, {business.country}</p>}
              <p>
                {business.email && <span>{business.email}</span>}
                {business.phone && <span> &bull; {business.phone}</span>}
              </p>
              {business.taxIdValue && (
                <p className="font-mono text-[10.5px] text-neutral-600 pt-0.5">
                  <span className="font-semibold">{business.taxIdLabel || 'Tax ID'}:</span> {business.taxIdValue}
                </p>
              )}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="text-right space-y-1.5">
            <div className="inline-flex items-center gap-2">
              <span className="font-display font-extrabold text-2xl text-emerald-700 tracking-tight uppercase">
                INVOICE
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <p className="font-mono font-bold text-sm text-neutral-900">
                #{invoice.invoiceNumber || 'INV-001'}
              </p>
              {invoice.poNumber && (
                <p className="text-neutral-500">
                  <span className="font-medium text-neutral-600">P.O. #:</span> {invoice.poNumber}
                </p>
              )}
              <p className="text-neutral-500">
                <span className="font-medium text-neutral-600">Issue Date:</span> {invoice.issueDate || '-'}
              </p>
              <p className="text-neutral-500">
                <span className="font-medium text-neutral-600">Due Date:</span> {invoice.dueDate || '-'}
              </p>

              {/* Status Badge */}
              <div className="pt-1 flex justify-end">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${invoice.status === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : invoice.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : invoice.status === 'overdue'
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                  }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {invoice.status}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Billed To / Client Section */}
        <div className="grid grid-cols-2 gap-6 bg-neutral-50/80 rounded-xl p-4 border border-neutral-200/70">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-display">
              Billed To:
            </p>
            <p className="font-display font-bold text-sm text-neutral-900">
              {client.name || 'Client Name / Contact'}
            </p>
            {client.companyName && (
              <p className="font-medium text-neutral-700 text-[11.5px]">{client.companyName}</p>
            )}
            <div className="text-[11px] text-neutral-500 space-y-0.5 pt-0.5">
              {client.address && <p>{client.address}</p>}
              {client.cityStateZip && <p>{client.cityStateZip}</p>}
              <p>
                {client.email && <span>{client.email}</span>}
                {client.phone && <span> &bull; {client.phone}</span>}
              </p>
            </div>
          </div>

          <div className="space-y-1 text-right flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-display">
                Total Balance Due:
              </p>
              <p className="font-display font-extrabold text-2xl text-emerald-700 font-mono tracking-tight">
                {formatCurrency(calculations.balanceDue, currency)}
              </p>
            </div>
            <p className="text-[10.5px] text-neutral-400">
              Due on: <span className="font-semibold text-neutral-700">{invoice.dueDate || 'Upon Receipt'}</span>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="rounded-xl overflow-hidden border border-neutral-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-700 text-white text-[11px] font-display font-bold uppercase tracking-wider">
                <th className="py-2.5 px-4 w-10 text-center">#</th>
                <th className="py-2.5 px-4">Item &amp; Description</th>
                <th className="py-2.5 px-4 text-center w-16">Qty</th>
                <th className="py-2.5 px-4 text-right w-24">Rate</th>
                {invoice.taxMode === 'per_item' && (
                  <th className="py-2.5 px-4 text-center w-16">Tax %</th>
                )}
                <th className="py-2.5 px-4 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[11.5px]">
              {items.map((item, idx) => {
                const qty = Number(item.quantity) || 0;
                const rate = Number(item.unitPrice) || 0;
                const rowTotal = qty * rate;

                return (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                    <td className="py-3 px-4 text-center text-neutral-400 font-mono text-[10.5px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-900 leading-snug">
                        {item.description || 'Untitled Service / Item'}
                      </p>
                      {item.details && (
                        <p className="text-[10.5px] text-neutral-500 mt-0.5 leading-snug">
                          {item.details}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-neutral-700">
                      {qty}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neutral-700">
                      {formatCurrency(rate, currency)}
                    </td>
                    {invoice.taxMode === 'per_item' && (
                      <td className="py-3 px-4 text-center font-mono text-neutral-500 text-[10.5px]">
                        {item.taxRate || 0}%
                      </td>
                    )}
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900">
                      {formatCurrency(rowTotal, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financials & Calculation Breakdown */}
        <div className="flex justify-end pt-1">
          <div className="w-64 space-y-1.5 text-[11px]">

            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-neutral-900">
                {formatCurrency(calculations.subtotal, currency)}
              </span>
            </div>

            {calculations.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>
                  Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                </span>
                <span className="font-mono font-semibold">
                  -{formatCurrency(calculations.discountAmount, currency)}
                </span>
              </div>
            )}

            {calculations.taxAmount > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>
                  {invoice.taxLabel || 'Tax'}{' '}
                  {invoice.taxMode === 'global' ? `(${invoice.globalTaxRate}%)` : ''}:
                </span>
                <span className="font-mono font-semibold text-neutral-900">
                  +{formatCurrency(calculations.taxAmount, currency)}
                </span>
              </div>
            )}

            {calculations.shippingFee > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Shipping / Misc:</span>
                <span className="font-mono font-semibold text-neutral-900">
                  +{formatCurrency(calculations.shippingFee, currency)}
                </span>
              </div>
            )}

            <div className="border-t-2 border-neutral-200 pt-2 flex justify-between items-center text-[12.5px] font-bold text-neutral-900">
              <span>Total Amount:</span>
              <span className="font-mono font-extrabold text-sm text-neutral-900">
                {formatCurrency(calculations.grandTotal, currency)}
              </span>
            </div>

            {calculations.amountPaid > 0 && (
              <div className="flex justify-between text-emerald-700 text-[11px] font-medium">
                <span>Amount Paid:</span>
                <span className="font-mono font-semibold">
                  -{formatCurrency(calculations.amountPaid, currency)}
                </span>
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 flex justify-between items-center mt-2">
              <span className="font-display font-bold text-emerald-900 text-xs uppercase tracking-wide">
                Balance Due:
              </span>
              <span className="font-display font-extrabold text-sm text-emerald-700 font-mono">
                {formatCurrency(calculations.balanceDue, currency)}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Footer: Payment Details & Signature */}
      <div className="mt-8 pt-6 border-t-2 border-neutral-200/80 space-y-4 relative z-10">

        <div className="grid grid-cols-12 gap-6 items-start">

          {/* Payment & Banking Info (8 cols) */}
          <div className="col-span-8 space-y-1.5 text-[10.5px]">
            <p className="font-display font-bold text-[11px] text-neutral-900 uppercase tracking-wider text-emerald-800">
              Payment &amp; Remittance Details
            </p>
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 space-y-1">
              {paymentDetails.bankName && (
                <p><span className="font-semibold text-neutral-700">Bank:</span> {paymentDetails.bankName}</p>
              )}
              {paymentDetails.accountName && (
                <p><span className="font-semibold text-neutral-700">Account Name:</span> {paymentDetails.accountName}</p>
              )}
              {paymentDetails.accountNumber && (
                <p className="font-mono"><span className="font-semibold text-neutral-700 font-sans">Account No:</span> {paymentDetails.accountNumber}</p>
              )}
              {paymentDetails.routingOrIfsc && (
                <p className="font-mono"><span className="font-semibold text-neutral-700 font-sans">IFSC / Routing:</span> {paymentDetails.routingOrIfsc}</p>
              )}
              {paymentDetails.upiOrPaypal && (
                <p><span className="font-semibold text-neutral-700">UPI / PayPal:</span> {paymentDetails.upiOrPaypal}</p>
              )}
              {paymentDetails.paymentInstructions && (
                <p className="text-neutral-500 italic pt-1 border-t border-neutral-200/60 mt-1">
                  {paymentDetails.paymentInstructions}
                </p>
              )}
            </div>
          </div>

          {/* Signature Block (4 cols) */}
          <div className="col-span-4 text-right flex flex-col justify-end items-end space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Authorized Signature
            </p>

            {signature.type === 'drawn' && signature.dataUrl ? (
              <img
                src={signature.dataUrl}
                alt="Signature"
                className="max-h-12 max-w-[130px] object-contain border-b border-neutral-300 pb-1"
              />
            ) : (
              <div className="border-b border-neutral-300 pb-1 min-w-[120px] text-center">
                <span className="font-['Playfair_Display'] italic text-lg text-emerald-900 font-semibold">
                  {signature.signeeName || business.name || 'Mohammad Hadi'}
                </span>
              </div>
            )}

            <p className="font-bold text-[11px] text-neutral-900 pt-0.5">
              {signature.signeeName || business.name}
            </p>
            {signature.title && (
              <p className="text-[10px] text-neutral-500">{signature.title}</p>
            )}
          </div>

        </div>

        {/* Notes & Terms Footnote */}
        {(invoice.notes || invoice.terms) && (
          <div className="pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 space-y-0.5">
            {invoice.notes && <p><span className="font-semibold text-neutral-600">Note:</span> {invoice.notes}</p>}
            {invoice.terms && <p><span className="font-semibold text-neutral-600">Terms:</span> {invoice.terms}</p>}
          </div>
        )}

      </div>

    </div>
  );
};
