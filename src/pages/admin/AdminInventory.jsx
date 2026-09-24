import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';
import { Boxes, AlertTriangle, CheckCircle, RefreshCw, ThermometerSnowflake } from 'lucide-react';

export const AdminInventory = () => {
  const { products, updateProduct } = useProducts();
  const { showToast } = useToast();

  const handleStockAdjust = (id, current, delta) => {
    const nextStock = Math.max(0, current + delta);
    const availability = nextStock === 0 ? 'Out of Stock' : 'In Stock';
    updateProduct(id, { stock: nextStock, availability });
    showToast(`Adjusted inventory for SKU to ${nextStock} units`);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
          Inventory &amp; Chiller Batch Manifests
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
          Batch lot numbers, minimum stock thresholds, and live cold-chain status
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E6DEC9',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF5EE', borderBottom: '1px solid #E6DEC9', color: '#183626' }}>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Product &amp; Batch</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Category</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Current Units</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Min. Buffer</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Chiller Spec</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', textAlign: 'right' }}>Stock Controls</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const minBuffer = 20;
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock < minBuffer;

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1EDE3' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: '700', color: '#183626' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#798C80' }}>
                        Batch: LOT-2026-{p.id.toUpperCase()} • {p.size}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#55685C' }}>
                      {p.category}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: isOut ? '#B2341A' : isLow ? '#8E5A17' : '#183626' }}>
                      {p.stock} units
                    </td>
                    <td style={{ padding: '14px 18px', color: '#798C80' }}>
                      {minBuffer} units
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: '#0E587B' }}>
                      {p.coldChain || '3.8°C'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        backgroundColor: isOut ? '#FDE8E4' : isLow ? '#FDF4E3' : '#E8F5EE',
                        color: isOut ? '#B2341A' : isLow ? '#8E5A17' : '#196D3D'
                      }}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleStockAdjust(p.id, p.stock, -5)}
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FAF5EE', fontWeight: '700', cursor: 'pointer' }}
                          title="Reduce 5 units"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockAdjust(p.id, p.stock, 10)}
                          style={{ width: '36px', height: '28px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#E8F5EE', color: '#196D3D', fontWeight: '700', cursor: 'pointer' }}
                          title="Add 10 units"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleStockAdjust(p.id, p.stock, 50)}
                          style={{ width: '42px', height: '28px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#183626', color: '#FAF7F2', fontWeight: '700', cursor: 'pointer' }}
                          title="Replenish batch (+50)"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
