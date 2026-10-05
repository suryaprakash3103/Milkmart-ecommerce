import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { RatingStars } from '../../components/common/RatingStars';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { ProductCard } from '../../components/product/ProductCard';
import { SmartSubstitution } from '../../components/product/SmartSubstitution';
import { SubscriptionModal } from '../../components/subscription/SubscriptionModal';
import { PurityCertificateModal } from '../../components/common/PurityCertificateModal';
import { 
  Heart, ShoppingBag, Zap, Calendar, ShieldCheck, 
  Truck, ThermometerSnowflake, RefreshCcw, Check, Sparkles, 
  MessageSquarePlus, Star, Award, MapPin, ExternalLink 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, reviews, addReview, getSubstituteProduct } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedSize, setSelectedSize] = useState(product ? product.size : '1 L');
  const [quantity, setQuantity] = useState(1);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isPurityModalOpen, setIsPurityModalOpen] = useState(false);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return <div className="container" style={{ padding: '60px 0' }}>Product not found.</div>;
  }

  const isOutOfStock = product.availability === 'Out of Stock';
  const isWishlisted = isInWishlist(product.id);
  const substitute = isOutOfStock ? getSubstituteProduct(product) : null;

  // Variant matching
  let activePrice = product.price;
  let activeOriginalPrice = product.originalPrice;
  if (product.availableSizes) {
    const matched = product.availableSizes.find((v) => v.size === selectedSize);
    if (matched) {
      activePrice = matched.price;
      activeOriginalPrice = matched.originalPrice;
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) {
      showToast("Please fill in your name and comment", "error");
      return;
    }

    addReview({
      productId: product.id,
      author: reviewAuthor,
      rating: Number(reviewRating),
      title: reviewTitle || "Pure and Farm Fresh",
      comment: reviewComment
    });

    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    showToast("Thank you! Your verified review was added.");
  };

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div style={{ padding: '24px 0 60px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.84rem', color: '#798C80', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#55685C' }}>Home</Link> &gt;{' '}
          <Link to="/products" style={{ color: '#55685C' }}>Shop</Link> &gt;{' '}
          <span style={{ color: '#183626', fontWeight: '700' }}>{product.name}</span>
        </div>

        {/* Top Product Section (Gallery + Info) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E6DEC9',
          padding: '36px',
          marginBottom: '40px'
        }}>
          {/* Left: Product Image */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              backgroundColor: '#FAF5EE',
              border: '1px solid #EFE8D8',
              boxShadow: '0 8px 24px rgba(24, 54, 38, 0.06)'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', maxHeight: '460px', objectFit: 'cover' }}
              />

              {/* Floating badges */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="badge badge-fresh" style={{ fontSize: '0.82rem', padding: '5px 12px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
                  {product.freshness}
                </span>
                <span className="badge badge-chilled" style={{ fontSize: '0.82rem', padding: '5px 12px' }}>
                  <ThermometerSnowflake size={14} /> {product.coldChain}
                </span>
              </div>
            </div>

            {/* Farm cold chain guarantees row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginTop: '16px'
            }}>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #E6DEC9' }}>
                <RefreshCcw size={18} color="#196D3D" style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#183626' }}>Glass Bottle</div>
                <div style={{ fontSize: '0.68rem', color: '#798C80' }}>Return for ₹10 Back</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #E6DEC9' }}>
                <Truck size={18} color="#A26D24" style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#183626' }}>Sunrise Drop</div>
                <div style={{ fontSize: '0.68rem', color: '#798C80' }}>5:30 AM – 7:30 AM</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #E6DEC9' }}>
                <ShieldCheck size={18} color="#0E587B" style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#183626' }}>Lab Tested</div>
                <div style={{ fontSize: '0.68rem', color: '#798C80' }}>0% Adulteration</div>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#798C80', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              {product.brand}
            </span>

            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2.1rem', color: '#183626', margin: '6px 0 12px 0' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={16} />
              <span style={{ color: '#E6DEC9' }}>|</span>
              <span style={{ fontSize: '0.85rem', color: isOutOfStock ? '#B2341A' : '#196D3D', fontWeight: '700' }}>
                {product.availability} ({product.stock} units left)
              </span>
            </div>

            {/* Price Box */}
            <div style={{
              backgroundColor: '#FAF5EE',
              border: '1px solid #E6DEC9',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px'
            }}>
              <PriceDisplay price={activePrice} originalPrice={activeOriginalPrice} discount={product.discount} size="lg" />
              <div style={{ fontSize: '0.8rem', color: '#55685C', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span>Inclusive of all taxes • <strong>HSN: {product.hsnCode || '0401'} ({product.gstRate || 0}% GST)</strong></span>
                <span style={{ color: '#166534', fontWeight: '700' }}>₹0 Bottle Deposit</span>
              </div>
            </div>

            {/* Farm-to-Doorstep Purity Certificate Banner */}
            <div style={{
              backgroundColor: '#F2FAF5',
              border: '1.5px solid #C6EAD3',
              borderRadius: '14px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.88rem', color: '#166534' }}>
                  <ShieldCheck size={18} color="#166534" />
                  Farm-to-Doorstep Purity Certificate
                </div>
                <div style={{ fontSize: '0.78rem', color: '#55685C', marginTop: '2px' }}>
                  Milked 4:30 AM • 3.6°C Cold Chain • 0% Adulterants • NABL Verified
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPurityModalOpen(true)}
                style={{
                  backgroundColor: '#166534',
                  color: '#FAF7F2',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Award size={14} /> View Certificate
              </button>
            </div>

            {/* Size Selector */}
            {product.availableSizes && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
                  Choose Volume / Pack Size:
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.availableSizes.map((v) => (
                    <button
                      key={v.size}
                      type="button"
                      onClick={() => setSelectedSize(v.size)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: selectedSize === v.size ? '700' : '500',
                        backgroundColor: selectedSize === v.size ? '#183626' : '#FAF7F2',
                        color: selectedSize === v.size ? '#FAF7F2' : '#55685C',
                        border: selectedSize === v.size ? '2px solid #183626' : '1px solid #E6DEC9',
                        cursor: 'pointer'
                      }}
                    >
                      {v.size} — ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Cart Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
              />

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-dark btn-lg"
                style={{ flex: 1, minWidth: '180px' }}
              >
                <ShoppingBag size={18} /> Add to Basket
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, minWidth: '140px' }}
              >
                <Zap size={18} /> Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '1px solid #E6DEC9',
                  backgroundColor: '#FFFFFF',
                  color: isWishlisted ? '#A26D24' : '#55685C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? "#A26D24" : "none"} />
              </button>
            </div>

            {/* Smart Substitution Alert if Out of Stock */}
            {isOutOfStock && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#FDE8E4', color: '#B2341A', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                  This item is currently sold out for tomorrow morning's run.
                </div>
                {substitute && <SmartSubstitution originalProduct={product} substituteProduct={substitute} />}
              </div>
            )}

            {/* Subscription CTA Banner */}
            {product.isSubscribable && !isOutOfStock && (
              <div style={{
                backgroundColor: '#FDF4E3',
                border: '1.5px solid #E8C582',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto'
              }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#8E5A17' }}>
                    📅 Morning Subscription Plan (10% Daily Discount)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#55685C' }}>
                    Deliver {selectedSize} every morning before 7:30 AM. Pause anytime.
                  </div>
                </div>
                <button
                  onClick={() => setIsSubscribeOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Configure Plan
                </button>
              </div>
            )}

            {/* Verified Sourcing Farm Card */}
            <div style={{
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #E8E2D5',
              borderRadius: '14px',
              padding: '14px 18px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#183626',
                  color: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={22} color="#E8C582" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '800', color: '#196D3D' }}>Verified Sourcing Origin</span>
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#183626' }}>
                    {product.brand || product.farmName || 'Green Valley Dairy Farm'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#7E8B82', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#A26D24" /> {product.farmLocation || product.farmOrigin || 'Coimbatore, Tamil Nadu'}
                  </div>
                </div>
              </div>

              <Link
                to={`/farm/${product.farmId || (product.brand?.toLowerCase().includes('lakshmi') ? 'farm-sri-lakshmi' : (product.brand?.toLowerCase().includes('gir') ? 'farm-gir-amrit' : 'farm-green-valley'))}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#183626',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                Visit Farm Store <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Nutritional Breakdown & Fat Content Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Nutrition Table */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E6DEC9',
            borderRadius: '18px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#183626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#A26D24" /> Nutritional Facts &amp; Purity
            </h3>
            {product.nutritionalInfo && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F1EDE3' }}>
                    <td style={{ padding: '8px 0', color: '#798C80' }}>Energy / Calories</td>
                    <td style={{ padding: '8px 0', fontWeight: '700', textAlign: 'right', color: '#183626' }}>{product.nutritionalInfo.calories}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1EDE3' }}>
                    <td style={{ padding: '8px 0', color: '#798C80' }}>Natural Milk Protein</td>
                    <td style={{ padding: '8px 0', fontWeight: '700', textAlign: 'right', color: '#183626' }}>{product.nutritionalInfo.protein}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1EDE3' }}>
                    <td style={{ padding: '8px 0', color: '#798C80' }}>Fat Ratio (Cow/Buffalo)</td>
                    <td style={{ padding: '8px 0', fontWeight: '700', textAlign: 'right', color: '#183626' }}>{product.fatContent}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1EDE3' }}>
                    <td style={{ padding: '8px 0', color: '#798C80' }}>Natural Lactose Carbohydrates</td>
                    <td style={{ padding: '8px 0', fontWeight: '700', textAlign: 'right', color: '#183626' }}>{product.nutritionalInfo.carbs}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#798C80' }}>Bio-Available Calcium</td>
                    <td style={{ padding: '8px 0', fontWeight: '700', textAlign: 'right', color: '#196D3D' }}>{product.nutritionalInfo.calcium}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Farmstead Heritage & Cold Chain Narrative */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E6DEC9',
            borderRadius: '18px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#183626', marginBottom: '14px' }}>
              Cold Chain &amp; Freshness Batch
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#55685C', lineHeight: 1.6, marginBottom: '16px' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1EDE3' }}>
                <span style={{ color: '#798C80' }}>Chilling Protocol:</span>
                <strong style={{ color: '#0E587B' }}>{product.coldChain}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1EDE3' }}>
                <span style={{ color: '#798C80' }}>Best Before:</span>
                <strong style={{ color: '#183626' }}>{product.bestBefore}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#798C80' }}>Packaging:</span>
                <strong style={{ color: '#196D3D' }}>Sanitized Food-Grade Glass Bottle</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E6DEC9',
          padding: '30px',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #F1EDE3', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#183626', margin: 0 }}>
                Verified Household Reviews ({productReviews.length})
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#798C80', margin: '4px 0 0 0' }}>
                Real feedback from morning milk subscribers
              </p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn btn-outline-dark btn-sm"
            >
              <MessageSquarePlus size={15} /> {showReviewForm ? "Cancel Form" : "Write a Review"}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} style={{
              backgroundColor: '#FAF5EE',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #E6DEC9'
            }}>
              <h4 style={{ fontSize: '1rem', color: '#183626', marginBottom: '12px' }}>
                Share Your Experience with {product.name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Rating (Stars)</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    style={{ width: '100%' }}
                  >
                    <option value={5}>5 Stars - Pure Farm Excellence</option>
                    <option value={4}>4 Stars - Very Good Quality</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Needs Improvement</option>
                    <option value={1}>1 Star - Unsatisfactory</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Golden cream layer and prompt morning drop!"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Review Details</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the taste, freshness, and glass bottle condition?"
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {productReviews.length === 0 ? (
              <div style={{ color: '#798C80', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No reviews yet for this product. Be the first to review!
              </div>
            ) : (
              productReviews.map((rev) => (
                <div key={rev.id} style={{
                  padding: '16px',
                  backgroundColor: '#FAF7F2',
                  borderRadius: '12px',
                  border: '1px solid #EFE8D8'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ color: '#183626', fontSize: '0.92rem' }}>{rev.author}</strong>
                      {rev.verified && (
                        <span style={{ fontSize: '0.72rem', color: '#196D3D', backgroundColor: '#E8F5EE', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                          ✓ Verified Subscriber
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#798C80' }}>{rev.date}</span>
                  </div>

                  <div style={{ marginBottom: '6px' }}>
                    <RatingStars rating={rev.rating} size={13} />
                  </div>

                  {rev.title && (
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#183626', marginBottom: '4px' }}>
                      {rev.title}
                    </div>
                  )}

                  <p style={{ fontSize: '0.86rem', color: '#55685C', lineHeight: 1.5, margin: 0 }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#183626', marginBottom: '20px' }}>
              Frequently Paired with {product.name}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenSubscribe={(prod, sz) => {
                    setSelectedSize(sz || prod.size);
                    setIsSubscribeOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        product={product}
        defaultSize={selectedSize}
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />

      {/* Farm-to-Doorstep Purity Certificate Modal */}
      <PurityCertificateModal
        isOpen={isPurityModalOpen}
        onClose={() => setIsPurityModalOpen(false)}
        product={product}
      />
    </div>
  );
};
