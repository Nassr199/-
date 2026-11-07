
import React, { useState, useEffect, useMemo } from 'react';
import { I18N, SERVICE_RATE, FIXED_FEE, VAT_RATE, SETTLEMENT_TABBY, SETTLEMENT_TAMARA, SETTLEMENT_THRESHOLD, TRANSFER_FEE_TOTAL } from './constants';
import { Provider, CalculationResult } from './types';
import { Sidebar } from './components/Sidebar';
import { Results } from './components/Results';

const App: React.FC = () => {
    // State
    const [price, setPrice] = useState<string>('');
    const [provider, setProvider] = useState<Provider>('tabby');
    const [includeSettlement, setIncludeSettlement] = useState<boolean>(false);
    
    // Theme & Language
    const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('calculatorThemeFluentV2') === 'dark');
    const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem('calculatorLangFluentV2') as 'ar' | 'en') || 'ar');

    // Effects
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('calculatorThemeFluentV2', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('calculatorThemeFluentV2', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('calculatorLangFluentV2', lang);
    }, [lang]);

    // Calculation Logic (Preserved)
    const calculations = useMemo<CalculationResult>(() => {
        const P_input = Math.max(0, Number(price) || 0);
        let X_calc = 0, baseFee_calc = 0, vat_calc = 0, totalServiceFee_calc = 0;
        let actualSettlementOrTransferFee = 0;
        let currentSettlementType: 'bank_transfer' | 'provider_settlement' | null = null;
        let providerName = null;
        let isSettlementFeeActive = false;

        const factorWithVat = 1 + VAT_RATE;
        const denominator = 1 - (SERVICE_RATE * factorWithVat);
        const fixedFeeComponent = FIXED_FEE * factorWithVat;

        let X_intermediate = 0;
        if (P_input > 0 && denominator > 0) {
            X_intermediate = (P_input + fixedFeeComponent) / denominator;
        } else {
            X_intermediate = P_input;
        }
        X_intermediate = Math.max(P_input, X_intermediate);

        if (X_intermediate >= SETTLEMENT_THRESHOLD) {
            actualSettlementOrTransferFee = TRANSFER_FEE_TOTAL;
            currentSettlementType = 'bank_transfer';
            providerName = lang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer';
            isSettlementFeeActive = true;
        } else if (X_intermediate > 0) {
            const rawName = provider === 'tabby' ? I18N[lang].providerTabbyLabel : I18N[lang].providerTamaraLabel;
            providerName = rawName.split('(')[0].trim();

            if (includeSettlement) {
                actualSettlementOrTransferFee = provider === 'tabby' ? SETTLEMENT_TABBY : SETTLEMENT_TAMARA;
                currentSettlementType = 'provider_settlement';
                isSettlementFeeActive = true;
            } else {
                actualSettlementOrTransferFee = 0;
                currentSettlementType = 'provider_settlement';
                isSettlementFeeActive = false;
            }
        }

        if (P_input > 0 && denominator > 0) {
            X_calc = (P_input + fixedFeeComponent + actualSettlementOrTransferFee) / denominator;
            X_calc = Math.max(P_input, X_calc);

            if (X_calc >= 0.01) {
                baseFee_calc = (X_calc * SERVICE_RATE) + FIXED_FEE;
                vat_calc = baseFee_calc * VAT_RATE;
                totalServiceFee_calc = baseFee_calc + vat_calc;
            } else {
                X_calc = P_input;
                if (P_input === 0) {
                     actualSettlementOrTransferFee = 0; isSettlementFeeActive = false; currentSettlementType = null;
                }
            }
        } else {
            X_calc = P_input;
        }

        return {
            P_input: P_input,
            X: Math.max(0, X_calc),
            baseFee: Math.max(0, baseFee_calc),
            vat: Math.max(0, vat_calc),
            totalServiceFee: Math.max(0, totalServiceFee_calc),
            S_final: Math.max(0, actualSettlementOrTransferFee),
            settlementType: currentSettlementType,
            providerForSettlement: providerName,
            settlementFeeActive: isSettlementFeeActive && actualSettlementOrTransferFee > 0
        };
    }, [price, provider, includeSettlement, lang]);

    // Handlers
    const handlePrint = () => window.print();
    const handleShare = () => {
        const data = I18N[lang];
        const cur = data.currencySuffix.trim();
        const msg = data.shareMessageTemplate
            .replace('{P}', `${calculations.P_input.toFixed(2)}`)
            .replace('{X}', `${calculations.X.toFixed(2)}`)
            .replace(/{C}/g, cur);
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen relative font-sans overflow-x-hidden flex flex-col">
            {/* Mesh Background */}
            <div className="aurora-bg"></div>

            <main className="flex-grow w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-8 z-10">
                {/* Left: Input Sidebar */}
                <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col">
                    <Sidebar 
                        langData={I18N[lang]}
                        price={price}
                        setPrice={setPrice}
                        provider={provider}
                        setProvider={setProvider}
                        includeSettlement={includeSettlement}
                        setIncludeSettlement={setIncludeSettlement}
                        isDark={isDark}
                        toggleTheme={() => setIsDark(!isDark)}
                        toggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                        handlePrint={handlePrint}
                        handleShare={handleShare}
                        currentLang={lang}
                    />
                </div>

                {/* Right: Results */}
                <div className="w-full lg:flex-1 flex flex-col justify-center">
                    <Results 
                        langData={I18N[lang]}
                        results={calculations}
                    />
                </div>
            </main>

            {/* Footer - Standard Relative Positioning */}
            <footer className="w-full text-center py-6 mt-auto text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 opacity-60 z-10" dir="ltr">
                {I18N[lang].footerText.replace('{YEAR}', new Date().getFullYear().toString())}
            </footer>
        </div>
    );
};

export default App;
