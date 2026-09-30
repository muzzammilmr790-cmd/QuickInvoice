import { useRef } from 'react';
import { InvoiceProvider, useInvoiceContext } from './context/InvoiceContext';
import { Navbar } from './components/Navbar';
import { InvoiceEditor } from './components/Editor/InvoiceEditor';
import { InvoicePreviewContainer } from './components/Preview/InvoicePreviewContainer';
import { InvoiceHistoryModal } from './components/Dashboard/InvoiceHistoryModal';
import { Edit3, Eye, CheckCircle2 } from 'lucide-react';

function MainAppContent() {
  const {
    activeMobileTab,
    setActiveMobileTab,
    toastMessage,
  } = useInvoiceContext();

  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-neutral-900">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Container (Sticky) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-subtle no-print">
        <Navbar />

        {/* Mobile Tab Switcher (Visible on mobile/tablet < lg) */}
        <div className="lg:hidden border-t border-neutral-100 px-3 py-2 flex gap-2 bg-neutral-50/70">
          <button
            type="button"
            onClick={() => setActiveMobileTab('edit')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMobileTab === 'edit'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>1. Edit Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMobileTab === 'preview'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Live Preview</span>
          </button>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Panel: Form Editor */}
          <div
            className={`lg:col-span-6 xl:col-span-5 no-print ${
              activeMobileTab === 'edit' ? 'block' : 'hidden lg:block'
            }`}
          >
            <InvoiceEditor />
          </div>

          {/* Right Panel: Live Document Preview */}
          <div
            className={`lg:col-span-6 xl:col-span-7 lg:sticky lg:top-20 preview-panel-wrapper ${
              activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <InvoicePreviewContainer ref={previewRef} />
          </div>

        </div>
      </main>

      {/* Multi-Invoice History Dashboard Modal */}
      <InvoiceHistoryModal />

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-4 text-center text-xs text-neutral-400 no-print">
        <p>QuickInvoice • 100% Client-Side Privacy Invoice Builder</p>
      </footer>

    </div>
  );
}

export function App() {
  return (
    <InvoiceProvider>
      <MainAppContent />
    </InvoiceProvider>
  );
}

export default App;
