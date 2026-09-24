import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({ quantity = 1, onDecrease, onIncrease, min = 1, max = 99, size = "md" }) => {
  const isSmall = size === "sm";

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '8px',
      border: '1px solid #E6DEC9',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden'
    }}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        style={{
          width: isSmall ? '28px' : '34px',
          height: isSmall ? '28px' : '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF7F2',
          border: 'none',
          color: quantity <= min ? '#CBD5CB' : '#183626',
          cursor: quantity <= min ? 'not-allowed' : 'pointer'
        }}
        aria-label="Decrease quantity"
      >
        <Minus size={isSmall ? 13 : 15} />
      </button>

      <span style={{
        minWidth: isSmall ? '28px' : '36px',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: isSmall ? '0.85rem' : '0.95rem',
        color: '#183626'
      }}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        style={{
          width: isSmall ? '28px' : '34px',
          height: isSmall ? '28px' : '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF7F2',
          border: 'none',
          color: quantity >= max ? '#CBD5CB' : '#183626',
          cursor: quantity >= max ? 'not-allowed' : 'pointer'
        }}
        aria-label="Increase quantity"
      >
        <Plus size={isSmall ? 13 : 15} />
      </button>
    </div>
  );
};
