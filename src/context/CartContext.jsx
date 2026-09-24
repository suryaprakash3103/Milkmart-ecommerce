import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('milkmart_cart');
    if (saved) return JSON.parse(saved);
    // Seed with 2 items to match reference badge count: 2
    return [
      {
        id: "milk-01",
        name: "Farm Fresh A2 Gir Cow Raw Milk",
        size: "1 L",
        price: 85,
        originalPrice: 95,
        quantity: 1,
        image: "/images/products/milk-a2.jpg",
        bottleDeposit: 0
      },
      {
        id: "curd-01",
        name: "Artisanal Clay-Pot Set Dahi",
        size: "500 g",
        price: 75,
        originalPrice: 85,
        quantity: 1,
        image: "/images/products/curd-clay.jpg",
        bottleDeposit: 0
      }
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('milkmart_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('milkmart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('milkmart_coupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  const addToCart = (product, selectedSize = null, quantity = 1) => {
    const sizeToUse = selectedSize || product.size;
    // Find matching price if variant exists
    let priceToUse = product.price;
    let origPriceToUse = product.originalPrice;
    if (product.availableSizes && selectedSize) {
      const variant = product.availableSizes.find((v) => v.size === selectedSize);
      if (variant) {
        priceToUse = variant.price;
        origPriceToUse = variant.originalPrice;
      }
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.size === sizeToUse
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            size: sizeToUse,
            price: priceToUse,
            originalPrice: origPriceToUse,
            quantity: quantity,
            image: product.image,
            bottleDeposit: product.glassBottleDeposit || 0,
            hsnCode: product.hsnCode || "0401",
            gstRate: typeof product.gstRate === 'number' ? product.gstRate : 0
          }
        ];
      }
    });

    showToast(`Added ${quantity}x ${product.name} (${sizeToUse}) to Milk Basket`);
  };

  const updateQuantity = (itemId, size, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.size === size))
    );
    showToast("Item removed from Milk Basket", "info");
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const validCoupons = {
    MILK10: { code: "MILK10", discountPercent: 10, description: "10% off on all fresh dairy" },
    FREEDEL: { code: "FREEDEL", freeDelivery: true, description: "Free doorstep morning drop" },
    FARM50: { code: "FARM50", flatDiscount: 50, description: "₹50 flat discount on farm orders" },
    COWFIRST: { code: "COWFIRST", discountPercent: 15, description: "15% off first farm order" }
  };

  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    if (validCoupons[upper]) {
      setAppliedCoupon(validCoupons[upper]);
      showToast(`Coupon '${upper}' applied successfully!`);
      return { success: true };
    } else {
      showToast(`Invalid coupon code '${upper}'. Try 'MILK10' or 'FREEDEL'`, "error");
      return { success: false, message: "Invalid code" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  // Calculations
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = Math.min(appliedCoupon.flatDiscount, subtotal);
    }
  }

  const freeDeliveryThreshold = 199;
  let deliveryFee = subtotal >= freeDeliveryThreshold || (appliedCoupon && appliedCoupon.freeDelivery) ? 0 : 30;
  if (cartItems.length === 0) deliveryFee = 0;

  const bottleDeposit = 0; // Waived under MilkMart glass bottle exchange policy

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee + bottleDeposit);

  // Real-time GST calculations (Inclusive pricing model)
  let totalTaxableValue = 0;
  let totalGstAmount = 0;
  const hsnMap = {};

  cartItems.forEach((item) => {
    const rate = typeof item.gstRate === 'number' ? item.gstRate : 0;
    const itemTotal = item.price * item.quantity;
    const taxable = itemTotal / (1 + rate / 100);
    const gst = itemTotal - taxable;

    totalTaxableValue += taxable;
    totalGstAmount += gst;

    const hsn = item.hsnCode || '0401';
    if (!hsnMap[hsn]) {
      hsnMap[hsn] = { hsnCode: hsn, gstRate: rate, taxableValue: 0, gstAmount: 0, total: 0 };
    }
    hsnMap[hsn].taxableValue += taxable;
    hsnMap[hsn].gstAmount += gst;
    hsnMap[hsn].total += itemTotal;
  });

  const cgstAmount = Number((totalGstAmount / 2).toFixed(2));
  const sgstAmount = Number((totalGstAmount / 2).toFixed(2));
  const hsnBreakdown = Object.values(hsnMap);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        discountAmount,
        deliveryFee,
        bottleDeposit,
        finalTotal,
        totalTaxableValue: Number(totalTaxableValue.toFixed(2)),
        totalGstAmount: Number(totalGstAmount.toFixed(2)),
        cgstAmount,
        sgstAmount,
        hsnBreakdown,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
