import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
    children, 
    className = '', 
    noPadding = false,
    interactive = false
}) => {
    return (
        <div className={`
            glass-panel
            rounded-[32px] 
            relative 
            overflow-hidden 
            transition-all 
            duration-700
            bg-clip-padding
            ${interactive ? 'hover:scale-[1.005] hover:shadow-2xl cursor-pointer active:scale-[0.995]' : ''}
            ${noPadding ? 'p-0' : 'p-6 md:p-8'} 
            ${className}
        `}>
            {/* Subtle Noise Texture - Reduced Opacity for Clean Look */}
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none mix-blend-overlay"></div>

            {/* Content Layer */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};