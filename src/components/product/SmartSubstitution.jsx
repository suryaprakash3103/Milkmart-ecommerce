import React from 'react';
import { useCart } from '../../context/CartContext';
import { Sparkles } from 'lucide-react';

export const SmartSubstitution = ({ originalProduct, substituteProduct }) => {
  const { addToCart } = useCart();

  if (!substituteProduct) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        backgroundColor: '#FDF8F0',
        border: '1px dashed rgba(162, 109, 36, 0.45)',
        borderRadius: '7px',
        padding: '5px 8px',
        marginTop: '6px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
        <Sparkles size={12} color="#8E5A17" style={{ flexShrink: 0 }} />
        <span
          style={{
            fontSize: '0.72rem',
            color: '#183626',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={substituteProduct.name}
        >
          Try: {substituteProduct.name} (₹{substituteProduct.price})
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          addToCart(substituteProduct);
        }}
        style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          border: 'none',
          borderRadius: '5px',
          padding: '3px 8px',
          fontSize: '0.7rem',
          fontWeight: '700',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}
        title={`Add ${substituteProduct.name} to basket`}
      >
        + Add
      </button>
    </div>
  );
};
