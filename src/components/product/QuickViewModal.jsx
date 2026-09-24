import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { RatingStars } from '../common/RatingStars';
import { PriceDisplay } from '../common/PriceDisplay';
import { QuantitySelector } from '../common/QuantitySelector';
import { X, Heart, ShoppingBag, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickViewModal = ({ product, isOpen, onClose, onOpenSubscribe }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(() => product ? product.size : '');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.availability === 'Out of Stock';
  const isWishlisted = isInWishlist(product.id);

  let currentPrice = product.price;
  let currentOriginalPrice = product.originalPrice;
  if (product.availableSizes) {
    const matched = product.availableSizes.find((v) => v.size === (selectedSize || product.size));
    if (matched) {
      currentPrice = matched.price;
      currentOriginalPrice = matched.originalPrice;
    }
  }

  const handleAdd = () => {
    addToCart(product, selectedSize || product.size, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize || product.size, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            backgroundColor: '#FAF7F2',
            border: '1px solid #E6DEC9',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#183626',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Product Image */}
          <div style={{ backgroundColor: '#FAF5EE', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ maxHeight: '340px', width: '100%', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            />
          </div>

          {/* Details */}
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-fresh">{product.freshness}</span>
              <span className="badge badge-chilled">{product.coldChain}</span>
            </div>

            <span style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '700', textTransform: 'uppercase' }}>
              {product.brand}
            </span>

            <h2 style={{ fontSize: '1.45rem', color: '#183626', margin: '4px 0 10px 0' }}>
              {product.name}
            </h2>

            <div style={{ marginBottom: '14px' }}>
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={15} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <PriceDisplay price={currentPrice} originalPrice={currentOriginalPrice} discount={product.discount} size="lg" />
              <div style={{ fontSize: '0.78rem', color: '#55685C', marginTop: '4px' }}>
                HSN: {product.hsnCode || '0401'} • {product.gstRate || 0}% GST Included • {product.farmOrigin ? product.farmOrigin.split(',')[0] : 'Kanakapura Farm'}
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#55685C', lineHeight: 1.5, marginBottom: '16px' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            {product.availableSizes && (
              <div style={{ marginBottom: '18px' }}>
                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
                  Select Pack Size:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {product.availableSizes.map((v) => (
                    <button
                      key={v.size}
                      type="button"
                      onClick={() => setSelectedSize(v.size)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: (selectedSize || product.size) === v.size ? '700' : '500',
                        backgroundColor: (selectedSize || product.size) === v.size ? '#183626' : '#FAF7F2',
                        color: (selectedSize || product.size) === v.size ? '#FAF7F2' : '#55685C',
                        border: (selectedSize || product.size) === v.size ? '1.5px solid #183626' : '1px solid #E6DEC9',
                        cursor: 'pointer'
                      }}
                    >
                      {v.size} (₹{v.price})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
              />

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="btn btn-dark"
                style={{ flex: 1 }}
              >
                <ShoppingBag size={17} /> Add to Basket
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #E6DEC9',
                  backgroundColor: '#FFFFFF',
                  color: isWishlisted ? '#A26D24' : '#55685C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Heart size={18} fill={isWishlisted ? "#A26D24" : "none"} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Zap size={16} /> Buy Now
              </button>

              {product.isSubscribable && onOpenSubscribe && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSubscribe(product, selectedSize || product.size);
                  }}
                  className="btn btn-ghost"
                  style={{ flex: 1, borderColor: '#A26D24', color: '#8E5A17', fontWeight: '700' }}
                >
                  <Calendar size={16} /> Subscribe Daily
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
