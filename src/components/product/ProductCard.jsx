import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';
import { RatingStars } from '../common/RatingStars';
import { PriceDisplay } from '../common/PriceDisplay';
import { SmartSubstitution } from './SmartSubstitution';
import { Heart, ShoppingBag, Eye, Calendar, Plus, Minus, ThermometerSnowflake } from 'lucide-react';

export const ProductCard = ({ product, onOpenQuickView, onOpenSubscribe }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getSubstituteProduct } = useProducts();

  const [selectedSize, setSelectedSize] = useState(product.size);

  const isOutOfStock = product.availability === 'Out of Stock';
  const isWishlisted = isInWishlist(product.id);
  const substitute = isOutOfStock ? getSubstituteProduct(product) : null;

  // Find active variant price
  let currentPrice = product.price;
  let currentOriginalPrice = product.originalPrice;
  if (product.availableSizes) {
    const matched = product.availableSizes.find((v) => v.size === selectedSize);
    if (matched) {
      currentPrice = matched.price;
      currentOriginalPrice = matched.originalPrice;
    }
  }

  // Check if item is already in cart with this size
  const cartEntry = cartItems.find((ci) => ci.id === product.id && ci.size === selectedSize);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, selectedSize, 1);
  };

  return (
    <div
      className="card-artisan"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E6DEC9',
        borderRadius: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Compact Image Header (Shorter height, no wasted vertical space) */}
      <div
        style={{
          position: 'relative',
          height: '155px',
          overflow: 'hidden',
          backgroundColor: '#F8F4EC'
        }}
      >
        <Link to={`/products/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
          />
        </Link>

        {/* Badges Left */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 2
          }}
        >
          {product.freshness && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                border: '1px solid rgba(25, 109, 61, 0.25)',
                color: '#196D3D',
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '2px 7px',
                borderRadius: '12px',
                backdropFilter: 'blur(4px)'
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#196D3D' }} />
              {product.freshness}
            </span>
          )}
          {product.coldChain && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                backgroundColor: 'rgba(235, 244, 249, 0.94)',
                border: '1px solid rgba(14, 88, 123, 0.25)',
                color: '#0E587B',
                fontSize: '0.66rem',
                fontWeight: '600',
                padding: '1px 6px',
                borderRadius: '10px'
              }}
            >
              <ThermometerSnowflake size={10} /> {product.coldChain}
            </span>
          )}
        </div>

        {/* Action Buttons Right */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 2
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWishlisted ? '#A26D24' : '#55685C',
              cursor: 'pointer',
              transition: 'transform 0.15s'
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={isWishlisted ? '#A26D24' : 'none'} />
          </button>

          {onOpenQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onOpenQuickView(product);
              }}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#55685C',
                cursor: 'pointer',
                transition: 'transform 0.15s'
              }}
              title="Quick Preview"
            >
              <Eye size={14} />
            </button>
          )}
        </div>

        {/* Fat Content Pill Bottom-Right */}
        {product.fatContent && (
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              right: '6px',
              backgroundColor: 'rgba(24, 54, 38, 0.88)',
              color: '#FAF7F2',
              padding: '2px 6px',
              borderRadius: '5px',
              fontSize: '0.68rem',
              fontWeight: '600',
              backdropFilter: 'blur(3px)'
            }}
          >
            {product.fatContent}
          </div>
        )}
      </div>

      {/* Card Body - Tight, Neat, Zero Gaps */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column' }}>
        {/* Brand & Stock Status Line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#798C80',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}
          >
            {product.brand}
          </span>
          {isOutOfStock ? (
            <span
              style={{
                fontSize: '0.68rem',
                color: '#B2341A',
                fontWeight: '700',
                backgroundColor: '#FDE8E4',
                padding: '1px 5px',
                borderRadius: '4px'
              }}
            >
              Sold Out
            </span>
          ) : product.stock < 15 ? (
            <span
              style={{
                fontSize: '0.68rem',
                color: '#8E5A17',
                fontWeight: '700',
                backgroundColor: '#FDF4E3',
                padding: '1px 5px',
                borderRadius: '4px'
              }}
            >
              Only {product.stock} Left
            </span>
          ) : (
            <span style={{ fontSize: '0.68rem', color: '#196D3D', fontWeight: '600' }}>In Stock</span>
          )}
        </div>

        {/* Product Title */}
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', marginBottom: '4px' }}>
          <h3
            style={{
              fontSize: '0.94rem',
              color: '#183626',
              lineHeight: 1.3,
              fontWeight: '600',
              height: '2.6em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              margin: 0
            }}
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Star Rating */}
        <div style={{ marginBottom: '6px' }}>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={11} />
        </div>

        {/* Size Variant Selector (Compact) */}
        {product.availableSizes && product.availableSizes.length > 1 && (
          <div style={{ display: 'flex', gap: '5px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {product.availableSizes.map((v) => (
              <button
                key={v.size}
                type="button"
                onClick={() => setSelectedSize(v.size)}
                style={{
                  padding: '2px 7px',
                  borderRadius: '5px',
                  fontSize: '0.7rem',
                  fontWeight: selectedSize === v.size ? '700' : '500',
                  backgroundColor: selectedSize === v.size ? '#183626' : '#FAF7F2',
                  color: selectedSize === v.size ? '#FAF7F2' : '#55685C',
                  border: selectedSize === v.size ? '1px solid #183626' : '1px solid #E6DEC9',
                  cursor: 'pointer',
                  lineHeight: 1.2
                }}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}

        {/* Unified Bottom Row: Price on Left + Add/Quantity on Right (No Gap!) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid #F1EDE3',
            gap: '8px'
          }}
        >
          {/* Price */}
          <div>
            <PriceDisplay
              price={currentPrice}
              originalPrice={currentOriginalPrice}
              discount={product.discount}
              size="md"
            />
          </div>

          {/* Action on Right */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#F1EDE3',
                  color: '#798C80',
                  fontWeight: '600',
                  fontSize: '0.74rem',
                  border: '1px solid #E6DEC9',
                  cursor: 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                Unavailable
              </button>
            ) : cartEntry ? (
              /* Compact Quantity Counter */
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#183626',
                  borderRadius: '7px',
                  color: '#FAF7F2',
                  padding: '2px 4px',
                  gap: '6px'
                }}
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, selectedSize, -1)}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Decrease"
                >
                  <Minus size={11} />
                </button>
                <span style={{ fontWeight: '700', fontSize: '0.82rem', minWidth: '14px', textAlign: 'center' }}>
                  {cartEntry.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, selectedSize, 1)}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Increase"
                >
                  <Plus size={11} />
                </button>
              </div>
            ) : (
              /* Compact Add to Basket Button */
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#183626',
                  color: '#FAF7F2',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s, transform 0.1s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#10261A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#183626')}
              >
                <ShoppingBag size={13} /> Add
              </button>
            )}
          </div>
        </div>

        {/* Out of Stock Smart Substitution Link */}
        {isOutOfStock && substitute && (
          <SmartSubstitution originalProduct={product} substituteProduct={substitute} />
        )}

        {/* Subscribe One-Liner (Compact, Neat) */}
        {product.isSubscribable && !isOutOfStock && onOpenSubscribe && (
          <button
            type="button"
            onClick={() => onOpenSubscribe(product, selectedSize)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              color: '#8E5A17',
              fontWeight: '700',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 0',
              marginTop: '6px',
              textAlign: 'center',
              width: '100%'
            }}
          >
            <Calendar size={11} /> Subscribe &amp; Save 10% (Daily Run)
          </button>
        )}
      </div>
    </div>
  );
};
