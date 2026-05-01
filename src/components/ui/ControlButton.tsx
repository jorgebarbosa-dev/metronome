import React from 'react';

export type ControlButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ControlButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ControlButtonVariant;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}

export function ControlButton({
  children,
  onClick,
  variant = 'secondary',
  ariaLabel,
  disabled = false,
  className = '',
}: ControlButtonProps) {
  const baseStyles = `
    h-14 min-w-[56px] px-4 rounded-2xl
    flex items-center justify-center gap-2
    text-sm font-semibold
    transition-all duration-150
    active:scale-[0.92]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
    disabled:opacity-40 disabled:active:scale-100
    [@media(hover:hover)]:hover:brightness-110
  `;

  const variantStyles = {
    primary: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    secondary: 'bg-white/[0.06] text-white/70 border border-white/[0.08]',
    ghost: 'bg-transparent text-white/50 border border-transparent',
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
