import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';
import { 
  Search, Heart, ShoppingBag, User, Menu, X, 
  Wallet, ShieldCheck, Sparkles, LogOut, MapPin, 
  Package, Calendar, ChevronRight 
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { WalletIcon } from './WalletIcon';

export const Navbar = ({ onOpenWallet, onOpenAuth }) => {
  const { currentUser, switchRole } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { searchQuery, setSearchQuery, products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchFocused(false);
    navigate('/products');
  };

  const handleProductSelect = (id) => {
    setIsSearchFocused(false);
    navigate(`/products/${id}`);
  };

  // Autocomplete suggestions
  const searchSuggestions = searchQuery.trim().length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/products" },
    { name: "Categories", path: "/#categories" },
    { name: "Morning Subscriptions", path: "/subscriptions", highlight: true },
    { name: "Offers & Bundles", path: "/products?filter=offers" },
    { name: "Track Order", path: "/orders" }
  ];

  return (
    <header style={{
      backgroundColor: '#FAF7F2',
      borderBottom: '1px solid #E6DEC9',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      boxShadow: '0 2px 8px rgba(24, 54, 38, 0.04)'
    }}>
      {/* Primary Brand & Actions Row */}
      <div className="container" style={{
        paddingTop: '12px',
        paddingBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none' }} title="MilkMart - Pure Farm Fresh Milk">
          <BrandLogo variant="full" size="md" />
        </Link>

        {/* Search Bar with live autocomplete */}
        <div ref={searchRef} style={{ flex: 1, maxWidth: '460px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#798C80'
              }}
            />
            <input
              type="text"
              placeholder="Search Gir cow milk, bilona ghee, paneer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 40px',
                borderRadius: '30px',
                border: '1.5px solid #E6DEC9',
                backgroundColor: '#FFFFFF',
                fontSize: '0.9rem',
                color: '#183626'
              }}
            />
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '105%',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E6DEC9',
              boxShadow: '0 12px 30px rgba(24, 54, 38, 0.15)',
              overflow: 'hidden',
              zIndex: 100
            }}>
              <div style={{ padding: '8px 14px', fontSize: '0.75rem', fontWeight: '600', color: '#798C80', borderBottom: '1px solid #F1EDE3' }}>
                FARM PRODUCTS
              </div>
              {searchSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductSelect(item.id)}
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                    borderBottom: '1px solid #F7F4EC'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF7F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#798C80' }}>{item.brand} • {item.size}</div>
                  </div>
                  <div style={{ fontWeight: '700', color: '#A26D24', fontSize: '0.9rem' }}>₹{item.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Unique & Professional Wallet Button */}
          <button
            onClick={onOpenWallet}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FDF6E9',
              border: '1px solid rgba(162, 109, 36, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 2px 6px rgba(142, 90, 23, 0.12)',
              position: 'relative'
            }}
            title={`MilkMart Wallet: ₹${currentUser.walletBalance} (Click to manage funds & bottle return credits)`}
            aria-label="Open Wallet"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.backgroundColor = '#F5E6CC';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(142, 90, 23, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundColor = '#FDF6E9';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(142, 90, 23, 0.12)';
            }}
          >
            <WalletIcon size={22} />
          </button>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6DEC9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: '#183626'
            }}
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#A26D24',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Milk Basket Button (Cart) */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#183626',
              color: '#FAF7F2',
              padding: '9px 18px',
              borderRadius: '24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: '1px solid #183626',
              boxShadow: '0 4px 12px rgba(24, 54, 38, 0.2)'
            }}
          >
            <ShoppingBag size={18} />
            <span>Milk Basket</span>
            <span style={{
              backgroundColor: '#E8C582',
              color: '#183626',
              borderRadius: '12px',
              padding: '1px 8px',
              fontSize: '0.78rem',
              fontWeight: '800'
            }}>
              {itemCount}
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E6DEC9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#183626'
              }}
              title="Profile & Settings"
            >
              <User size={19} />
            </button>

            {isProfileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '240px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E6DEC9',
                boxShadow: '0 12px 32px rgba(24, 54, 38, 0.15)',
                padding: '8px 0',
                zIndex: 100,
                animation: 'slideUp 0.2s ease-out'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1EDE3' }}>
                  <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.92rem' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#798C80' }}>{currentUser.phone}</div>
                  <div style={{
                    marginTop: '6px',
                    fontSize: '0.75rem',
                    color: '#8E5A17',
                    background: '#FDF4E3',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'inline-block',
                    fontWeight: '600'
                  }}>
                    Wallet: ₹{currentUser.walletBalance}
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#183626' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF7F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <User size={16} /> My Account
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setIsProfileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#183626' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF7F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Package size={16} /> Orders &amp; Invoices
                </Link>

                <Link
                  to="/subscriptions"
                  onClick={() => setIsProfileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#183626' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF7F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Calendar size={16} /> Milk Subscriptions
                </Link>

                <Link
                  to="/addresses"
                  onClick={() => setIsProfileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#183626' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF7F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <MapPin size={16} /> Saved Addresses
                </Link>

                <div style={{ borderTop: '1px solid #F1EDE3', margin: '6px 0' }} />

                <div
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    switchRole('admin');
                    navigate('/admin');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 16px', fontSize: '0.84rem', color: '#0E587B', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EBF4F9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <ShieldCheck size={16} /> Admin Operations Hub
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              padding: '6px',
              color: '#183626'
            }}
            className="mobile-nav-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Secondary Navigation Row (Categories & Quick Links) */}
      <nav style={{
        backgroundColor: '#FAF5EE',
        borderTop: '1px solid #EFE8D8',
        padding: '8px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', whiteSpace: 'nowrap' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: link.highlight ? '700' : '600',
                    color: link.highlight ? '#A26D24' : (isActive ? '#183626' : '#55685C'),
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    borderBottom: isActive ? '2px solid #183626' : '2px solid transparent',
                    transition: 'color 0.15s'
                  }}
                >
                  {link.highlight && <Sparkles size={14} />}
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#196D3D', fontWeight: '600' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
              Next Sunrise Run: 5:30 AM
            </span>
            <span style={{ color: '#E6DEC9' }}>|</span>
            <span style={{ color: '#8E5A17' }}>
              Free Glass Bottle Drop &amp; Return
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          backgroundColor: '#FAF7F2',
          borderBottom: '2px solid #E6DEC9',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#183626',
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #EFE8D8'
              }}
            >
              <span>{link.name}</span>
              <ChevronRight size={16} color="#798C80" />
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenWallet(); }}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              Wallet (₹{currentUser.walletBalance})
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }}
              className="btn btn-dark btn-sm"
              style={{ flex: 1 }}
            >
              Milk Basket ({itemCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
