import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialSubscriptions } from '../data/mockSubscriptions';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { showToast } = useToast();

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('milkmart_subscriptions');
    return saved ? JSON.parse(saved) : initialSubscriptions;
  });

  const refreshSubscriptions = useCallback(async () => {
    try {
      const res = await api.subscriptions.getAll();
      if (res?.success && Array.isArray(res.subscriptions) && res.subscriptions.length > 0) {
        setSubscriptions(res.subscriptions);
        localStorage.setItem('milkmart_subscriptions', JSON.stringify(res.subscriptions));
      }
    } catch (e) {
      console.warn("Could not sync subscriptions from backend, using local store:", e.message);
    }
  }, []);

  useEffect(() => {
    refreshSubscriptions();
  }, [refreshSubscriptions]);

  useEffect(() => {
    localStorage.setItem('milkmart_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = async ({
    product,
    size = "1 L",
    quantity = 1,
    frequency = "Daily",
    timeSlot = "Morning Run (5:30 AM – 7:30 AM)",
    deliveryAddress,
    instructions = "Leave inside insulated pouch",
    customSchedule = null
  }) => {
    try {
      const res = await api.subscriptions.create({
        product,
        size,
        quantity,
        frequency,
        timeSlot,
        deliveryAddress,
        instructions,
        customSchedule
      });
      if (res?.success && res.subscription) {
        setSubscriptions(prev => [res.subscription, ...prev]);
        showToast(`Subscribed to '${product.name}' (${frequency})! Saved 10% daily.`);
        return res.subscription;
      }
    } catch (e) {
      console.warn("Backend addSubscription failed, creating locally:", e.message);
    }

    // Local fallback
    const subNum = Math.floor(1000 + Math.random() * 9000);
    const id = `SUB-${subNum}`;
    
    let unitPrice = product.price;
    if (product.availableSizes) {
      const variant = product.availableSizes.find(v => v.size === size);
      if (variant) unitPrice = variant.price;
    }
    const discountedPrice = Number((unitPrice * 0.9).toFixed(1));

    const newSub = {
      id,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      image: product.image,
      size,
      quantity,
      frequency,
      pricePerDay: discountedPrice * quantity,
      originalPricePerDay: unitPrice * quantity,
      status: "Active",
      nextDeliveryDate: "Tomorrow (5:30 AM)",
      timeSlot,
      deliveryAddress: typeof deliveryAddress === 'string' ? deliveryAddress : `${deliveryAddress.house}, ${deliveryAddress.street}, ${deliveryAddress.city}`,
      startDate: new Date().toISOString().split('T')[0],
      totalDeliveriesDone: 0,
      bottlesPendingReturn: 0,
      customSchedule,
      doorstepInstructions: instructions
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    showToast(`Subscribed to '${product.name}' (${frequency})! Saved 10% daily.`);
    return newSub;
  };

  const pauseSubscription = async (subId) => {
    try {
      await api.subscriptions.pause(subId);
    } catch (e) {
      console.warn("Backend pause failed, updating locally:", e.message);
    }

    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: "Paused" } : s))
    );
    showToast("Subscription paused. You can resume anytime without penalty.", "info");
  };

  const resumeSubscription = async (subId) => {
    try {
      await api.subscriptions.resume(subId);
    } catch (e) {
      console.warn("Backend resume failed, updating locally:", e.message);
    }

    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: "Active" } : s))
    );
    showToast("Subscription resumed! Morning deliveries will continue tomorrow.");
  };

  const skipNextDelivery = async (subId) => {
    try {
      await api.subscriptions.skip(subId);
    } catch (e) {
      console.warn("Backend skip failed, updating locally:", e.message);
    }

    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subId
          ? {
              ...s,
              nextDeliveryDate: "Day after tomorrow (Skipped tomorrow's run)"
            }
          : s
      )
    );
    showToast("Tomorrow's delivery skipped! Your wallet won't be charged.");
  };

  const modifyQuantity = async (subId, newQuantity) => {
    const qty = Math.max(1, Number(newQuantity));
    try {
      await api.subscriptions.updateQuantity(subId, qty);
    } catch (e) {
      console.warn("Backend updateQuantity failed, updating locally:", e.message);
    }

    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const singleUnit = s.pricePerDay / s.quantity;
          const singleOrig = s.originalPricePerDay / s.quantity;
          return {
            ...s,
            quantity: qty,
            pricePerDay: Number((singleUnit * qty).toFixed(1)),
            originalPricePerDay: Number((singleOrig * qty).toFixed(1))
          };
        }
        return s;
      })
    );
    showToast(`Updated to ${qty} unit(s) per delivery!`);
  };

  const cancelSubscription = async (subId) => {
    try {
      await api.subscriptions.cancel(subId);
    } catch (e) {
      console.warn("Backend cancel failed, updating locally:", e.message);
    }

    setSubscriptions((prev) => prev.filter((s) => s.id !== subId));
    showToast("Subscription cancelled. We hope to see you back soon!", "info");
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        refreshSubscriptions,
        addSubscription,
        pauseSubscription,
        resumeSubscription,
        skipNextDelivery,
        modifyQuantity,
        cancelSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within SubscriptionProvider');
  }
  return context;
};

export const useSubscription = useSubscriptions;
