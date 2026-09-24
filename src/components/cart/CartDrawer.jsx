import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, Check, RefreshCcw } from 'lucide-react';
import { QuantitySelector } from '../common/QuantitySelector';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    itemCount,
    subtotal,
    discountAmount,
    deliveryFee,
    bottleDeposit,
    finalTotal,
    totalTaxableValue,
    totalGstAmount,
    cgstAmount,
    sgstAmount,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 35, 24, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(24, 54, 38, 0.25)',
          animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          backgroundColor: '#183626',
          color: '#FAF7F2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#E8C582" />
            <h3 style={{ color: '#FAF7F2', fontSize: '1.2rem', margin: 0 }}>
              Milk Basket ({itemCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              color: '#FAF7F2',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Delivery / Bottle Loop notice */}
        <div style={{
          backgroundColor: '#FAF5EE',
          borderBottom: '1px solid #E6DEC9',
          padding: '10px 18px',
          fontSize: '0.8rem',
          color: '#183626',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <RefreshCcw size={16} color="#196D3D" style={{ flexShrink: 0 }} />
          <span>
            <strong>Glass Bottle Exchange:</strong> ₹0 deposit applied. Leave your empty rinsed bottles out tomorrow!
          </span>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#FAF5EE',
                color: '#798C80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '2rem'
              }}>
                🥛
              </div>
              <h4 style={{ fontSize: '1.2rem', color: '#183626', marginBottom: '8px' }}>
                Your Milk Basket is Empty
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#798C80', marginBottom: '20px' }}>
                Explore farm fresh A2 milk, bilona ghee, set curd, and artisan paneer.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/products');
                }}
                className="btn btn-primary"
              >
                Browse Dairy Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #E6DEC9',
                    backgroundColor: '#FAF7F2'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{
                        fontSize: '0.9rem',
                        color: '#183626',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        style={{ color: '#798C80', cursor: 'pointer', padding: '2px' }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#798C80', margin: '3px 0 8px 0' }}>
                      {item.size} • ₹{item.price} each
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <QuantitySelector
                        quantity={item.quantity}
                        onDecrease={() => updateQuantity(item.id, item.size, -1)}
                        onIncrease={() => updateQuantity(item.id, item.size, 1)}
                        size="sm"
                      />
                      <span style={{ fontWeight: '700', color: '#183626', fontSize: '0.95rem' }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals & Coupon */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '18px 22px',
            borderTop: '1px solid #E6DEC9',
            backgroundColor: '#FAF7F2'
          }}>
            {/* Coupon input */}
            <div style={{ marginBottom: '14px' }}>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#E8F5EE',
                  border: '1px solid rgba(25, 109, 61, 0.25)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  color: '#196D3D'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ color: '#B2341A', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. MILK10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{ flex: 1, padding: '7px 12px', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Bill breakdown */}
            <div style={{ fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E5A17', fontWeight: '600' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                <span>Doorstep Morning Drop (5:30 AM)</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#196D3D' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                <span>Glass Bottle Deposit</span>
                <span style={{ color: '#196D3D', fontWeight: '600' }}>₹0 (Exchange Loop)</span>
              </div>
              <div style={{
                backgroundColor: '#FAF5EE',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.78rem',
                color: '#55685C',
                margin: '2px 0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#183626' }}>
                  <span>Includes GST (CGST + SGST):</span>
                  <span>₹{totalGstAmount}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#798C80', marginTop: '2px' }}>
                  Taxable: ₹{totalTaxableValue} • CGST: ₹{cgstAmount} • SGST: ₹{sgstAmount}
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #E6DEC9',
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#183626'
              }}>
                <span>Total Amount</span>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-dark btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Proceed to Doorstep Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
