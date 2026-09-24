import React from 'react';

export const PriceDisplay = ({ price, originalPrice = null, discount = null, size = "md" }) => {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{
        fontFamily: 'Fraunces, Georgia, serif',
        fontSize: isLarge ? '1.8rem' : isSmall ? '1.05rem' : '1.35rem',
        fontWeight: '700',
        color: '#183626'
      }}>
        ₹{price}
      </span>
      {originalPrice && originalPrice > price && (
        <span style={{
          fontSize: isLarge ? '1.05rem' : '0.85rem',
          color: '#798C80',
          textDecoration: 'line-through'
        }}>
          ₹{originalPrice}
        </span>
      )}
      {discount && (
        <span style={{
          fontSize: isLarge ? '0.82rem' : '0.72rem',
          fontWeight: '700',
          color: '#8E5A17',
          backgroundColor: '#FDF4E3',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {discount}% OFF
        </span>
      )}
    </div>
  );
};
