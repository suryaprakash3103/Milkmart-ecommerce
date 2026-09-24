import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { 
  ShoppingBag, Trash2, Heart, ArrowRight, ArrowLeft, 
  Check, RefreshCcw, Tag, ShieldCheck 
} from 'lucide-react';

export const CartPage = () => {
  const {
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
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    applyCoupon(couponCode);
    setCouponCode('');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E6DEC9',
            padding: '48px 24px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🥛</div>
            <h2 style={{ fontSize: '1.8rem', color: '#183626', marginBottom: '8px' }}>
              Your Milk Basket is Empty
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#798C80', marginBottom: '24px', lineHeight: 1.6 }}>
              You have no farm dairy items in your morning delivery basket yet. Explore pure A2 raw milk, set curd, and Vedic bilona ghee.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping Farm Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
              Morning Milk Basket
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#55685C', marginTop: '4px' }}>
              Scheduled for doorstep drop tomorrow between <strong>5:30 AM – 7:30 AM</strong>
            </p>
          </div>
          <button
            onClick={clearCart}
            style={{
              fontSize: '0.84rem',
              color: '#B2341A',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'none',
              border: 'none'
            }}
          >
            Clear Entire Basket
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Items Table */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E6DEC9',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FAF5EE',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '0.84rem',
              color: '#183626'
            }}>
              <RefreshCcw size={18} color="#196D3D" style={{ flexShrink: 0 }} />
              <div>
                <strong>Glass Bottle Exchange Loop:</strong> ₹0 deposit applied. Leave your empty rinsed bottles in the doorstep bag tomorrow morning!
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {cartItems.map((item) => {
                const wishlisted = isInWishlist(item.id);
                return (
                  <div
                    key={`${item.id}-${item.size}`}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      paddingBottom: '18px',
                      borderBottom: '1px solid #F1EDE3'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Link to={`/products/${item.id}`} style={{ textDecoration: 'none' }}>
                            <h4 style={{ fontSize: '1rem', color: '#183626', margin: 0 }}>
                              {item.name}
                            </h4>
                          </Link>
                          <div style={{ fontSize: '0.82rem', color: '#798C80', marginTop: '2px' }}>
                            Bottle Size: <strong>{item.size}</strong> • ₹{item.price} each
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.15rem', fontWeight: '700', color: '#183626' }}>
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                        <QuantitySelector
                          quantity={item.quantity}
                          onDecrease={() => updateQuantity(item.id, item.size, -1)}
                          onIncrease={() => updateQuantity(item.id, item.size, 1)}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button
                            onClick={() => toggleWishlist(item)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.78rem',
                              color: wishlisted ? '#A26D24' : '#798C80',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            <Heart size={14} fill={wishlisted ? "#A26D24" : "none"} />
                            {wishlisted ? "Saved" : "Save for later"}
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.78rem',
                              color: '#B2341A',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '20px' }}>
              <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>
                <ArrowLeft size={16} /> Continue Adding Fresh Dairy
              </Link>
            </div>
          </div>

          {/* Right Summary Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E6DEC9',
            padding: '28px',
            boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
          }}>
            <h3 style={{ fontSize: '1.25rem', color: '#183626', marginBottom: '18px' }}>
              Order &amp; Morning Drop Summary
            </h3>

            {/* Coupon Code section */}
            <div style={{ marginBottom: '20px' }}>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#E8F5EE',
                  border: '1px solid rgba(25, 109, 61, 0.25)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  color: '#196D3D'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} />
                    <span>Promo <strong>{appliedCoupon.code}</strong> active</span>
                  </div>
                  <button onClick={removeCoupon} style={{ color: '#B2341A', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. MILK10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                <span>Basket Subtotal</span>
                <span style={{ fontWeight: '600', color: '#183626' }}>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E5A17', fontWeight: '600' }}>
                  <span>Discount Applied</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                <span>Sunrise Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#196D3D' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                <span>Glass Bottle Deposit</span>
                <span style={{ color: '#196D3D', fontWeight: '600' }}>₹0 (Waived)</span>
              </div>

              {/* GST Tax Breakdown Pill */}
              <div style={{
                backgroundColor: '#FAF5EE',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                color: '#55685C',
                marginTop: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#183626' }}>
                  <span>Includes GST (CGST + SGST):</span>
                  <span>₹{totalGstAmount}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#798C80', marginTop: '2px' }}>
                  Taxable Subtotal: ₹{totalTaxableValue} • CGST: ₹{cgstAmount} • SGST: ₹{sgstAmount}
                </div>
              </div>

              <div style={{
                borderTop: '1px solid #E6DEC9',
                paddingTop: '12px',
                marginTop: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#183626'
              }}>
                <span>Payable Total</span>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-dark btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '14px' }}
            >
              Proceed to Doorstep Checkout <ArrowRight size={18} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: '#798C80'
            }}>
              <ShieldCheck size={14} color="#196D3D" />
              <span>Unbroken 4°C cold chain &amp; 100% money-back freshness guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
