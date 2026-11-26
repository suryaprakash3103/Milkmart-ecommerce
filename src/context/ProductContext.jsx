import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';
import { initialReviews } from '../data/mockReviews';
import { initialChillerTelemetry } from '../data/mockChillerData';
import { dairyCategories } from '../data/categories';
import { api } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('milkmart_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('milkmart_categories');
    return saved ? JSON.parse(saved) : dairyCategories;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('milkmart_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [chillerTelemetry, setChillerTelemetry] = useState(() => {
    const saved = localStorage.getItem('milkmart_telemetry');
    return saved ? JSON.parse(saved) : initialChillerTelemetry;
  });

  // Load from backend API on mount
  useEffect(() => {
    let mounted = true;
    const fetchCatalog = async () => {
      try {
        const [serverProducts, serverReviews] = await Promise.all([
          api.products.getAll(),
          api.reviews.getAll()
        ]);
        if (mounted) {
          if (serverProducts && serverProducts.length > 0) {
            setProducts(serverProducts);
          }
          if (serverReviews && serverReviews.length > 0) {
            setReviews(serverReviews);
          }
        }
      } catch (err) {
        console.warn('API catalog fetch fallback to local cache:', err.message);
      }
    };
    fetchCatalog();
    return () => { mounted = false; };
  }, []);

  // Filter state for shop
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFatContent, setSelectedFatContent] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState(3000);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    localStorage.setItem('milkmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail?.key === 'milkmart_products' && e.detail.value) {
        setProducts(e.detail.value);
      }
    };
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, []);

  useEffect(() => {
    localStorage.setItem('milkmart_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('milkmart_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('milkmart_telemetry', JSON.stringify(chillerTelemetry));
  }, [chillerTelemetry]);

  // Product CRUD (Admin / Seller)
  const addProduct = async (newProduct) => {
    try {
      const created = await api.products.create(newProduct);
      if (created) {
        setProducts(prev => [created, ...prev]);
        return created;
      }
    } catch (e) {
      console.warn('Backend addProduct fallback:', e.message);
    }

    const id = 'prod-' + Date.now();
    const product = {
      ...newProduct,
      id,
      rating: 5.0,
      reviewCount: 1,
      freshness: newProduct.freshness || "Fresh Today",
      coldChain: newProduct.coldChain || "Chilled at 3.8°C"
    };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      await api.products.update(id, updatedFields);
    } catch (e) {
      console.warn('Backend updateProduct fallback:', e.message);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = async (id) => {
    try {
      await api.products.delete(id);
    } catch (e) {
      console.warn('Backend deleteProduct fallback:', e.message);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleAvailability = async (id) => {
    const current = products.find(p => p.id === id);
    const nextState = current?.availability === 'In Stock' ? 'Out of Stock' : 'In Stock';
    const nextStock = nextState === 'In Stock' ? 25 : 0;

    try {
      await api.products.adjustStock(id, { action: 'set', exactValue: nextStock });
    } catch (e) {
      console.warn('Backend adjustStock fallback:', e.message);
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            availability: nextState,
            stock: nextStock
          };
        }
        return p;
      })
    );
  };

  const updateChillerTemp = (vatId, newTemp) => {
    setChillerTelemetry((prev) => ({
      ...prev,
      bulkMilkCoolerVats: prev.bulkMilkCoolerVats.map((v) =>
        v.id === vatId ? { ...v, temp: newTemp } : v
      )
    }));
  };

  // Add review
  const addReview = async (reviewData) => {
    try {
      await api.reviews.create(reviewData);
    } catch (e) {
      console.warn('Backend review create fallback:', e.message);
    }

    const newRev = {
      id: 'rev-' + Date.now(),
      ...reviewData,
      date: 'Just now',
      verified: true,
      helpfulCount: 0
    };
    setReviews((prev) => [newRev, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const newCount = p.reviewCount + 1;
          const newRating = Number(((p.rating * p.reviewCount + reviewData.rating) / newCount).toFixed(1));
          return { ...p, rating: newRating, reviewCount: newCount };
        }
        return p;
      })
    );
  };

  // Helper to find substitute
  const getSubstituteProduct = (product) => {
    if (!product) return null;
    if (product.suggestedSubstituteId) {
      return products.find((p) => p.id === product.suggestedSubstituteId && p.availability === 'In Stock') || null;
    }
    return products.find((p) => p.category === product.category && p.id !== product.id && p.availability === 'In Stock') || null;
  };

  // Filtered products calculation
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || 
      item.brand === selectedBrand || 
      item.farmName === selectedBrand ||
      (selectedBrand.includes('Green Valley') && (item.brand?.includes('Green Valley') || item.brand?.includes('MilkMart Pure Farm'))) ||
      (selectedBrand.includes('Lakshmi') && item.brand?.includes('Lakshmi')) ||
      (selectedBrand.includes('Gir') && item.brand?.includes('Gir'));

    const matchesPrice = item.price <= priceRange;
    const matchesRating = item.rating >= ratingFilter;
    const matchesStock = !inStockOnly || item.availability === 'In Stock';
    const isApproved = !item.approvalStatus || item.approvalStatus === 'approved';

    const matchesFat = selectedFatContent === 'all' ||
      (selectedFatContent === 'low' && (item.fatContent?.toLowerCase().includes('low') || item.fatContent?.includes('1.') || item.fatContent?.includes('3.'))) ||
      (selectedFatContent === 'full' && (item.fatContent?.toLowerCase().includes('whole') || item.fatContent?.toLowerCase().includes('full') || item.fatContent?.includes('7.') || item.fatContent?.includes('4.8')));

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock && matchesFat && isApproved;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fresh') return a.freshness.localeCompare(b.freshness);
    return b.reviewCount - a.reviewCount;
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        reviews,
        chillerTelemetry,
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
        setSortBy,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleAvailability,
        updateChillerTemp,
        addReview,
        getSubstituteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
