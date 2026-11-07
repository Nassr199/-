import { I18nData } from './types';

export const SERVICE_RATE = 0.0699;
export const FIXED_FEE = 1.5;
export const VAT_RATE = 0.15;
export const SETTLEMENT_TABBY = 28.75;
export const SETTLEMENT_TAMARA = 25.00;
export const TRANSFER_FEE_BASE = 6.00;
export const TRANSFER_FEE_TOTAL = parseFloat((TRANSFER_FEE_BASE * (1 + VAT_RATE)).toFixed(2));
export const SETTLEMENT_THRESHOLD = 2500;

const formatNumber = (n: number | string) => {
    const num = Number(n);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const I18N: Record<string, I18nData> = {
    ar: {
        pageTitle: "الشروق لمواد البناء - حاسبة رسوم المتجر",
        mainTitle: "آلة حاسبة لرسوم الدفع الآجل",
        inputLabel: "أدخل مبلغ الفاتورة المطلوب",
        pricePlaceholder: "0.00 ر.س",
        notesTitle: "ملاحظات هامة حول التسوية والرسوم:",
        noteItems: [
            {
                question: `رسوم التسوية (للمبالغ الأقل من ${SETTLEMENT_THRESHOLD} ريال)`,
                answer: `<ul>
                            <li>تابي: <strong>${SETTLEMENT_TABBY.toFixed(2)} ر.س</strong></li>
                            <li>تمارا: <strong>${SETTLEMENT_TAMARA.toFixed(2)} ر.س</strong></li>
                            <li>هذه الرسوم تُخصم <strong>مرة واحدة</strong> على إجمالي مبلغ التسوية لكل دورة. يمكنك تفعيل خيار "إضافة رسوم التسوية" إذا كانت هذه أول عملية في دورة التسوية الحالية، أو إذا كنت ترغب في تضمينها في حساب المبلغ المطلوب من العميل.</li>
                        </ul>`
            },
            {
                question: `رسوم التسوية (للمبالغ ${SETTLEMENT_THRESHOLD} ريال فأكثر)`,
                answer: `<ul>
                            <li>يتم تطبيق رسوم تحويل بنكي ثابتة قدرها <strong>${TRANSFER_FEE_BASE.toFixed(2)} ر.س</strong> بالإضافة إلى ضريبة القيمة المضافة (15%)، ليصبح الإجمالي <strong>${TRANSFER_FEE_TOTAL.toFixed(2)} ر.س</strong>. هذه الرسوم إلزامية لهذه الفئة من المبالغ.</li>
                        </ul>`
            },
            {
                question: "مواعيد معالجة التسويات الأسبوعية:",
                answer: `<ul>
                            <li><strong>تمارا:</strong> تتم معالجة التسويات الأسبوعية صباح كل يوم <strong>سبت</strong>.</li>
                            <li><strong>تابي:</strong> تتم معالجة التسويات الأسبوعية صباح كل يوم <strong>ثلاثاء</strong>.</li>
                        </ul>`
            }
        ],
        themeToggle: "تغيير السمة", langToggle: "تغيير اللغة",
        themeNight: "ليلي", themeDay: "نهاري",
        langSwitchTo: "English", langCurrentShort: "ع", otherLangShort: "EN", otherLangLong: "English",
        printButtonLabel: "طباعة", shareButtonLabel: "واتساب",
        shareMessageTemplate: `حاسبة الشروق:\n- صافي ربح المتجر: {P} {C}\n- المبلغ المطلوب من العميل (مع الرسوم): {X} {C}`,
        footerText: `© {YEAR} الشروق لمواد البناء. جميع الحقوق محفوظة.`,
        currencySuffix: " ر.س",
        combinedTitle: "تابي / تمارا",
        clearButtonLabel: "مسح", clearButtonTitle: "مسح للخلف / مسح كلي (ضغطة مطولة)",
        showDetailsText: "عرض التفاصيل", hideDetailsText: "إخفاء التفاصيل",
        providerChoiceLabel: `اختر مقدم الخدمة لرسوم التسوية (للمبالغ الأقل من ${SETTLEMENT_THRESHOLD} ريال):`,
        providerTabbyLabel: `تابي (${SETTLEMENT_TABBY.toFixed(2)} ر.س)`,
        providerTamaraLabel: `تمارا (${SETTLEMENT_TAMARA.toFixed(2)} ر.س)`,
        includeSettlementLabel: `إضافة رسوم التسوية (للمبالغ الأقل من ${SETTLEMENT_THRESHOLD} ريال):`,
        settlementFeeLabel_provider: "رسوم التسوية (اختياري)",
        settlementFeeLabel_transfer: `رسوم التحويل البنكي (${TRANSFER_FEE_TOTAL.toFixed(2)} ر.س)`,
        labels: [
            `رسوم الخدمة (${(SERVICE_RATE * 100).toFixed(2)}% + ${FIXED_FEE.toFixed(1)} ر.س)`,
            'ضريبة القيمة المضافة (15%)',
            'إجمالي رسوم الخدمة',
            'رسوم التسوية/التحويل',
            'المبلغ المطلوب من العميل',
            'صافي ربح المتجر'
        ],
        labelKeys: ['baseFeeLabel', 'vatLabel', 'totalServiceFeeLabel', 'settlementFeeLabel', 'totalAmountDueLabel', 'netProfitLabel'],
        calculationDetails: {
            baseFee: (x, fee, suffix) => `المعادلة: (المبلغ المطلوب <code>${x}</code> × ${(SERVICE_RATE * 100).toFixed(2)}%) + ${FIXED_FEE.toFixed(2)} = <code>${fee}</code> ${suffix}`,
            vat: (base, vatFee, suffix) => `المعادلة: (رسوم الخدمة <code>${base}</code> × 15%) = <code>${vatFee}</code> ${suffix}`,
            settlementFee: (type, providerName, fee, suffix, isActive, x_val) => {
                if (type === 'bank_transfer') {
                    return `رسوم تحويل بنكي (لأن المبلغ ${formatNumber(x_val)} ريال أو أكثر): <code>${fee}</code> ${suffix} (شاملة ضريبة القيمة المضافة).`;
                } else if (type === 'provider_settlement') {
                    return isActive ? `رسوم تسوية ${providerName} (لأن المبلغ أقل من ${SETTLEMENT_THRESHOLD} ريال): <code>${fee}</code> ${suffix}` : `رسوم تسوية ${providerName} غير مضافة (المبلغ أقل من ${SETTLEMENT_THRESHOLD} ريال).`;
                }
                return 'لا توجد رسوم تسوية/تحويل مطبقة.';
            },
            totalServiceFee: (base, vat, total, suffix) => `المجموع: رسوم الخدمة (<code>${base}</code>) + الضريبة (<code>${vat}</code>) = <code>${total}</code> ${suffix}`,
            netProfit: (p, suffix) => `يمثل صافي الربح المطلوب للمتجر: <code>${p}</code> ${suffix}`
        },
        vizLabel: "تفصيل المبلغ المطلوب من العميل", vizProfitTitle: "صافي الربح", vizFeeTitle: "إجمالي الرسوم"
    },
    en: {
        pageTitle: "Al-Shorouq Building Materials - Merchant Fee Calculator",
        mainTitle: "Deferred Payment Fee Calculator",
        inputLabel: "Enter Total Invoice Price",
        pricePlaceholder: "0.00 SAR",
        notesTitle: "Important Notes on Settlement & Fees:",
        noteItems: [
            {
                question: `Settlement Fees (for amounts less than ${SETTLEMENT_THRESHOLD} SAR)`,
                answer: `<ul>
                            <li>Tabby: <strong>${SETTLEMENT_TABBY.toFixed(2)} SAR</strong></li>
                            <li>Tamara: <strong>${SETTLEMENT_TAMARA.toFixed(2)} SAR</strong></li>
                            <li>These fees are charged <strong>once</strong> per total settlement amount for each cycle. You can enable the "Include Settlement Fee" option if this is the first transaction in the current settlement cycle, or if you wish to include it in the customer's payable amount.</li>
                        </ul>`
            },
            {
                question: `Settlement Fees (for amounts ${SETTLEMENT_THRESHOLD} SAR and above)`,
                answer: `<ul>
                            <li>A fixed bank transfer fee of <strong>${TRANSFER_FEE_BASE.toFixed(2)} SAR</strong> + VAT (15%) applies, totaling <strong>${TRANSFER_FEE_TOTAL.toFixed(2)} SAR</strong>. This fee is mandatory for this amount range.</li>
                        </ul>`
            },
            {
                question: "When are weekly settlements processed by providers?",
                answer: `<ul>
                            <li><strong>Tamara:</strong> Weekly settlements are processed every <strong>Saturday</strong>.</li>
                            <li><strong>Tabby:</strong> Weekly settlements are processed every <strong>Tuesday</strong>.</li>
                        </ul>`
            }
        ],
        themeToggle: "Change Theme", langToggle: "Change Language",
        themeNight: "Night", themeDay: "Day",
        langSwitchTo: "عربي", langCurrentShort: "EN", otherLangShort: "ع", otherLangLong: "عربي",
        printButtonLabel: "Print", shareButtonLabel: "WhatsApp",
        shareMessageTemplate: `Al-Shorouq Calculator:\n- Store Net Profit: {P} {C}\n- Customer Pays (w/ Fees): {X} {C}`,
        footerText: `© {YEAR} Al-Shorouq Building Materials. All rights reserved.`,
        currencySuffix: " SAR",
        combinedTitle: "Tabby / Tamara",
        clearButtonLabel: "Clear", clearButtonTitle: "Backspace / Clear All (Long Press)",
        showDetailsText: "Show Details", hideDetailsText: "Hide Details",
        providerChoiceLabel: `Choose provider for settlement fee (for amounts less than ${SETTLEMENT_THRESHOLD} SAR):`,
        providerTabbyLabel: `Tabby (${SETTLEMENT_TABBY.toFixed(2)} SAR)`,
        providerTamaraLabel: `Tamara (${SETTLEMENT_TAMARA.toFixed(2)} SAR)`,
        includeSettlementLabel: `Include settlement fee (for amounts less than ${SETTLEMENT_THRESHOLD} SAR):`,
        settlementFeeLabel_provider: "Settlement Fee (Optional)",
        settlementFeeLabel_transfer: `Bank Transfer Fee (${TRANSFER_FEE_TOTAL.toFixed(2)} SAR)`,
        labels: [
            `Service Fee (${(SERVICE_RATE * 100).toFixed(2)}% + ${FIXED_FEE.toFixed(1)} SAR)`,
            'VAT (15%)',
            'Total Service Fees',
            'Settlement/Transfer Fee',
            'Amount Customer Pays',
            'Net Merchant Profit'
        ],
        labelKeys: ['baseFeeLabel', 'vatLabel', 'totalServiceFeeLabel', 'settlementFeeLabel', 'totalAmountDueLabel', 'netProfitLabel'],
        calculationDetails: {
            baseFee: (x, fee, suffix) => `Formula: (Amount Due <code>${x}</code> × ${(SERVICE_RATE * 100).toFixed(2)}%) + ${FIXED_FEE.toFixed(2)} = <code>${fee}</code> ${suffix}`,
            vat: (base, vatFee, suffix) => `Formula: (Service Fee <code>${base}</code> × 15%) = <code>${vatFee}</code> ${suffix}`,
            settlementFee: (type, providerName, fee, suffix, isActive, x_val) => {
                if (type === 'bank_transfer') {
                    return `Bank transfer fee (because amount ${formatNumber(x_val)} SAR or more): <code>${fee}</code> ${suffix} (VAT inclusive).`;
                } else if (type === 'provider_settlement') {
                    return isActive ? `${providerName} settlement fee (because amount is less than ${SETTLEMENT_THRESHOLD} SAR): <code>${fee}</code> ${suffix}` : `${providerName} settlement fee not included (amount is less than ${SETTLEMENT_THRESHOLD} SAR).`;
                }
                return 'No settlement/transfer fee applied.';
            },
            totalServiceFee: (base, vat, total, suffix) => `Sum: Service Fee (<code>${base}</code>) + VAT (<code>${vat}</code>) = <code>${total}</code> ${suffix}`,
            netProfit: (p, suffix) => `Represents the desired net profit for the store: <code>${p}</code> ${suffix}`
        },
        vizLabel: "Customer Payment Breakdown", vizProfitTitle: "Net Profit", vizFeeTitle: "Total Fees"
    }
};
