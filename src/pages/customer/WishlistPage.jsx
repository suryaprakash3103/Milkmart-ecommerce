import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { RatingStars } from '../../components/common/RatingStars';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E6DEC9',
            padding: '48px 24px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💛</div>
            <h2 style={{ fontSize: '1.8rem', color: '#183626', marginBottom: '8px' }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#798C80', marginBottom: '24px' }}>
              Save your favorite pastured milk, Vedic bilona ghee, or set dahi to quickly re-order anytime.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Farm Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
              Saved Farm Favorites ({wishlistItems.length})
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#55685C', marginTop: '4px' }}>
              Keep track of dairy essentials for quick additions to your morning milk basket
            </p>
          </div>
          <button
            onClick={clearWishlist}
            style={{ fontSize: '0.84rem', color: '#B2341A', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            Clear Wishlist
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {wishlistItems.map((product) => {
            const isOutOfStock = product.availability === 'Out of Stock';
            return (
              <div
                key={product.id}
                className="card-artisan"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#B2341A',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', color: '#798C80', textTransform: 'uppercase', fontWeight: '600' }}>
                    {product.brand}
                  </span>
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.05rem', color: '#183626', margin: '4px 0 8px 0', height: '2.6em', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                  </Link>

                  <div style={{ marginBottom: '12px' }}>
                    <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="md" />
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => moveToCart(product)}
                      disabled={isOutOfStock}
                      className="btn btn-dark btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <ShoppingBag size={15} /> Move to Basket
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '30px' }}>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>
            <ArrowLeft size={16} /> Continue Browsing Farm Dairy
          </Link>
        </div>
      </div>
    </div>
  );
};
