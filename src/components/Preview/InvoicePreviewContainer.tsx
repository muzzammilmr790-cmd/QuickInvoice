import React, { useState, forwardRef } from 'react';
import { useInvoiceContext } from '../../context/InvoiceContext';
import { ModernTemplate } from './templates/ModernTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ZoomIn, ZoomOut, Eye } from 'lucide-react';

export const InvoicePreviewContainer = React.memo(
  forwardRef<HTMLDivElement>((_, ref) => {
    const { invoice, calculations } = useInvoiceContext();
    const [zoomLevel, setZoomLevel] = useState<number>(100);

    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 130));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
    const handleResetZoom = () => setZoomLevel(100);

    const renderTemplate = () => {
      switch (invoice.theme) {
        case 'executive':
          return <ExecutiveTemplate invoice={invoice} calculations={calculations} />;
        case 'minimal':
          return <MinimalTemplate invoice={invoice} calculations={calculations} />;
        case 'modern':
        default:
          return <ModernTemplate invoice={invoice} calculations={calculations} />;
      }
    };

    return (
      <div className="space-y-4">
        
        {/* Floating Preview Controls Bar */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-neutral-200/80 shadow-card text-xs no-print">
          
          <div className="flex items-center gap-2 text-neutral-600 font-semibold">
            <Eye className="w-3.5 h-3.5 text-brand-600" />
            <span>Live A4 Preview</span>
            <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200/60 font-mono">
              {invoice.theme.toUpperCase()}
            </span>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-0.5 text-[11px] font-mono font-bold text-neutral-700 hover:bg-white rounded transition-colors"
              title="Reset Zoom to 100%"
            >
              {zoomLevel}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Paper Container Viewport */}
        <div className="paper-viewport w-full overflow-auto max-h-[calc(100vh-9.5rem)] min-h-[500px] lg:min-h-[650px] p-2 sm:p-4 bg-neutral-200/50 rounded-2xl border border-neutral-300/60 flex justify-center items-start">
          
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="paper-card w-full max-w-[800px] shadow-preview rounded-xl overflow-hidden bg-white border border-neutral-200 transition-all my-2"
          >
            {/* Target element captured for PDF generation and printed directly */}
            <div ref={ref} id="invoice-printable-target" className="w-full">
              {renderTemplate()}
            </div>
          </div>

        </div>

      </div>
    );
  })
);

InvoicePreviewContainer.displayName = 'InvoicePreviewContainer';
