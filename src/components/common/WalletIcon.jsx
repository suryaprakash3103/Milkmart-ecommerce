import React from 'react';

/**
 * WalletIcon - Unique & Professional Vector Wallet Symbol
 * Handcrafted with a metallic gold currency coin peeking from the top fold,
 * rich leather body, saddle-stitch detailing, and a golden snap-rivet closure clasp.
 */
export const WalletIcon = ({ size = 22, style = {} }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-label="MilkMart Credits Wallet"
    >
      <defs>
        {/* Deep luxury pasture leather gradient */}
        <linearGradient id="wBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E4430" />
          <stop offset="50%" stopColor="#153624" />
          <stop offset="100%" stopColor="#0B1F14" />
        </linearGradient>

        {/* Polished metallic gold gradient */}
        <linearGradient id="wGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF0D5" />
          <stop offset="45%" stopColor="#E8C582" />
          <stop offset="100%" stopColor="#B38234" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="wShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#06120B" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Gold Rupee Coin emerging from card slot */}
      <g transform="translate(15.2, 7.8)">
        <circle cx="0" cy="0" r="4.2" fill="url(#wGoldGrad)" stroke="#7D5116" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="3.2" fill="none" stroke="#FAF7F2" strokeWidth="0.35" strokeOpacity="0.65" />
        {/* Rupee Glyph */}
        <path
          d="M -1.5 -1.5 L 1.5 -1.5 M -1.5 -0.3 L 1.5 -0.3 M -1.5 -1.5 L -1.5 0.5 C -0.5 0.5 1.3 0.5 1.3 -0.4 C 1.3 -1.4 0.2 -1.5 -0.4 -1.5 M -0.7 0.5 L 1.5 1.9"
          stroke="#5C3B0E"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Back fold */}
      <path
        d="M 4 8 C 4 6.5 5.2 5.5 6.6 5.5 L 21.4 5.5 C 22.8 5.5 24 6.5 24 8 L 24 9.5 L 4 9.5 Z"
        fill="#0E2318"
      />

      {/* Main Front Wallet Body */}
      <rect
        x="3"
        y="8.5"
        width="22"
        height="14.5"
        rx="3.5"
        fill="url(#wBodyGrad)"
        stroke="url(#wGoldGrad)"
        strokeWidth="0.95"
        filter="url(#wShadow)"
      />

      {/* Saddle stitching along bottom seam */}
      <path
        d="M 5.5 21 L 22.5 21"
        stroke="#E8C582"
        strokeWidth="0.6"
        strokeDasharray="1.2 1.2"
        strokeOpacity="0.65"
      />

      {/* Closure Clasp Strap */}
      <path
        d="M 16 13.2 L 23.5 13.2 C 24.8 13.2 25.8 14.2 25.8 15.5 C 25.8 16.8 24.8 17.8 23.5 17.8 L 16 17.8 Z"
        fill="#0E2318"
        stroke="url(#wGoldGrad)"
        strokeWidth="0.8"
      />

      {/* Golden Snap Button / Rivet */}
      <circle
        cx="22.8"
        cy="15.5"
        r="1.45"
        fill="url(#wGoldGrad)"
        stroke="#684210"
        strokeWidth="0.4"
      />
      <circle
        cx="22.5"
        cy="15.2"
        r="0.45"
        fill="#FFFFFF"
        opacity="0.85"
      />
    </svg>
  );
};
