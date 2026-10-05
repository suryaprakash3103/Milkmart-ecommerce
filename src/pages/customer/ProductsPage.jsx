import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/product/ProductCard';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { SubscriptionModal } from '../../components/subscription/SubscriptionModal';
import { Filter, SlidersHorizontal, RotateCcw, Search, Sparkles } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    products,
    categories,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFatContent,
    setSelectedFatContent,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    setPriceRange,
    ratingFilter,
    setRatingFilter,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy
  } = useProducts();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [subscribingProduct, setSubscribingProduct] = useState(null);
  const [subscribeDefaultSize, setSubscribeDefaultSize] = useState('1 L');

  // Handle URL query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    const filterParam = searchParams.get('filter');
    if (filterParam === 'offers') {
      setSortBy('popular');
    }
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams, setSelectedCategory, setSearchQuery, setSortBy]);

  const handleOpenSubscribe = (product, size) => {
    setSubscribingProduct(product);
    setSubscribeDefaultSize(size || product.size);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFatContent('all');
    setSelectedBrand('all');
    setPriceRange(3000);
    setRatingFilter(0);
    setInStockOnly(false);
    setSortBy('popular');
  };

  const brands = [
    'Green Valley Dairy Farm',
    'Sri Lakshmi Organic Farm',
    'Gir Amrit Organic Gaushala',
    'MilkMart Pure Farm',
    'Bilona Traditions'
  ];

  return (
    <div style={{ padding: '30px 0 60px 0' }}>
      <div className="container">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.82rem', color: '#798C80', marginBottom: '6px' }}>
            Home &gt; Dairy Catalog &gt; <strong style={{ color: '#183626' }}>All Products</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
                Artisanal Dairy Catalog
              </h1>
              <p style={{ fontSize: '0.92rem', color: '#55685C', margin: '4px 0 0 0' }}>
                Showing <strong>{filteredProducts.length}</strong> farm-fresh dairy products
              </p>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.86rem', color: '#55685C', fontWeight: '600' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E6DEC9',
                  color: '#183626',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating (Highest)</option>
                <option value="fresh">Freshness / Milking Batch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout (Sidebar + Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px' }} className="catalog-grid-layout">
          {/* Filter Sidebar */}
          <aside style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E6DEC9',
            borderRadius: '16px',
            padding: '20px',
            height: 'fit-content'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1EDE3', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#183626' }}>
                <SlidersHorizontal size={16} /> Filters
              </div>
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  color: '#8E5A17',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#183626', marginBottom: '10px' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                  />
                  <span>All Categories ({products.length})</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fat Content Filter */}
            <div style={{ marginBottom: '22px', borderTop: '1px solid #F1EDE3', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#183626', marginBottom: '10px' }}>Fat Content</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'all', label: 'All Fat Ratios' },
                  { id: 'low', label: 'Low Fat / Toned (1.5% - 3.2%)' },
                  { id: 'full', label: 'Full Cream & Pure Desi (4.8% - 7.2%)' }
                ].map((item) => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="fat"
                      checked={selectedFatContent === item.id}
                      onChange={() => setSelectedFatContent(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand / Farm Filter */}
            <div style={{ marginBottom: '22px', borderTop: '1px solid #F1EDE3', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#183626', marginBottom: '10px' }}>Partner Dairy Farms</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === 'all'}
                    onChange={() => setSelectedBrand('all')}
                  />
                  <span>All Verified Farms</span>
                </label>
                {brands.map((b) => (
                  <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b}
                      onChange={() => setSelectedBrand(b)}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div style={{ marginBottom: '22px', borderTop: '1px solid #F1EDE3', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#183626', margin: 0 }}>Max Price</h4>
                <span style={{ fontWeight: '700', color: '#A26D24', fontSize: '0.9rem' }}>₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="30"
                max="3000"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#183626' }}
              />
            </div>

            {/* Availability Toggle */}
            <div style={{ borderTop: '1px solid #F1EDE3', paddingTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span style={{ fontWeight: '600', color: '#183626' }}>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            {filteredProducts.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E6DEC9',
                padding: '60px 20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌾</div>
                <h3 style={{ fontSize: '1.4rem', color: '#183626', marginBottom: '8px' }}>
                  No dairy products match your filters
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#798C80', marginBottom: '20px' }}>
                  Try relaxing your price slider, clearing the search query, or selecting another category.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '18px',
                alignItems: 'start'
              }}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenQuickView={setQuickViewProduct}
                    onOpenSubscribe={handleOpenSubscribe}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View & Subscribe Modals */}
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
