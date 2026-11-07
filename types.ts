export interface CalculationResult {
  P_input: number;
  X: number;
  baseFee: number;
  vat: number;
  totalServiceFee: number;
  S_final: number;
  settlementType: 'bank_transfer' | 'provider_settlement' | null;
  providerForSettlement: string | null;
  settlementFeeActive: boolean;
}

export type Provider = 'tabby' | 'tamara';

export type Language = 'ar' | 'en';

export type Theme = 'light' | 'dark';

export interface NoteItem {
  question: string;
  answer: string;
}

export interface I18nData {
  pageTitle: string;
  mainTitle: string;
  inputLabel: string;
  pricePlaceholder: string;
  notesTitle: string;
  noteItems: NoteItem[];
  themeToggle: string;
  langToggle: string;
  themeNight: string;
  themeDay: string;
  langSwitchTo: string;
  langCurrentShort: string;
  otherLangShort: string;
  otherLangLong: string;
  printButtonLabel: string;
  shareButtonLabel: string;
  shareMessageTemplate: string;
  footerText: string;
  currencySuffix: string;
  combinedTitle: string;
  clearButtonLabel: string;
  clearButtonTitle: string;
  showDetailsText: string;
  hideDetailsText: string;
  providerChoiceLabel: string;
  providerTabbyLabel: string;
  providerTamaraLabel: string;
  includeSettlementLabel: string;
  settlementFeeLabel_provider: string;
  settlementFeeLabel_transfer: string;
  labels: string[];
  labelKeys: string[];
  calculationDetails: {
    baseFee: (x: string, fee: string, suffix: string) => string;
    vat: (base: string, vatFee: string, suffix: string) => string;
    settlementFee: (type: string | null, providerName: string | null, fee: string, suffix: string, isActive: boolean, x_val: number) => string;
    totalServiceFee: (base: string, vat: string, total: string, suffix: string) => string;
    netProfit: (p: string, suffix: string) => string;
  };
  vizLabel: string;
  vizProfitTitle: string;
  vizFeeTitle: string;
}
