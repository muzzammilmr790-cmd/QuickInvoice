import React, { useRef, useState, useEffect } from 'react';
import { 
  FileCheck, 
  PenTool, 
  Type, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import type { Invoice, SignatureData } from '../../types/invoice';

interface NotesAndSignatureSectionProps {
  invoice: Invoice;
  onChange: (updated: Partial<Invoice>) => void;
  onSignatureChange: (signature: SignatureData) => void;
}

export const NotesAndSignatureSection: React.FC<NotesAndSignatureSectionProps> = React.memo(({
  invoice,
  onChange,
  onSignatureChange,
}) => {
  const [signatureMode, setSignatureMode] = useState<'drawn' | 'typed'>(
    invoice.signature.type === 'drawn' ? 'drawn' : 'typed'
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (signatureMode === 'drawn' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (invoice.signature.dataUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = invoice.signature.dataUrl;
        }
      }
    }
  }, [signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSignatureChange({
        ...invoice.signature,
        type: 'drawn',
        dataUrl,
      });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange({
      ...invoice.signature,
      dataUrl: undefined,
    });
  };

  const handlePresetNote = (presetText: string) => {
    onChange({ notes: presetText });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-card space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <FileCheck className="w-4 h-4" />
        </div>
        <h2 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
          6. Notes, Terms &amp; Digital Signature
        </h2>
      </div>

      {/* Notes & Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Notes to Client */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              Notes to Client
            </label>
            <div className="flex gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => handlePresetNote('Thank you for your business! We look forward to working with you again.')}
                className="text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-0.5"
              >
                <Sparkles className="w-2.5 h-2.5" /> Preset 1
              </button>
            </div>
          </div>
          <textarea
            rows={3}
            value={invoice.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Add a thank you note, delivery notice, or feedback link..."
            className="w-full px-3 py-1.5 text-xs font-medium bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
            Terms &amp; Conditions
          </label>
          <textarea
            rows={3}
            value={invoice.terms}
            onChange={(e) => onChange({ terms: e.target.value })}
            placeholder="Payment due in 14 days. Late fees may apply..."
            className="w-full px-3 py-1.5 text-xs font-medium bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

      </div>

      {/* Signature Pad Section */}
      <div className="pt-3 border-t border-neutral-100 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-brand-600" />
            <span>Digital Signature / Authorized Signee</span>
          </label>

          {/* Mode Switcher: Draw vs Type */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => {
                setSignatureMode('typed');
                onSignatureChange({ ...invoice.signature, type: 'typed' });
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                signatureMode === 'typed'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Type className="w-3 h-3" />
              <span>Typed Signature</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSignatureMode('drawn');
                onSignatureChange({ ...invoice.signature, type: 'drawn' });
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                signatureMode === 'drawn'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>Draw Signature</span>
            </button>
          </div>
        </div>

        {/* Draw on Canvas Mode */}
        {signatureMode === 'drawn' ? (
          <div className="space-y-2">
            <div className="relative border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 p-2 flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={100}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="bg-white rounded-lg shadow-xs cursor-crosshair touch-none border border-neutral-200"
              />
              <button
                type="button"
                onClick={clearCanvas}
                className="absolute top-3 right-3 p-1.5 bg-white hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200 rounded-md shadow-xs transition-colors"
                title="Clear Signature Canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] text-neutral-400 mt-1">
                Draw your signature in the box using your mouse or finger
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="h-14 bg-white rounded-lg border border-neutral-200 px-4 flex items-center justify-center">
              <span className="font-['Playfair_Display'] italic text-2xl text-brand-800 font-semibold tracking-wide">
                {invoice.signature.signeeName || invoice.business.name || 'Signee Name'}
              </span>
            </div>
          </div>
        )}

        {/* Signee Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Signee Full Name
            </label>
            <input
              type="text"
              value={invoice.signature.signeeName || ''}
              onChange={(e) => onSignatureChange({ ...invoice.signature, signeeName: e.target.value })}
              placeholder="e.g. Mohammad Hadi Muzammil"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
              Signee Designation / Title
            </label>
            <input
              type="text"
              value={invoice.signature.title || ''}
              onChange={(e) => onSignatureChange({ ...invoice.signature, title: e.target.value })}
              placeholder="e.g. Principal Full-Stack Engineer"
              className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

      </div>

    </div>
  );
});

NotesAndSignatureSection.displayName = 'NotesAndSignatureSection';

