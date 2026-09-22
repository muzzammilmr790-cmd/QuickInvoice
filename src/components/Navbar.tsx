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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-subtle no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-emerald-glow">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg text-neutral-900 tracking-tight leading-none">
                Quick<span className="text-brand-600">Invoice</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
                100% Client-Side
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">
              Instant PDF &amp; Receipt Builder
            </p>
          </div>
        </div>

        {/* Action Controls & Selectors */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">

          {/* Template Selector */}
          <div className="relative flex items-center">
            <Palette className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={invoice.theme}
              onChange={(e) => changeTheme(e.target.value as TemplateTheme)}
              className="pl-8 pr-7 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors cursor-pointer appearance-none"
              title="Change invoice design theme"
            >
              <option value="modern">Modern Emerald</option>
              <option value="executive">Executive Slate</option>
              <option value="minimal">Minimal Clean</option>
            </select>
          </div>

          {/* Currency Selector */}
          <div className="relative flex items-center">
            <Coins className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={invoice.currency.code}
              onChange={(e) => {
                const found = CURRENCIES.find((c) => c.code === e.target.value);
                if (found) changeCurrency(found);
              }}
              className="pl-8 pr-7 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors cursor-pointer appearance-none"
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

          {/* Invoice History Dashboard Button */}
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-lg shadow-xs transition-all active:scale-95 relative"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg shadow-sm transition-all active:scale-95"
            title="Open print preview"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-lg shadow-sm hover:shadow-emerald-glow transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
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
    </header>
  );
});

Navbar.displayName = 'Navbar';
