import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSubscriptions } from '../data/mockSubscriptions';
import { useToast } from './ToastContext';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { showToast } = useToast();

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('milkmart_subscriptions');
    return saved ? JSON.parse(saved) : initialSubscriptions;
  });

  useEffect(() => {
    localStorage.setItem('milkmart_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = ({
    product,
    size = "1 L",
    quantity = 1,
    frequency = "Daily",
    timeSlot = "Morning Run (5:30 AM – 7:30 AM)",
    deliveryAddress,
    instructions = "Leave inside insulated pouch",
    customSchedule = null
  }) => {
    const subNum = Math.floor(1000 + Math.random() * 9000);
    const id = `SUB-${subNum}`;
    
    // Find variant price
    let unitPrice = product.price;
    if (product.availableSizes) {
      const variant = product.availableSizes.find(v => v.size === size);
      if (variant) unitPrice = variant.price;
    }
    const discountedPrice = Number((unitPrice * 0.9).toFixed(1)); // 10% off subscription saving

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

  const pauseSubscription = (subId) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: "Paused" } : s))
    );
    showToast("Subscription paused. You can resume anytime without penalty.", "info");
  };

  const resumeSubscription = (subId) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: "Active" } : s))
    );
    showToast("Subscription resumed! Morning deliveries will continue tomorrow.");
  };

  const skipNextDelivery = (subId) => {
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

  const modifyQuantity = (subId, newQuantity) => {
    const qty = Math.max(1, Number(newQuantity));
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
    showToast(`Updated daily quantity to ${qty}`);
  };

  const modifyFrequency = (subId, newFrequency) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, frequency: newFrequency } : s))
    );
    showToast(`Frequency updated to: ${newFrequency}`);
  };

  const cancelSubscription = (subId) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: "Cancelled" } : s))
    );
    showToast("Subscription cancelled.", "warning");
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        pauseSubscription,
        resumeSubscription,
        skipNextDelivery,
        modifyQuantity,
        modifyFrequency,
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
