import { mockUsers } from './mockUsers';
import { initialOrders } from './mockOrders';
import { initialSubscriptions } from './mockSubscriptions';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'milkmart_users',
  SESSION: 'milkmart_session_user',
  ORDERS: 'milkmart_orders',
  SUBSCRIPTIONS: 'milkmart_subscriptions',
  WALLET_TX: 'milkmart_wallet_tx',
  BOTTLE_LOG: 'milkmart_bottle_log'
};

// Initial wallet transactions seed
const initialWalletTransactions = [
  {
    id: "tx-101",
    userId: "usr-cust-01",
    date: "2026-09-18 06:45 AM",
    type: "credit",
    amount: 20,
    title: "Empty Glass Bottle Return (2 bottles)",
    description: "Doorstep pickup by Ramesh Kumar • ₹10 per bottle refund",
    balanceAfter: 1250
  },
  {
    id: "tx-102",
    userId: "usr-cust-01",
    date: "2026-09-17 09:15 PM",
    type: "debit",
    amount: 220,
    title: "Order #MM-98241 Paid",
    description: "Farm Fresh A2 Gir Cow Milk (2L) + Set Dahi (500g)",
    balanceAfter: 1230
  },
  {
    id: "tx-103",
    userId: "usr-cust-01",
    date: "2026-09-15 10:00 AM",
    type: "credit",
    amount: 1000,
    title: "MilkMart Wallet Top-Up",
    description: "UPI Auto-load / Added funds",
    balanceAfter: 1450
  },
  {
    id: "tx-104",
    userId: "usr-cust-01",
    date: "2026-09-12 06:30 AM",
    type: "credit",
    amount: 30,
    title: "Empty Glass Bottle Return (3 bottles)",
    description: "Sunrise route return deposit refund",
    balanceAfter: 450
  }
];

// Initial Bottle Log Seed for delivery partner & admin audit
const initialBottleLog = [
  {
    id: "bot-001",
    date: "2026-09-18",
    time: "06:12 AM",
    orderId: "MM-97910",
    partnerName: "Ramesh Kumar",
    partnerId: "usr-del-01",
    customerName: "Surya Prakash",
    customerAddress: "Flat 402, Green Meadows, HSR Layout",
    bottlesDelivered: 2,
    bottlesCollected: 2,
    creditGiven: 20,
    condition: "Rinsed & Intact",
    silentDelivery: true
  },
  {
    id: "bot-002",
    date: "2026-09-17",
    time: "06:25 AM",
    orderId: "MM-97880",
    partnerName: "Ramesh Kumar",
    partnerId: "usr-del-01",
    customerName: "Priya Sharma",
    customerAddress: "Flat 402, Green Glen Palms, Bellandur",
    bottlesDelivered: 1,
    bottlesCollected: 1,
    creditGiven: 10,
    condition: "Rinsed & Intact",
    silentDelivery: true
  }
];

// Read from localStorage with fallback
const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Broadcast for cross-component / cross-tab reactivity
    window.dispatchEvent(new CustomEvent('milkmart:datasync', { detail: { key, value } }));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const Store = {
  // Init
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setStorageItem(STORAGE_KEYS.USERS, mockUsers);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WALLET_TX)) {
      setStorageItem(STORAGE_KEYS.WALLET_TX, initialWalletTransactions);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOTTLE_LOG)) {
      setStorageItem(STORAGE_KEYS.BOTTLE_LOG, initialBottleLog);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      setStorageItem(STORAGE_KEYS.ORDERS, initialOrders);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
      setStorageItem(STORAGE_KEYS.SUBSCRIPTIONS, initialSubscriptions);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
      // Default to customer Surya Prakash
      const user = mockUsers.find(u => u.email === 'surya.prakash@example.com') || mockUsers[0];
      setStorageItem(STORAGE_KEYS.SESSION, user);
    }
  },

  // Users
  getUsers() {
    return getStorageItem(STORAGE_KEYS.USERS, mockUsers);
  },

  saveUser(newUser) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === newUser.id || u.email.toLowerCase() === newUser.email.toLowerCase());
    let updated;
    if (existingIndex >= 0) {
      updated = [...users];
      updated[existingIndex] = { ...updated[existingIndex], ...newUser };
    } else {
      updated = [newUser, ...users];
    }
    setStorageItem(STORAGE_KEYS.USERS, updated);
    return newUser;
  },

  findUser(email, password, role) {
    const users = this.getUsers();
    return users.find(u => 
      u.email.toLowerCase() === email.toLowerCase().trim() && 
      u.password === password &&
      (!role || u.role === role)
    );
  },

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  },

  updateUserPassword(email, newPassword) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (idx >= 0) {
      users[idx].password = newPassword;
      setStorageItem(STORAGE_KEYS.USERS, users);
      return true;
    }
    return false;
  },

  // Active Session
  getSessionUser() {
    return getStorageItem(STORAGE_KEYS.SESSION, null);
  },

  setSessionUser(user) {
    setStorageItem(STORAGE_KEYS.SESSION, user);
    if (user) {
      localStorage.setItem('milkmart_user', JSON.stringify(user));
      localStorage.setItem('milkmart_portal', user.role);
    } else {
      localStorage.removeItem('milkmart_user');
      localStorage.removeItem('milkmart_portal');
    }
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem('milkmart_user');
  },

  // Wallet
  getWalletTransactions(userId) {
    const all = getStorageItem(STORAGE_KEYS.WALLET_TX, initialWalletTransactions);
    if (!userId) return all;
    return all.filter(t => t.userId === userId);
  },

  addWalletTransaction(userId, { type, amount, title, description }) {
    const all = getStorageItem(STORAGE_KEYS.WALLET_TX, initialWalletTransactions);
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    let newBalance = user ? (user.walletBalance || 0) : 0;
    if (type === 'credit') newBalance += Number(amount);
    if (type === 'debit') newBalance -= Number(amount);

    if (user) {
      user.walletBalance = Math.max(0, newBalance);
      this.saveUser(user);
      
      const currentSession = this.getSessionUser();
      if (currentSession && currentSession.id === user.id) {
        this.setSessionUser({ ...currentSession, walletBalance: user.walletBalance });
      }
    }

    const tx = {
      id: `tx-${Date.now()}`,
      userId,
      date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      type,
      amount: Number(amount),
      title,
      description,
      balanceAfter: newBalance
    };

    const updated = [tx, ...all];
    setStorageItem(STORAGE_KEYS.WALLET_TX, updated);
    return tx;
  },

  // Bottle Log
  getBottleLogs() {
    return getStorageItem(STORAGE_KEYS.BOTTLE_LOG, initialBottleLog);
  },

  addBottleLog(entry) {
    const logs = this.getBottleLogs();
    const newEntry = {
      id: `bot-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...entry
    };
    const updated = [newEntry, ...logs];
    setStorageItem(STORAGE_KEYS.BOTTLE_LOG, updated);
    return newEntry;
  },

  // Cross-portal trigger: Delivery Partner marks a stop as delivered
  markDeliveryCompleted({ orderId, partnerUser, bottlesDelivered = 1, bottlesCollected = 0, photoUrl = null, notes = "", silentAcknowledged = true }) {
    // 1. Update Order
    const orders = getStorageItem(STORAGE_KEYS.ORDERS, initialOrders);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    let customerName = "Valued Customer";
    let customerAddress = "Doorstep";

    if (orderIndex >= 0) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const ord = orders[orderIndex];
      customerName = ord.deliveryAddress?.name || customerName;
      customerAddress = `${ord.deliveryAddress?.house || ''}, ${ord.deliveryAddress?.street || ''}`;

      const updatedTimeline = ord.timeline ? ord.timeline.map(s => {
        if (s.title.toLowerCase().includes('delivered') || s.title.toLowerCase().includes('doorstep')) {
          return { ...s, completed: true, active: true, time: now };
        }
        return s;
      }) : [];

      orders[orderIndex] = {
        ...ord,
        status: 'Delivered',
        deliveredAt: now,
        bottlesReturned: (ord.bottlesReturned || 0) + Number(bottlesCollected),
        dropPhoto: photoUrl,
        partnerNotes: notes,
        silentDeliveryVerified: silentAcknowledged,
        timeline: updatedTimeline
      };
      setStorageItem(STORAGE_KEYS.ORDERS, orders);
    }

    // 2. If bottles collected, credit customer wallet + log transaction
    const creditAmount = Number(bottlesCollected) * 10;
    const users = this.getUsers();
    // Find customer by order or default customer
    const targetCustomer = users.find(u => u.name.toLowerCase() === customerName.toLowerCase() || u.role === 'customer') || users.find(u => u.role === 'customer');

    if (creditAmount > 0 && targetCustomer) {
      this.addWalletTransaction(targetCustomer.id, {
        type: 'credit',
        amount: creditAmount,
        title: `Glass Bottle Return Credit (${bottlesCollected} bottles)`,
        description: `Doorstep return verified by ${partnerUser?.name || 'Delivery Partner'} • +₹10 each`
      });

      targetCustomer.bottlesReturnedTotal = (targetCustomer.bottlesReturnedTotal || 0) + Number(bottlesCollected);
      this.saveUser(targetCustomer);
    }

    // 3. Append to Delivery Bottle Log
    this.addBottleLog({
      orderId,
      partnerName: partnerUser?.name || "Ramesh Kumar",
      partnerId: partnerUser?.id || "usr-del-01",
      customerName,
      customerAddress,
      bottlesDelivered: Number(bottlesDelivered),
      bottlesCollected: Number(bottlesCollected),
      creditGiven: creditAmount,
      condition: "Rinsed Glass Bottle",
      silentDelivery: silentAcknowledged,
      photoUrl
    });

    // 4. Update Partner stats
    if (partnerUser) {
      const partner = users.find(u => u.id === partnerUser.id);
      if (partner) {
        partner.completedDeliveries = (partner.completedDeliveries || 0) + 1;
        partner.bottlesCollectedCount = (partner.bottlesCollectedCount || 0) + Number(bottlesCollected);
        this.saveUser(partner);
      }
    }

    return true;
  }
};

// Initialize right away
Store.init();
