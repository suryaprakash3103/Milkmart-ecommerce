import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  Layers, AlertTriangle, CheckCircle2, Plus, 
  Minus, RefreshCw, Edit3, Search, Filter, 
  ArrowUpDown, AlertCircle, Sparkles, X, Check
} from 'lucide-react';

export const SellerInventory = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, low, out, healthy

  // Quick Edit Modal
  const [editingItem, setEditingItem] = useState(null);
  const [modalAction, setModalAction] = useState('set'); // set, increase, decrease
  const [inputValue, setInputValue] = useState('');

  const loadInventory = async () => {
    try {
      if (user?.id) {
        const data = await sellerService.getInventory(user.id);
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
    const handleSync = () => loadInventory();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  const handleQuickAdjust = async (productId, delta) => {
    try {
      await sellerService.updateInventoryItem(productId, {
        action: delta > 0 ? 'increase' : 'decrease',
        amount: Math.abs(delta)
      });
      showToast(`Stock updated by ${delta > 0 ? '+' + delta : delta} units`, 'success');
      loadInventory();
    } catch (err) {
      showToast('Failed to adjust stock', 'error');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (modalAction === 'set') {
        await sellerService.updateInventoryItem(editingItem.productId, {
          action: 'set',
          exactValue: inputValue
        });
      } else if (modalAction === 'increase') {
        await sellerService.updateInventoryItem(editingItem.productId, {
          action: 'increase',
          amount: inputValue
        });
      } else if (modalAction === 'decrease') {
        await sellerService.updateInventoryItem(editingItem.productId, {
          action: 'decrease',
          amount: inputValue
        });
      }

      showToast(`Stock updated successfully for ${editingItem.productName}!`, 'success');
      setEditingItem(null);
      loadInventory();
    } catch (err) {
      showToast('Error modifying inventory', 'error');
    }
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.productName.toLowerCase().includes(search.toLowerCase()) ||
                        item.category.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    if (filter === 'low') return item.isLowStock && !item.isOutOfStock;
    if (filter === 'out') return item.isOutOfStock;
    if (filter === 'healthy') return !item.isLowStock && !item.isOutOfStock;
    return true;
  });

  const lowStockCount = items.filter(i => i.isLowStock && !i.isOutOfStock).length;
  const outOfStockCount = items.filter(i => i.isOutOfStock).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
            Real-Time Farm Warehousing
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Inventory Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
            Monitor real-time dairy harvest yields, reserve orders, and safety stock thresholds.
          </p>
        </div>

        <button
          onClick={loadInventory}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '8px',
            border: '1px solid #D5CBBB',
            backgroundColor: '#FFFFFF',
            color: '#183626',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} /> Refresh Stock
        </button>
      </div>

      {/* Warnings & Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {lowStockCount > 0 && (
            <div style={{
              backgroundColor: '#FFF8E1',
              border: '1px solid #FFE082',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#B78103'
            }}>
              <AlertTriangle size={24} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>{lowStockCount} Products Running Low</strong>
                <span style={{ fontSize: '0.8rem', color: '#8C6202' }}>Stock is nearing or below minimum threshold. Replenish batch to avoid delivery pauses.</span>
              </div>
            </div>
          )}

          {outOfStockCount > 0 && (
            <div style={{
              backgroundColor: '#FFEBEE',
              border: '1px solid #FFCDD2',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#C62828'
            }}>
              <AlertCircle size={24} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>{outOfStockCount} Products Out of Stock</strong>
                <span style={{ fontSize: '0.8rem', color: '#B71C1C' }}>These items are temporarily hidden or marked unavailable on customer storefront.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E8E2D5',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={16} color="#7E8B82" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search products in inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #D5CBBB',
              fontSize: '0.88rem',
              backgroundColor: '#FAF7F2'
            }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: `All Items (${items.length})` },
            { id: 'healthy', label: 'Healthy Stock' },
            { id: 'low', label: `Low Stock (${lowStockCount})` },
            { id: 'out', label: `Out of Stock (${outOfStockCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === f.id ? '#183626' : '#FAF7F2',
                color: filter === f.id ? '#FAF7F2' : '#55685C',
                fontSize: '0.82rem',
                fontWeight: filter === f.id ? '700' : '500',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D5' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Product</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Current Stock</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Reserved</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Available for Sale</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Low Stock Alert</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Quick Adjust</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#7E8B82' }}>
                    No inventory records matching your query.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.productId} style={{ borderBottom: '1px solid #F0ECE1' }}>
                    {/* Product Name & thumbnail */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={item.image} 
                          alt={item.productName} 
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E8E2D5' }} 
                        />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#183626' }}>
                            {item.productName}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#7E8B82', textTransform: 'capitalize' }}>
                            {item.category} • Unit: {item.unit}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Current Stock */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#183626' }}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>

                    {/* Reserved Stock */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: '0.88rem', color: '#7E8B82', fontWeight: '600' }}>
                        {item.reservedStock} {item.unit}
                      </span>
                    </td>

                    {/* Available Stock */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '800',
                          color: item.isOutOfStock ? '#C62828' : (item.isLowStock ? '#B78103' : '#196D3D')
                        }}>
                          {item.availableStock} {item.unit}
                        </span>
                        {item.isOutOfStock ? (
                          <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', backgroundColor: '#FFEBEE', color: '#C62828' }}>
                            Out
                          </span>
                        ) : item.isLowStock ? (
                          <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', backgroundColor: '#FFF8E1', color: '#B78103' }}>
                            Low
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Low Stock Threshold */}
                    <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: '#55685C' }}>
                      ≤ {item.lowStockThreshold} {item.unit}
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleQuickAdjust(item.productId, -5)}
                          title="Decrease by 5"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #D5CBBB',
                            backgroundColor: '#FFFFFF',
                            color: '#183626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(item.productId, 5)}
                          title="Increase by 5"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #D5CBBB',
                            backgroundColor: '#FFFFFF',
                            color: '#183626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(item.productId, 20)}
                          title="Increase by 20"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #D5CBBB',
                            backgroundColor: '#FAF7F2',
                            color: '#183626',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          +20
                        </button>
                      </div>
                    </td>

                    {/* Edit Stock Modal Trigger */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setModalAction('set');
                          setInputValue(item.currentStock.toString());
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #D5CBBB',
                          backgroundColor: '#FAF7F2',
                          color: '#183626',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={13} /> Set Exact
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Stock Modal */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '420px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#183626', fontFamily: 'Fraunces, Georgia, serif' }}>
                Update Inventory Stock
              </h3>
              <button 
                onClick={() => setEditingItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7E8B82' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#55685C' }}>
              Modifying stock for <strong>{editingItem.productName}</strong>
            </p>

            <form onSubmit={handleModalSubmit}>
              {/* Action Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
                {[
                  { id: 'set', label: 'Set Exact' },
                  { id: 'increase', label: 'Add Stock (+)' },
                  { id: 'decrease', label: 'Deduct (-)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalAction(tab.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: modalAction === tab.id ? '#183626' : '#FAF7F2',
                      color: modalAction === tab.id ? '#FAF7F2' : '#55685C',
                      fontWeight: modalAction === tab.id ? '700' : '500',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  {modalAction === 'set' ? 'New Total Stock Amount' : (modalAction === 'increase' ? 'Units to Add' : 'Units to Deduct')}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    backgroundColor: '#FAF7F2',
                    color: '#55685C',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#183626',
                    color: '#FAF7F2',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
