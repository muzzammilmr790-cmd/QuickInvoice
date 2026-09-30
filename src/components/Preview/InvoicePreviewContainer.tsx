import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useInvoiceContext } from '../../context/InvoiceContext';
import { ModernTemplate } from './templates/ModernTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ZoomIn, ZoomOut, Eye, Maximize2 } from 'lucide-react';

export const InvoicePreviewContainer = React.memo(
  forwardRef<HTMLDivElement>((_, ref) => {
    const { invoice, calculations } = useInvoiceContext();
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const updateWidth = () => {
        if (viewportRef.current) {
          setContainerWidth(viewportRef.current.clientWidth);
        }
      };

      updateWidth();
      window.addEventListener('resize', updateWidth);
      const observer = new ResizeObserver(updateWidth);
      if (viewportRef.current) observer.observe(viewportRef.current);

      return () => {
        window.removeEventListener('resize', updateWidth);
        observer.disconnect();
      };
    }, []);

    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 150));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 50));
    const handleResetZoom = () => setZoomLevel(100);

    // Standard A4 width at 96 DPI
    const TARGET_A4_WIDTH = 794;
    const paddingOffset = containerWidth < 640 ? 16 : 32;
    const availableWidth = containerWidth > 0 ? containerWidth - paddingOffset : 800;

    // Calculate responsive scale factor so A4 document auto-fits small viewports
    const autoScale = availableWidth < TARGET_A4_WIDTH ? Math.max(0.38, availableWidth / TARGET_A4_WIDTH) : 1;
    const finalScale = autoScale * (zoomLevel / 100);

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
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-neutral-200/80 shadow-card text-xs no-print flex-wrap gap-2">
          
          <div className="flex items-center gap-2 text-neutral-600 font-semibold">
            <Eye className="w-3.5 h-3.5 text-brand-600" />
            <span>Live A4 Preview</span>
            <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200/60 font-mono">
              {invoice.theme.toUpperCase()}
            </span>
          </div>

          {/* Zoom & Auto-Fit Controls */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
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
              title="Reset Zoom"
            >
              {Math.round(finalScale * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {zoomLevel !== 100 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 text-brand-600 hover:bg-white rounded transition-colors ml-0.5"
                title="Fit to Screen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Paper Container Viewport */}
        <div
          ref={viewportRef}
          className="paper-viewport w-full overflow-auto max-h-[calc(100vh-10rem)] min-h-[480px] lg:min-h-[650px] p-2 sm:p-4 bg-neutral-200/60 rounded-2xl border border-neutral-300/60 flex justify-center items-start"
        >
          
          <div
            style={{
              width: `${TARGET_A4_WIDTH}px`,
              transform: `scale(${finalScale})`,
              transformOrigin: 'top center',
              marginBottom: `${(finalScale - 1) * 1050}px`,
              transition: 'transform 0.15s ease-out',
            }}
            className="paper-card shrink-0 shadow-preview rounded-xl overflow-hidden bg-white border border-neutral-200 transition-all my-2"
          >
            {/* Target element captured for PDF generation and printed directly */}
            <div ref={ref} id="invoice-printable-target" className="w-[794px]">
              {renderTemplate()}
            </div>
          </div>

        </div>

      </div>
    );
  })
);

InvoicePreviewContainer.displayName = 'InvoicePreviewContainer';
