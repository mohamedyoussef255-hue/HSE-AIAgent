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
          withGlow ? 'filter drop-shadow-[0_0_12px_rgba(220,38,38,0.6)]' : ''
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle 3D gradient for realistic reflective metal street sign feel */}
          <linearGradient id="stopSignGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e51c24" />
            <stop offset="50%" stopColor="#cc1118" />
            <stop offset="100%" stopColor="#b30c12" />
          </linearGradient>
          <filter id="innerBorderShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Red Edge & Base Octagon */}
        <polygon
          points="58.6,4 141.4,4 196,58.6 196,141.4 141.4,196 58.6,196 4,141.4 4,58.6"
          fill="url(#stopSignGradient)"
          stroke="#b30c12"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Outer White Contour Stripe */}
        <polygon
          points="59.5,8 140.5,8 192,59.5 192,140.5 140.5,192 59.5,192 8,140.5 8,59.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Main Inner White Octagon Border Stripe */}
        <polygon
          points="62,14 138,14 186,62 186,138 138,186 62,186 14,138 14,62"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6.5"
          strokeLinejoin="round"
          filter="url(#innerBorderShadow)"
        />

        {/* Inner Red Fill Background */}
        <polygon
          points="64,18 136,18 182,64 182,136 136,182 64,182 18,136 18,64"
          fill="url(#stopSignGradient)"
        />

        {/* Official Bold White "STOP" Typography */}
        <text
          x="100"
          y="122"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="61"
          letterSpacing="2.5"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
        >
          STOP
        </text>
      </svg>
    </div>
  );
};
