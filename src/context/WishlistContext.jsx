import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('milkmart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('milkmart_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed '${product.name}' from Wishlist`, "info");
    } else {
      setWishlistItems((prev) => [...prev, product]);
      showToast(`Saved '${product.name}' to Wishlist`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item removed from Wishlist", "info");
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
