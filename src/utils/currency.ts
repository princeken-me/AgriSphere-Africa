import { CurrencyCode } from '../types';

export const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: '$', name: 'US Dollar' },
  KES: { rate: 129, symbol: 'KSh ', name: 'Kenyan Shilling' },
  NGN: { rate: 1520, symbol: '₦', name: 'Nigerian Naira' },
  GHS: { rate: 15.5, symbol: 'GH₵ ', name: 'Ghanaian Cedi' },
  ETB: { rate: 120, symbol: 'Br ', name: 'Ethiopian Birr' },
  ZAR: { rate: 18.2, symbol: 'R ', name: 'South African Rand' }
};

export function formatPrice(amountInUSD: number, targetCurrency: CurrencyCode = 'USD'): string {
  const currencyInfo = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.USD;
  const converted = amountInUSD * currencyInfo.rate;
  
  if (targetCurrency === 'USD') {
    return `${currencyInfo.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `${currencyInfo.symbol}${Math.round(converted).toLocaleString()}`;
  }
}
