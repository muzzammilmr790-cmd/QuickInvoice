import type { Invoice } from '../types/invoice';
import { CURRENCIES } from './currencies';

export const getEmptyInvoice = (): Invoice => {
  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    id: 'inv_' + Date.now(),
    invoiceNumber: 'INV-2026-001',
    poNumber: 'PO-9842',
    issueDate: today,
    dueDate: dueDate,
    status: 'pending',
    
    currency: CURRENCIES[0], // USD
    theme: 'modern',
    
    business: {
      name: 'Mohammad Hadi DevStudio',
      email: 'mohammadhadimuzammil@gmail.com',
      phone: '+91 86055 33408',
      address: '74 Innovation Boulevard, Suite 300',
      cityStateZip: 'Nanded, Maharashtra 431601',
      country: 'India',
      taxIdLabel: 'GSTIN / PAN',
      taxIdValue: '27AABCM8920C1Z5',
      website: 'github.com/muzzammilmr790-cmd',
      logoUrl: '',
    },
    
    client: {
      name: 'Nexus Cloud Technologies Inc.',
      companyName: 'Nexus Cloud Enterprise Solutions',
      email: 'billing@nexuscloud.io',
      phone: '+1 (555) 392-8819',
      address: '450 Mission Street, 14th Floor',
      cityStateZip: 'San Francisco, CA 94105',
      country: 'United States',
      taxIdLabel: 'EIN / Tax ID',
      taxIdValue: 'US-849204910',
    },
    
    items: [
      {
        id: 'item_1',
        description: 'Frontend Architecture & React 19 Migration',
        details: 'Upgraded client portal codebase to React 19, implemented SSR routing & performance tuning.',
        quantity: 40,
        unitPrice: 65,
        taxRate: 18,
      },
      {
        id: 'item_2',
        description: 'Supabase Database Optimization & RLS Security',
        details: 'Designed Row-Level Security policies, indexing strategies, and automated backup routines.',
        quantity: 15,
        unitPrice: 80,
        taxRate: 18,
      },
      {
        id: 'item_3',
        description: 'Responsive Dashboard UI & Dark Mode System',
        details: 'Crafted high-density analytics views with Tailwind CSS and responsive data grids.',
        quantity: 1,
        unitPrice: 850,
        taxRate: 18,
      },
    ],
    
    taxMode: 'global',
    globalTaxRate: 10,
    taxLabel: 'Standard Tax (VAT/GST)',
    
    discountType: 'percentage',
    discountValue: 5,
    
    shippingFee: 0,
    amountPaid: 1000,
    
    paymentDetails: {
      bankName: 'Silicon Valley Commercial Bank',
      accountName: 'Mohammad Hadi Muzammil',
      accountNumber: '•••••••• 8920',
      routingOrIfsc: 'SVCB0009842',
      swiftBic: 'SVCBUS33XXX',
      upiOrPaypal: 'hadidev@upi / paypal.me/hadidev',
      paymentInstructions: 'Please include the invoice number (INV-2026-001) in your wire transfer payment reference.',
    },
    
    notes: 'Thank you for your business! We look forward to collaborating with Nexus Cloud on future milestones.',
    terms: 'Payment is due within 14 calendar days of issue. Wire transfer fees are the responsibility of the remitter.',
    
    signature: {
      type: 'typed',
      signeeName: 'Mohammad Hadi Muzammil',
      title: 'Principal Full-Stack Engineer',
    },
  };
};

export const SAMPLE_INVOICE: Invoice = getEmptyInvoice();
