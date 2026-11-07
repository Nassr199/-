
import React, { useState } from 'react';
import { I18nData, CalculationResult } from '../types';
import { GlassCard } from './GlassCard';
import { IconCalc, IconPlus, IconMinus } from './Icons';

interface ResultsProps {
    langData: I18nData;
    results: CalculationResult;
}

export const Results: React.FC<ResultsProps> = ({ langData, results }) => {
    const [mainExpanded, setMainExpanded] = useState(false);
    const suffix = langData.currencySuffix;

    const format = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    const totalFees = results.totalServiceFee + results.S_final;
    const profitPercent = results.X > 0 ? (results.P_input / results.X) * 100 : (results.P_input > 0 ? 100 : 0);
    const feesPercent = results.X > 0 ? (totalFees / results.X) * 100 : 0;

    return (
        <div className="flex flex-col h-full gap-5 perspective-1000 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            
            {/* 1. Main Card */}
            <div 
                className="group relative cursor-pointer"
                onClick={() => setMainExpanded(!mainExpanded)}
            >
                {/* Subtle Back Glow */}
                <div className="absolute inset-8 bg-gray-400/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {/* Card Container */}
                <div className="relative glass-panel rounded-[32px] overflow-hidden p-8 border-t border-white/60 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.005]">
                    
                    {/* Interior Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between min-h-[160px]">
                        {/* Top Row */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">{langData.labels[4]}</h2>
                                <p className="text-[9px] font-medium text-gray-400">{langData.combinedTitle}</p>
                            </div>
                            <div className="flex -space-x-1.5 rtl:space-x-reverse opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500">
                                <LogoBadge src="https://cdn.tamara.co/assets/png/tamara-logo-badge-en.png" />
                                <LogoBadge src="https://cdn.salla.sa/BmwbV/Ea1Kx4SfpK2Vy3Lx3aVPvZKBMkSM5dio2eKveTwm.png" />
                            </div>
                        </div>

                        {/* Middle (Amount) */}
                        <div className="flex items-baseline gap-2 mt-4 mb-2">
                            <span className="text-7xl font-light tracking-tighter text-gray-900 dark:text-white drop-shadow-sm">
                                {format(results.X)}
                            </span>
                            <span className="text-xl font-light text-gray-400">{suffix.trim()}</span>
                        </div>

                        {/* Bottom (Action Text Button) */}
                        <div className="flex justify-start mt-6">
                            <button className={`
                                px-5 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-500 flex items-center gap-2
                                ${mainExpanded 
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg' 
                                    : 'bg-white/50 text-gray-600 dark:bg-white/10 dark:text-gray-300 hover:bg-white hover:shadow-md'
                                }
                            `}>
                                <span>{mainExpanded ? langData.hideDetailsText : langData.showDetailsText}</span>
                                <span className={`transform transition-transform duration-500 ${mainExpanded ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Floating Details Stack */}
            <div className={`
                flex flex-col gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${mainExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none hidden'}
            `}>
                
                <DetailRow 
                    label={langData.labels[0]} 
                    value={format(results.baseFee)} suffix={suffix} index={0} 
                    details={langData.calculationDetails.baseFee(format(results.X), format(results.baseFee), suffix)}
                />
                
                <DetailRow 
                    label={langData.labels[1]} 
                    value={format(results.vat)} suffix={suffix} index={1} 
                    details={langData.calculationDetails.vat(format(results.baseFee), format(results.vat), suffix)}
                />

                <DetailRow 
                    label={langData.labels[2]} 
                    value={format(results.totalServiceFee)} suffix={suffix} index={2} highlight="orange"
                    details={langData.calculationDetails.totalServiceFee(format(results.baseFee), format(results.vat), format(results.totalServiceFee), suffix)}
                />

                <DetailRow 
                    label={results.settlementType === 'bank_transfer' ? langData.settlementFeeLabel_transfer : langData.settlementFeeLabel_provider} 
                    value={format(results.S_final)} suffix={suffix} index={3} highlight={results.S_final > 0 ? "red" : undefined}
                    details={langData.calculationDetails.settlementFee(results.settlementType, results.providerForSettlement, format(results.S_final), suffix, results.settlementFeeActive, results.X)}
                />

                <DetailRow 
                    label={langData.labels[5]} 
                    value={format(results.P_input)} suffix={suffix} index={4} highlight="green" isLarge
                    details={langData.calculationDetails.netProfit(format(results.P_input), suffix)}
                />

                {/* Visualization Bar */}
                <GlassCard noPadding className="mt-2 p-5 bg-white/40 dark:bg-white/5">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        <span>{langData.vizProfitTitle}</span>
                        <span>{langData.vizFeeTitle}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden flex">
                        <div 
                            className="h-full bg-gray-800 dark:bg-white transition-all duration-1000" 
                            style={{ width: `${Math.min(100, Math.max(0, profitPercent))}%` }}
                        />
                         <div 
                            className="h-full bg-gray-400 dark:bg-gray-600 transition-all duration-1000" 
                            style={{ width: `${Math.min(100, Math.max(0, feesPercent))}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-mono opacity-50">
                        <span>{profitPercent.toFixed(1)}%</span>
                        <span>{feesPercent.toFixed(1)}%</span>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

// Sub-components
const LogoBadge = ({ src }: { src: string }) => (
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm p-1.5 border border-white/20">
        <img src={src} className="w-full h-full object-contain" alt="Provider" />
    </div>
);

interface DetailRowProps {
    label: string;
    value: string;
    suffix: string;
    index: number;
    details: string;
    highlight?: 'green' | 'red' | 'orange';
    isLarge?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, suffix, index, details, highlight, isLarge }) => {
    const [open, setOpen] = useState(false);
    
    const dotColor = highlight === 'green' ? 'bg-green-500' : highlight === 'red' ? 'bg-red-500' : highlight === 'orange' ? 'bg-orange-500' : 'bg-gray-300';
    const textColor = 'text-gray-900 dark:text-white';

    return (
        <div 
            className="animate-slide-up" 
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setOpen(!open)}
        >
            <div className={`
                glass-panel rounded-[20px] overflow-hidden transition-all duration-300 cursor-pointer border border-white/40 dark:border-white/5
                ${open ? 'bg-white/80 dark:bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/60 dark:hover:bg-white/5'}
            `}>
                <div className="px-5 py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {highlight && <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>}
                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{label}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className={`flex items-baseline gap-1 ${textColor}`}>
                            <span className={`${isLarge ? 'text-lg font-bold' : 'text-sm font-semibold'}`}>{value}</span>
                            <span className="text-[9px] opacity-60 font-medium">{suffix.trim()}</span>
                        </div>
                        {/* Plus/Minus Icon Indicator */}
                        <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300
                            ${open ? 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white' : 'bg-transparent text-gray-400'}
                        `}>
                            {open ? <IconMinus size={12} strokeWidth={3} /> : <IconPlus size={12} strokeWidth={3} />}
                        </div>
                    </div>
                </div>
                
                {/* Fixed Closing Animation using Grid Trick */}
                <div className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="px-5 pb-3.5 pt-0">
                            <div className="p-3 bg-gray-50 dark:bg-black/30 rounded-lg text-[10px] font-mono text-gray-500 dark:text-gray-400 flex gap-2">
                                <IconCalc size={12} className="shrink-0 mt-0.5" />
                                <div dangerouslySetInnerHTML={{ __html: details }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
