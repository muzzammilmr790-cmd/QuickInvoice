import type { Currency } from '../types/invoice';

export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    position: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee (INR)',
    position: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    position: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    position: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar (CAD)',
    position: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar (AUD)',
    position: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham (AED)',
    position: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen (JPY)',
    position: 'prefix',
    decimalPlaces: 0,
  },
];

export const formatCurrency = (amount: number, currency: Currency): string => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  const formattedNumber = safeAmount.toLocaleString(undefined, {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  });

  if (currency.position === 'prefix') {
    return `${currency.symbol} ${formattedNumber}`;
  }
  return `${formattedNumber} ${currency.symbol}`;
};
