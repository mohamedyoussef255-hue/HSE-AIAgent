import React from 'react';

interface StopSignLogoProps {
  className?: string;
  size?: number | string;
  withGlow?: boolean;
}

export const StopSignLogo: React.FC<StopSignLogoProps> = ({
  className = 'w-10 h-10',
  size,
  withGlow = false,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={`w-full h-full drop-shadow-md transition-transform duration-200 ${
          withGlow ? 'filter drop-shadow-[0_0_14px_rgba(238,29,35,0.65)]' : ''
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Red Base Disk */}
        <circle cx="100" cy="100" r="96" fill="#EE1D23" />

        {/* Concentric Inner White Border Ring */}
        <circle
          cx="100"
          cy="100"
          r="83"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="6"
        />

        {/* Official Bold White "STOP" Typography matching user uploaded traffic sign */}
        <text
          x="100"
          y="102"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', Impact, sans-serif"
          fontWeight="900"
          fontSize="50"
          letterSpacing="0.8"
        >
          STOP
        </text>
      </svg>
    </div>
  );
};
