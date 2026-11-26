import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialOrders } from '../data/mockOrders';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { addWalletBalance, deductWalletBalance } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('milkmart_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Load from backend API on mount
  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const serverOrders = await api.orders.getAll();
        if (mounted && serverOrders && serverOrders.length > 0) {
          setOrders(serverOrders);
        }
      } catch (err) {
        console.warn('API orders fetch fallback to local cache:', err.message);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('milkmart_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = async ({
    items,
    deliveryAddress,
    timeSlot,
    paymentMethod,
    subtotal,
    discount,
    deliveryFee,
    bottleDeposit,
    total,
    instructions = ""
  }) => {
    // If paying by MilkMart Wallet, check balance
    if (paymentMethod === 'MilkMart Wallet') {
      const ok = deductWalletBalance(total);
      if (!ok) {
        showToast("Insufficient MilkMart Wallet balance!", "error");
        return { success: false, message: "Insufficient balance" };
      }
    }

    try {
      const res = await api.orders.create({
        items,
        deliveryAddress,
        timeSlot,
        paymentMethod,
        subtotal,
        discount,
        deliveryFee,
        bottleDeposit,
        total,
        instructions
      });
      if (res?.success && res.order) {
        setOrders(prev => [res.order, ...prev]);
        showToast(`Order #${res.orderId} placed successfully! Doorstep delivery tomorrow.`);
        return { success: true, orderId: res.orderId, order: res.order };
      }
    } catch (e) {
      console.warn('Backend order placement fallback to local:', e.message);
    }

    // Local fallback
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MM-${orderNum}`;
    const today = new Date().toISOString().split('T')[0];

    const newOrder = {
      id: orderId,
      date: today,
      status: "Confirmed",
      estimatedDelivery: "Tomorrow Morning (5:30 AM – 7:30 AM)",
      timeSlot: timeSlot || "Morning Run: 5:30 AM – 7:30 AM",
      items: items.map((i) => ({ ...i })),
      deliveryAddress: {
        ...deliveryAddress,
        dropInstruction: instructions || deliveryAddress?.instructions || "Leave in doorstep thermal bag"
      },
      paymentMethod,
      paymentStatus: "Paid",
      subtotal,
      discount,
      deliveryFee,
      bottleDeposit,
      total,
      deliveryPartner: {
        name: "Ramesh Kumar",
        phone: "+91 98765 43210",
        route: "Route 4B - Morning Doorstep Fleet",
        vehicle: "KA01-EK-4501 (Chilled EV)"
      },
      timeline: [
        { title: "Order Placed", time: "Just now", completed: true },
        { title: "Confirmed & Batch Assigned", time: "Just now", completed: true, active: true },
        { title: "Milked & Chilled at 3.8°C", time: "Tomorrow 4:30 AM", completed: false },
        { title: "Chilled Packing in Thermal Bag", time: "Tomorrow 5:15 AM", completed: false },
        { title: "Out for Morning Delivery", time: "Tomorrow 5:45 AM", completed: false },
        { title: "Delivered to Doorstep Pouch", time: "Tomorrow 6:30 AM", completed: false }
      ],
      bottlesReturned: 0,
      walletCreditPending: 0
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order #${orderId} placed successfully! Doorstep delivery tomorrow.`);
    return { success: true, orderId };
  };

  const updateOrderStatus = async (orderId, nextStatus, partnerInfo = null) => {
    try {
      await api.orders.updateStatus(orderId, nextStatus, partnerInfo);
    } catch (e) {
      console.warn('Backend updateOrderStatus fallback:', e.message);
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const updatedTimeline = (ord.timeline || []).map((step) => {
            if (step.title.toLowerCase().includes(nextStatus.toLowerCase())) {
              return { ...step, completed: true, active: true, time: now };
            }
            return step;
          });

          return {
            ...ord,
            status: nextStatus,
            sellerStatus: nextStatus,
            deliveryPartner: partnerInfo || ord.deliveryPartner,
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );
    showToast(`Order #${orderId} status updated to: ${nextStatus}`);
  };

  const recordBottleReturn = async (orderId, bottleCount) => {
    const count = Number(bottleCount);
    if (isNaN(count) || count <= 0) return;
    const creditAmount = count * 10;

    try {
      await api.delivery.completeDelivery({
        orderId,
        bottlesCollected: count,
        bottlesDelivered: 1
      });
    } catch (e) {
      console.warn('Backend completeDelivery fallback:', e.message);
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            bottlesReturned: (ord.bottlesReturned || 0) + count,
            walletCreditPending: 0
          };
        }
        return ord;
      })
    );

    addWalletBalance(creditAmount);
    showToast(`Collected ${count} glass bottles! Credited ₹${creditAmount} to customer wallet.`);
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        recordBottleReturn,
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
