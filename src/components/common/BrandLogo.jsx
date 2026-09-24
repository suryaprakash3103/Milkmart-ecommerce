import React from 'react';

/**
 * BrandLogo - Modern livestock & dairy emblem modeled after the MilkSmart aesthetic.
 * Features a Mother Cow & Calf silhouette with a radial halftone green aura,
 * paired with a clean typographic mark: "Milk" (slate) + "MART" (vibrant green).
 * Key points / extra badges have been removed for a clean, professional finish.
 */
export const BrandLogo = ({
  variant = 'full', // 'full' | 'compact' | 'mark-only'
  theme = 'dark',   // 'dark' (for light backgrounds like Navbar) | 'light' (for dark backgrounds like Footer/Admin)
  size = 'md',      // 'sm' | 'md' | 'lg'
  style = {}
}) => {
  const isLight = theme === 'light';

  // Sizing maps
  const markSize = {
    sm: 40,
    md: 50,
    lg: 62
  }[size] || 50;

  const fontSizes = {
    sm: { milk: '1.4rem', mart: '1.45rem' },
    md: { milk: '1.75rem', mart: '1.8rem' },
    lg: { milk: '2.1rem', mart: '2.15rem' }
  }[size] || { milk: '1.75rem', mart: '1.8rem' };

  // Colors
  const animalColor = isLight ? '#FAF7F2' : '#475569';
  const dotColor = isLight ? '#A3E635' : '#8CB811';
  const milkTextColor = isLight ? '#FAF7F2' : '#475569';
  const martTextColor = isLight ? '#A3E635' : '#84B026';

  // 5 concentric rings of radial halftone dots
  const rings = [
    { r: 15, count: 12, dotR: 1.4, opacity: 0.95 },
    { r: 21, count: 18, dotR: 1.25, opacity: 0.85 },
    { r: 27, count: 24, dotR: 1.05, opacity: 0.70 },
    { r: 33, count: 30, dotR: 0.85, opacity: 0.50 },
    { r: 39, count: 36, dotR: 0.65, opacity: 0.35 }
  ];

  const cx = 40;
  const cy = 42;

  const iconSvg = (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 82 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="MilkMart Cow and Calf Emblem"
    >
      {/* Halftone Radial Sunburst Aura */}
      <g>
        {rings.map((ring, ringIdx) =>
          Array.from({ length: ring.count }).map((_, i) => {
            const angle = (i / ring.count) * Math.PI * 2;
            const x = (cx + ring.r * Math.cos(angle)).toFixed(2);
            const y = (cy + ring.r * Math.sin(angle)).toFixed(2);
            return (
              <circle
                key={`${ringIdx}-${i}`}
                cx={x}
                cy={y}
                r={ring.dotR}
                fill={dotColor}
                opacity={ring.opacity}
              />
            );
          })
        )}
      </g>

      {/* Cow & Calf Silhouettes */}
      <g fill={animalColor}>
        {/* Mother Cow */}
        <path
          d="
            M 18,34
            C 18,31 20,29 23,29
            C 26,29 32,31 38,31
            C 43,31 46,29 49,25
            C 50.5,23 52,22 53.5,23
            C 54.5,23.5 54,22.5 55,23.5
            C 55.5,24 55,25 54,25.8
            C 56.5,26.5 59.5,28 60,29.5
            C 60.5,31 58.5,32.5 56,33
            C 53,33.5 50.5,36 49.5,40
            L 50.5,41.5 L 50.5,58 L 48,58 L 48,44
            L 45.5,44 L 45.5,58 L 43.5,58 L 43.5,43
            C 40,44.8 36,45.2 32,44.8
            C 30.8,46.5 29,47.5 27,47.5
            C 25.5,47.5 25,46 25,44
            L 25,58 L 22.5,58 L 22.5,46.5
            L 21,58 L 18.5,58 L 18.5,43
            C 17.8,39.5 17.5,37 18,34 Z
            M 18.2,34
            C 17.2,38 17,45 16.5,51
            C 16.2,54 15.8,55 15.5,55
            C 16.5,55 17.5,53.5 18,50
            C 18.5,45 18.8,38 18.5,34 Z
          "
        />

        {/* Baby Calf standing forward */}
        <path
          d="
            M 43,44
            C 42.5,42.5 43.5,41 45.5,41
            C 47.8,41 50.5,42.2 53.2,42.2
            C 55.8,42.2 57.5,41 59.5,38.5
            C 60.8,36.8 61.8,36.2 63,36.8
            C 63.8,37.2 64.2,36.8 64.8,37.2
            C 65.2,37.6 64.8,38.2 64.2,38.8
            C 65.8,39.2 67.5,40.2 68,41.2
            C 68.5,42.2 67,43.2 65.5,43.6
            C 63.8,44 62,46 61.5,48.5
            L 62.5,49.5 L 62.5,58 L 60.5,58 L 60.5,50.8
            L 59,50.8 L 59,58 L 57.2,58 L 57.2,49.8
            C 55.2,50.8 52.8,51.2 50.5,50.8
            C 49.5,51.8 48.5,52.2 47.5,52.2
            L 47.5,58 L 45.5,58 L 45.5,50.5
            L 44.5,58 L 42.8,58 L 42.8,48.5
            C 42.2,46.5 42.2,45 43,44 Z
          "
        />
      </g>
    </svg>
  );

  if (variant === 'mark-only') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
        {iconSvg}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '10px',
        textDecoration: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      {/* Brand Icon */}
      {iconSvg}

      {/* Pure Typographic Wordmark: Milk in slate, MART in vibrant green */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          letterSpacing: '-0.3px',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}
      >
        <span
          style={{
            fontSize: fontSizes.milk,
            fontWeight: '600',
            color: milkTextColor
          }}
        >
          Milk
        </span>
        <span
          style={{
            fontSize: fontSizes.mart,
            fontWeight: '800',
            color: martTextColor,
            letterSpacing: '0.4px',
            marginLeft: '1px'
          }}
        >
          MART
        </span>
      </div>
    </div>
  );
};
