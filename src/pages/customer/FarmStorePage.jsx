import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sellerService } from '../../services/sellerService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/product/ProductCard';
import { 
  ShieldCheck, MapPin, Phone, Mail, Award, 
  Sparkles, CheckCircle2, Heart, ShoppingBag, 
  ExternalLink, Calendar, ChevronRight, RefreshCw, 
  Layers, ArrowLeft 
} from 'lucide-react';

export const FarmStorePage = () => {
  const { farmId } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [farm, setFarm] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const loadFarmData = async () => {
      setLoading(true);
      try {
        const farmData = await sellerService.getFarmById(farmId);
        setFarm(farmData);

        // Fetch products matching this farm
        const allProducts = await sellerService.getProducts();
        const farmProducts = allProducts.filter(p => 
          p.farmId === farmId || 
          p.brand?.toLowerCase() === farmData?.name?.toLowerCase() ||
          p.farmName?.toLowerCase() === farmData?.name?.toLowerCase()
        );
        // Only show approved products on public customer storefront
        const approved = farmProducts.filter(p => p.approvalStatus !== 'draft' && p.approvalStatus !== 'rejected' && p.approvalStatus !== 'inactive');
        setProducts(approved.length > 0 ? approved : allProducts.slice(0, 4));
      } catch (err) {
        console.error('Error fetching farm storefront:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFarmData();
  }, [farmId]);

  if (loading || !farm) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#FAF7F2', minHeight: '60vh' }}>
        <RefreshCw className="animate-spin" size={36} color="#183626" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: '#55685C' }}>Loading farm fresh storefront...</p>
      </div>
    );
  }

  const filtered = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Farm Banner Hero */}
      <div style={{
        position: 'relative',
        height: '320px',
        backgroundImage: `url(${farm.coverImage || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(19, 42, 30, 0.4) 0%, rgba(19, 42, 30, 0.85) 100%)'
        }} />

        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 20px' }}>
          {/* Breadcrumb */}
          <div>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FAF7F2',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '6px 14px',
                borderRadius: '20px',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: '600',
                backdropFilter: 'blur(4px)'
              }}
            >
              <ArrowLeft size={14} /> Back to All Milk &amp; Dairy
            </Link>
          </div>

          {/* Farm Header Info */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={farm.logo || 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=400&q=80'}
              alt={farm.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '4px solid #FAF7F2',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                backgroundColor: '#FFFFFF'
              }}
            />

            <div style={{ color: '#FAF7F2', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '2.2rem', fontFamily: 'Fraunces, Georgia, serif', color: '#FAF7F2' }}>
                  {farm.name}
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#E8F5E9',
                  color: '#2E7D32',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}>
                  <ShieldCheck size={14} /> Verified Partner Farm
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(232, 197, 130, 0.25)',
                  color: '#E8C582',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}>
                  {farm.farmType || 'Organic & Sustainable'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.9rem', color: '#E8E2D5', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} color="#E8C582" /> {farm.district}, {farm.state}
                </span>
                <span>•</span>
                <span>Owner: <strong>{farm.ownerName}</strong></span>
                <span>•</span>
                <span>FSSAI Lic: <strong>#{farm.fssaiLicense}</strong></span>
                <span>•</span>
                <span>Cattle: <strong>{farm.cattleCount || 45} Indigenous Cows</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container" style={{ marginTop: '30px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          
          {/* About Farm Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            gridColumn: 'span 2',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
          }}>
            <h2 style={{ fontSize: '1.25rem', color: '#183626', margin: '0 0 12px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
              About the Farm &amp; Milking Heritage
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#55685C', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              {farm.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(farm.productsProduced || ['Fresh A2 Milk', 'Curd', 'Bilona Ghee']).map((p, i) => (
                <span key={i} style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E8E2D5',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#183626'
                }}>
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Procurement Trust Badge */}
          <div style={{
            backgroundColor: '#183626',
            borderRadius: '16px',
            border: '1px solid #132A1E',
            padding: '24px',
            color: '#FAF7F2',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.15)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#E8C582', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#E8C582" /> Farm-to-Door Promise
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#D5DFD8', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Every bottle harvested at this farm is tested on 24 purity parameters before cold-chain dispatch directly to your doorstep.
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', fontSize: '0.82rem', color: '#FAF7F2' }}>
              <div style={{ marginBottom: '6px' }}>✓ Chilled to 3°C within 45 mins</div>
              <div style={{ marginBottom: '6px' }}>✓ Sanitized returnable glass packaging</div>
              <div>✓ Zero preservatives or synthetic hormones</div>
            </div>
          </div>

        </div>

        {/* Farm Products Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.65rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
                Products from {farm.name}
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#55685C', margin: '4px 0 0 0' }}>
                Delivered fresh every morning between 6:00 AM - 7:30 AM in sterilized glass bottles.
              </p>
            </div>

            {/* Category filter pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'milk', 'curd', 'ghee', 'paneer'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: activeCategory === cat ? '1px solid #183626' : '1px solid #E8E2D5',
                    backgroundColor: activeCategory === cat ? '#183626' : '#FFFFFF',
                    color: activeCategory === cat ? '#FAF7F2' : '#55685C',
                    fontSize: '0.8rem',
                    fontWeight: activeCategory === cat ? '700' : '500',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
