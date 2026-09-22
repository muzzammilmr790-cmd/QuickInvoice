export type TemplateTheme = 'modern' | 'minimal' | 'executive';

export type DiscountType = 'percentage' | 'fixed';
export type TaxMode = 'global' | 'per_item';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
  decimalPlaces: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number; // Used if taxMode is 'per_item'
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  country: string;
  taxIdLabel: string; // e.g. "GSTIN", "VAT ID", "EIN"
  taxIdValue: string;
  logoUrl?: string;
  website?: string;
}

export interface ClientInfo {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  country: string;
  taxIdLabel?: string;
  taxIdValue?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingOrIfsc: string;
  swiftBic?: string;
  upiOrPaypal?: string;
  paymentInstructions?: string;
}

export interface SignatureData {
  type: 'drawn' | 'typed' | 'image' | 'none';
  dataUrl?: string;
  signeeName?: string;
  title?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  
  currency: Currency;
  theme: TemplateTheme;
  
  business: BusinessInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  
  // Tax & Discount Settings
  taxMode: TaxMode;
  globalTaxRate: number; // e.g. 18 for 18%
  taxLabel: string; // e.g. "GST", "VAT", "Sales Tax"
  
  discountType: DiscountType;
  discountValue: number; // percentage (e.g. 10%) or fixed amount (e.g. 100)
  
  shippingFee: number;
  amountPaid: number;
  
  paymentDetails: PaymentDetails;
  notes: string;
  terms: string;
  
  signature: SignatureData;
}

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  itemTotals: Record<string, { lineTotal: number; itemTax: number }>;
}
