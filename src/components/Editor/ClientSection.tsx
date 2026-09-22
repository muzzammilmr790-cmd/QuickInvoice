import React from 'react';
import { UserCheck } from 'lucide-react';
import type { Invoice } from '../../types/invoice';

interface ClientSectionProps {
  client: Invoice['client'];
  onChange: (updated: Partial<Invoice['client']>) => void;
}

export const ClientSection: React.FC<ClientSectionProps> = React.memo(({
  client,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-card space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <UserCheck className="w-4 h-4" />
        </div>
        <h2 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
          2. Client / Billed To
        </h2>
      </div>

      {/* Client Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Client Contact Name <span className="text-brand-600">*</span>
          </label>
          <input
            type="text"
            value={client.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. John Doe / Procurement Dept"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Client Company Name
          </label>
          <input
            type="text"
            value={client.companyName || ''}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Nexus Cloud Technologies Inc."
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Client Email <span className="text-brand-600">*</span>
          </label>
          <input
            type="email"
            value={client.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="billing@clientcompany.com"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Client Phone
          </label>
          <input
            type="text"
            value={client.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 (555) 392-8819"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Billing Address
          </label>
          <input
            type="text"
            value={client.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="450 Mission Street, 14th Floor"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            City, State, Zip, Country
          </label>
          <input
            type="text"
            value={client.cityStateZip}
            onChange={(e) => onChange({ cityStateZip: e.target.value })}
            placeholder="San Francisco, CA 94105, USA"
            className="w-full px-3 py-1.5 text-xs font-semibold bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

    </div>
  );
});

ClientSection.displayName = 'ClientSection';

