import React from 'react';
import {
  FileText,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  Palette,
  Coins,
  FolderKanban
} from 'lucide-react';
import type { TemplateTheme } from '../types/invoice';
import { CURRENCIES } from '../utils/currencies';
import { useInvoiceContext } from '../context/InvoiceContext';
import confetti from 'canvas-confetti';

export const Navbar: React.FC = React.memo(() => {
  const {
    invoice,
    savedInvoices,
    changeCurrency,
    changeTheme,
    loadSampleInvoice,
    resetInvoiceDraft,
    printInvoice,
    downloadPDF,
    isDownloading,
    setIsHistoryOpen,
  } = useInvoiceContext();

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#10b981', '#059669', '#34d399', '#3b82f6'],
    });
  };

  const handleDownloadClick = () => {
    triggerConfetti();
    downloadPDF();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-0 min-h-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">

      {/* Row 1 / Left: Brand & Mobile Primary Actions */}
      <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-emerald-glow flex-shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-display font-bold text-base sm:text-lg text-neutral-900 tracking-tight leading-none">
                Quick<span className="text-brand-600">Invoice</span>
              </h1>
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
                100% Client-Side
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">
              Instant PDF &amp; Receipt Builder
            </p>
          </div>
        </div>

        {/* Mobile Primary Actions (Visible only on < sm screens) */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* History Button */}
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg active:scale-95 transition-all relative"
            title="Open saved invoice history"
          >
            <FolderKanban className="w-3.5 h-3.5 text-brand-600" />
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-brand-600 text-white">
              {savedInvoices.length}
            </span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-lg shadow-xs active:scale-95 transition-all disabled:opacity-60"
          >
            {isDownloading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Row 2 on Mobile / Right side on Desktop: Selectors & Desktop Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-end w-full sm:w-auto pt-1.5 sm:pt-0 border-t sm:border-t-0 border-neutral-100">

        {/* Template Selector */}
        <div className="relative flex-1 sm:flex-initial flex items-center min-w-0">
          <Palette className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none z-10" />
          <select
            value={invoice.theme}
            onChange={(e) => changeTheme(e.target.value as TemplateTheme)}
            className="w-full pl-8 pr-6 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors cursor-pointer appearance-none truncate"
            title="Change invoice design theme"
          >
            <option value="modern">Modern Emerald</option>
            <option value="executive">Executive Slate</option>
            <option value="minimal">Minimal Clean</option>
          </select>
        </div>

        {/* Currency Selector */}
        <div className="relative flex-1 sm:flex-initial flex items-center min-w-0">
          <Coins className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none z-10" />
          <select
            value={invoice.currency.code}
            onChange={(e) => {
              const found = CURRENCIES.find((c) => c.code === e.target.value);
              if (found) changeCurrency(found);
            }}
            className="w-full pl-8 pr-6 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors cursor-pointer appearance-none truncate"
            title="Change currency"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.symbol} {curr.code}
              </option>
            ))}
          </select>
        </div>

        <div className="h-5 w-[1px] bg-neutral-200 hidden md:block" />

        {/* Sample Data Button */}
        <button
          type="button"
          onClick={loadSampleInvoice}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/80 rounded-lg transition-all active:scale-95"
          title="Populate form with sample developer invoice"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Sample Data</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={resetInvoiceDraft}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-all active:scale-95"
          title="Clear all fields"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
          <span>Reset</span>
        </button>

        {/* Desktop History Dashboard Button */}
        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg shadow-xs transition-all active:scale-95 relative"
          title="Open saved invoice history dashboard"
        >
          <FolderKanban className="w-3.5 h-3.5 text-brand-600" />
          <span>History</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-brand-600 text-white shadow-xs">
            {savedInvoices.length}
          </span>
        </button>

        {/* Direct Print Button */}
        <button
          type="button"
          onClick={printInvoice}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg shadow-xs transition-all active:scale-95"
          title="Open print preview"
        >
          <Printer className="w-3.5 h-3.5 text-neutral-600" />
          <span>Print</span>
        </button>

        {/* Desktop Download PDF Button */}
        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-lg shadow-sm hover:shadow-emerald-glow transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download PDF</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
});

Navbar.displayName = 'Navbar';
