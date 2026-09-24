import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/product/ProductCard';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { SubscriptionModal } from '../../components/subscription/SubscriptionModal';
import { 
  Sparkles, Calendar, ArrowRight, ShieldCheck, 
  Truck, RefreshCcw, CheckCircle, Heart, Star, Award,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    image: "/images/hero/hero-1.jpg",
    badge: "Next Doorstep Milk Run: Tomorrow 5:30 AM – 7:30 AM",
    badgeDotColor: "#5CD685",
    headline: "Farm-fresh pure milk at your door before sunrise.",
    subtext: "Ethically milked at 4:30 AM from pastured indigenous Gir cows and Murrah buffaloes. Bottled chilled in sanitized glass bottles and delivered quietly in your doorstep thermal pouch with zero single-use plastic.",
    primaryCta: { label: "Start Morning Milk Plan (10% Off)", action: 'subscribe' },
    secondaryCta: { label: "Browse Dairy Catalog", to: "/products" }
  },
  {
    id: 2,
    image: "/images/hero/hero-2.jpg",
    badge: "Zero Single-Use Plastic • 100% Recyclable Glass",
    badgeDotColor: "#5CD685",
    headline: "Delivered in sanitized glass bottles. ₹10 refund on return.",
    subtext: "Experience untampered dairy freshness in heavy-gauge European glass bottles. Leave empty bottles on your porch for instant wallet cashback on every morning collection.",
    primaryCta: { label: "Order Glass Bottle Milk", to: "/products?category=milk" },
    secondaryCta: { label: "How Glass Loop Works", to: "/subscriptions" }
  },
  {
    id: 3,
    image: "/images/hero/hero-3.jpg",
    badge: "Traditional Vedic Bilona Churn • 100% Pure A2 Gir Cow",
    badgeDotColor: "#E8C582",
    headline: "Handcrafted Vedic Bilona Ghee & Cultured Butter.",
    subtext: "Slow-churned bi-directionally from cultured whole milk curd in clay pots. Simmered on gentle wood flame in brass vats to preserve golden medicinal granulations and Ayurvedic nutrients.",
    primaryCta: { label: "Explore Cultured Ghee & Butter", to: "/products?category=ghee" },
    secondaryCta: { label: "View Purity Lab Reports", to: "/products" }
  },
  {
    id: 4,
    image: "/images/hero/hero-4.jpg",
    badge: "Milked & Prepared Today • Pure Whole Milk",
    badgeDotColor: "#5CD685",
    headline: "Melt-in-mouth Malai Paneer & Thick Set Farm Curd.",
    subtext: "Set naturally within 3 hours of morning milking without synthetic vinegars or preservatives. Rich in digestible protein, live lactobacillus probiotic cultures, and natural creamy sweetness.",
    primaryCta: { label: "Order Fresh Paneer & Dahi", to: "/products?category=curd" },
    secondaryCta: { label: "Explore Fresh Morning Batch", to: "/products" }
  }
];

export const HomePage = () => {
  const { products, categories, setSelectedCategory } = useProducts();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2500); // 2.5s auto-slide continuously
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [subscribingProduct, setSubscribingProduct] = useState(null);
  const [subscribeDefaultSize, setSubscribeDefaultSize] = useState('1 L');

  const handleOpenSubscribe = (product, size) => {
    setSubscribingProduct(product);
    setSubscribeDefaultSize(size || product.size);
  };

  const freshMorningBatch = products.filter(p => p.freshness === "Fresh Today" || p.freshness === "Milked 4:30 AM").slice(0, 4);
  const bestSellers = products.filter(p => p.rating >= 4.8).slice(0, 4);

  return (
    <div className="homepage-wrapper">
      {/* True Horizontal Carousel Slider (Auto-slides every 2.5 seconds) */}
      <section style={{ padding: '24px 0 36px 0' }}>
        <div className="container">
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(17, 41, 28, 0.28)',
              backgroundColor: '#11291C'
            }}
          >
            {/* Sliding Track */}
            <div
              style={{
                display: 'flex',
                width: `${HERO_SLIDES.length * 100}%`,
                transform: `translateX(-${(currentSlide * 100) / HERO_SLIDES.length}%)`,
                transition: 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {HERO_SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  style={{
                    width: `${100 / HERO_SLIDES.length}%`,
                    flexShrink: 0,
                    position: 'relative',
                    minHeight: '490px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '56px 64px 64px 64px',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Slide Background Image */}
                  <img
                    src={slide.image}
                    alt={slide.headline}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      zIndex: 1
                    }}
                  />

                  {/* Multi-stop cinematic vignette gradient */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, rgba(10, 24, 16, 0.97) 0%, rgba(15, 36, 25, 0.88) 46%, rgba(20, 48, 33, 0.48) 78%, rgba(24, 54, 38, 0.2) 100%)',
                      zIndex: 2
                    }}
                  />

                  {/* Slide Content */}
                  <div style={{ maxWidth: '720px', position: 'relative', zIndex: 3 }}>
                    {/* Badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(232, 197, 130, 0.18)',
                        border: '1px solid rgba(232, 197, 130, 0.42)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#E8C582',
                        padding: '6px 15px',
                        borderRadius: '20px',
                        fontSize: '0.84rem',
                        fontWeight: '600',
                        marginBottom: '22px'
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: slide.badgeDotColor,
                          boxShadow: `0 0 10px ${slide.badgeDotColor}`
                        }}
                      />
                      {slide.badge}
                    </div>

                    {/* Headline in Fraunces Serif */}
                    <h1
                      style={{
                        fontFamily: 'Fraunces, Georgia, serif',
                        fontSize: 'clamp(2.3rem, 5vw, 3.7rem)',
                        fontWeight: '600',
                        lineHeight: 1.15,
                        color: '#FAF7F2',
                        marginBottom: '18px',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      {slide.headline}
                    </h1>

                    {/* Subtext */}
                    <p
                      style={{
                        fontSize: '1.06rem',
                        color: '#D8E2D5',
                        lineHeight: 1.65,
                        maxWidth: '640px',
                        marginBottom: '32px'
                      }}
                    >
                      {slide.subtext}
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      {slide.primaryCta.action === 'subscribe' ? (
                        <button
                          onClick={() => {
                            const girMilk = products.find(p => p.id === 'milk-01') || products[0];
                            handleOpenSubscribe(girMilk, '1 L');
                          }}
                          className="btn btn-primary btn-lg"
                          style={{
                            backgroundColor: '#E8C582',
                            color: '#183626',
                            fontWeight: '700',
                            boxShadow: '0 6px 22px rgba(232, 197, 130, 0.38)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Calendar size={18} /> {slide.primaryCta.label}
                        </button>
                      ) : (
                        <Link
                          to={slide.primaryCta.to}
                          className="btn btn-primary btn-lg"
                          style={{
                            backgroundColor: '#E8C582',
                            color: '#183626',
                            fontWeight: '700',
                            boxShadow: '0 6px 22px rgba(232, 197, 130, 0.38)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {slide.primaryCta.label} <ArrowRight size={18} />
                        </Link>
                      )}

                      <Link
                        to={slide.secondaryCta.to}
                        className="btn btn-lg"
                        style={{
                          backgroundColor: 'rgba(24, 54, 38, 0.65)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1.5px solid rgba(232, 197, 130, 0.55)',
                          color: '#FAF7F2',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {slide.secondaryCta.label} <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Edge Navigation Arrow */}
            <button
              onClick={handlePrevSlide}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 5,
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(12, 28, 19, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(232, 197, 130, 0.35)',
                color: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
              }}
              title="Previous slide"
              aria-label="Previous slide"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(232, 197, 130, 0.3)';
                e.currentTarget.style.borderColor = '#E8C582';
                e.currentTarget.style.color = '#E8C582';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(12, 28, 19, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(232, 197, 130, 0.35)';
                e.currentTarget.style.color = '#FAF7F2';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Edge Navigation Arrow */}
            <button
              onClick={handleNextSlide}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 5,
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(12, 28, 19, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(232, 197, 130, 0.35)',
                color: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
              }}
              title="Next slide"
              aria-label="Next slide"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(232, 197, 130, 0.3)';
                e.currentTarget.style.borderColor = '#E8C582';
                e.currentTarget.style.color = '#E8C582';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(12, 28, 19, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(232, 197, 130, 0.35)';
                e.currentTarget.style.color = '#FAF7F2';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Centered Bottom Indicators */}
            <div
              style={{
                position: 'absolute',
                bottom: '22px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '16px',
                backgroundColor: 'rgba(10, 24, 16, 0.45)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: idx === currentSlide ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: idx === currentSlide ? '#E8C582' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Slide ${idx + 1}`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section (10 Categories) */}
      <section id="categories" style={{ padding: '30px 0 40px 0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Explore Farm Pantry Categories
              </h2>
              <p className="section-subtitle">
                Pure whole-milk artisanal dairy, fermented cultures, and traditional Indian preparations
              </p>
            </div>
            <Link to="/products" className="btn btn-ghost btn-sm" style={{ fontWeight: '600' }}>
              View All 40+ SKUs <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '18px'
          }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="card-artisan"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  navigate('/products');
                }}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E6DEC9'
                }}
              >
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.35s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(24, 54, 38, 0.85)',
                    color: '#FAF7F2',
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    {cat.badge}
                  </div>
                </div>

                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#183626', marginBottom: '4px' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#798C80', marginBottom: '12px', lineHeight: 1.4, flex: 1 }}>
                    {cat.tagline}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #F1EDE3',
                    paddingTop: '8px',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ color: '#8E5A17', fontWeight: '700' }}>{cat.count} Products</span>
                    <span style={{ color: '#183626', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Shop <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fresh Morning Batch Section */}
      <section style={{ padding: '30px 0', backgroundColor: '#FAF5EE', borderTop: '1px solid #EFE8D8', borderBottom: '1px solid #EFE8D8' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
                Milked at 4:30 AM Today
              </div>
              <h2 className="section-title">
                Freshly Stocked Morning Batch
              </h2>
              <p className="section-subtitle">
                Direct from pasture to chiller tanks at 3.8°C. Order before 10 PM for tomorrow morning drop.
              </p>
            </div>
            <Link to="/products" className="btn btn-outline-dark btn-sm">
              See All Batches <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            alignItems: 'start'
          }}>
            {freshMorningBatch.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuickView={setQuickViewProduct}
                onOpenSubscribe={handleOpenSubscribe}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Callout Banner */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{
            backgroundColor: '#FDF4E3',
            border: '2px solid #E8C582',
            borderRadius: '20px',
            padding: '36px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: '30px'
          }}>
            <div>
              <span style={{
                backgroundColor: '#8E5A17',
                color: '#FAF7F2',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '12px'
              }}>
                MilkMart Habit
              </span>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2rem', color: '#183626', marginBottom: '10px' }}>
                Wake up to glass-bottled purity every single morning.
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#55685C', lineHeight: 1.6, marginBottom: '20px' }}>
                Set it once and never run out of tea milk, set dahi, or breakfast butter. Pause deliveries anytime you go on vacation, skip tomorrow's run with 1-click, or adjust daily bottles flexibly.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/subscriptions" className="btn btn-primary">
                  <Calendar size={16} /> Manage Subscriptions
                </Link>
                <Link to="/products" className="btn btn-ghost">
                  Explore Products
                </Link>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px'
            }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E6DEC9' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#183626' }}>10% Off</div>
                <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Daily subscriber pricing on all milk variants</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E6DEC9' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#196D3D' }}>₹0 Fee</div>
                <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Free morning doorstep drop before 7:30 AM</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E6DEC9' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#A26D24' }}>₹10 Back</div>
                <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Wallet credit per empty glass bottle returned</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E6DEC9' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0E587B' }}>No Lock-In</div>
                <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Pause or cancel anytime with zero penalties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Farm Products */}
      <section style={{ padding: '30px 0 50px 0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Customer Favorites &amp; Heritage Ghee
              </h2>
              <p className="section-subtitle">
                Most cherished farm products rated 4.8★ and above by daily households
              </p>
            </div>
            <Link to="/products" className="btn btn-outline-dark btn-sm">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            alignItems: 'start'
          }}>
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuickView={setQuickViewProduct}
                onOpenSubscribe={handleOpenSubscribe}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSubscribe={handleOpenSubscribe}
      />

      <SubscriptionModal
        product={subscribingProduct}
        defaultSize={subscribeDefaultSize}
        isOpen={!!subscribingProduct}
        onClose={() => setSubscribingProduct(null)}
      />
    </div>
  );
};
