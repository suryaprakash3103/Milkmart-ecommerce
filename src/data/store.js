import { mockUsers } from './mockUsers';
import { initialOrders } from './mockOrders';
import { initialSubscriptions } from './mockSubscriptions';
import { initialProducts } from './products';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'milkmart_users',
  SESSION: 'milkmart_session_user',
  ORDERS: 'milkmart_orders',
  SUBSCRIPTIONS: 'milkmart_subscriptions',
  WALLET_TX: 'milkmart_wallet_tx',
  BOTTLE_LOG: 'milkmart_bottle_log',
  PRODUCTS: 'milkmart_products',
  SELLER_BATCHES: 'milkmart_seller_batches',
  SELLER_PAYOUTS: 'milkmart_seller_payouts'
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

// Initial Seller Morning Milking Batches & Purity Certs (Unique Farm-to-Doorstep Feature)
const initialSellerBatches = [
  {
    id: "BATCH-GIR-9042",
    sellerId: "usr-seller-01",
    farmName: "Gir Amrit Organic Gaushala",
    farmerName: "Devendra Patel",
    productName: "Farm Fresh A2 Gir Cow Raw Milk",
    date: "2026-09-30",
    milkingTime: "4:30 AM",
    litersDispatched: 320,
    fatPercentage: 4.8,
    snfPercentage: 8.9,
    chillerTemp: 3.6,
    somaticCellCount: "120,000 cells/ml (Premium Grade A)",
    adulterationTests: {
      urea: "Negative (Passed)",
      detergent: "Negative (Passed)",
      starch: "Negative (Passed)",
      waterAdded: "0% (Nil Added)",
      antibioticResidues: "Nil (100% Free)"
    },
    feedLog: "Free-grazing green Napier grass, Moringa leaves & organic barley fodder",
    cattleVaccinationStatus: "100% Verified Healthy • Bi-weekly Veterinary Inspection",
    labCertNumber: "FSSAI-NABL-KA-2026-9042",
    status: "Verified & Bottled for Sunrise Run"
  },
  {
    id: "BATCH-MURRAH-8810",
    sellerId: "usr-seller-01",
    farmName: "Gir Amrit Organic Gaushala",
    farmerName: "Devendra Patel",
    productName: "Creamy Buffalo Raw Whole Milk",
    date: "2026-09-29",
    milkingTime: "4:45 AM",
    litersDispatched: 180,
    fatPercentage: 7.4,
    snfPercentage: 9.3,
    chillerTemp: 3.7,
    somaticCellCount: "140,000 cells/ml (Grade A)",
    adulterationTests: {
      urea: "Negative (Passed)",
      detergent: "Negative (Passed)",
      starch: "Negative (Passed)",
      waterAdded: "0% (Nil Added)",
      antibioticResidues: "Nil"
    },
    feedLog: "Organic cotton seed mash, mineral lick blocks & green sorghum",
    cattleVaccinationStatus: "Verified Healthy",
    labCertNumber: "FSSAI-NABL-KA-2026-8810",
    status: "Verified & Bottled for Sunrise Run"
  }
];

// Initial Seller Payouts
const initialSellerPayouts = [
  {
    id: "pay-501",
    sellerId: "usr-seller-01",
    date: "2026-09-28",
    amount: 18500,
    litersPaid: 272,
    avgFat: 4.8,
    ratePerLiter: 68.0,
    status: "Settled to Bank",
    bankRef: "HDFC-NEFT-99120412"
  },
  {
    id: "pay-502",
    sellerId: "usr-seller-01",
    date: "2026-09-21",
    amount: 21000,
    litersPaid: 310,
    avgFat: 4.75,
    ratePerLiter: 67.7,
    status: "Settled to Bank",
    bankRef: "HDFC-NEFT-88410293"
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
    // 1. Users
    const currentUsers = getStorageItem(STORAGE_KEYS.USERS, []);
    const mergedUsers = [...currentUsers];
    mockUsers.forEach(mu => {
      const idx = mergedUsers.findIndex(u => u.email.toLowerCase() === mu.email.toLowerCase());
      if (idx === -1) {
        mergedUsers.push(mu);
      } else {
        mergedUsers[idx] = { ...mu, ...mergedUsers[idx] };
      }
    });
    setStorageItem(STORAGE_KEYS.USERS, mergedUsers);

    // 2. Products
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      setStorageItem(STORAGE_KEYS.PRODUCTS, initialProducts);
    }

    // 3. Batches
    if (!localStorage.getItem(STORAGE_KEYS.SELLER_BATCHES)) {
      setStorageItem(STORAGE_KEYS.SELLER_BATCHES, initialSellerBatches);
    }

    // 4. Payouts
    if (!localStorage.getItem(STORAGE_KEYS.SELLER_PAYOUTS)) {
      setStorageItem(STORAGE_KEYS.SELLER_PAYOUTS, initialSellerPayouts);
    }

    // 5. Wallet & Bottle log
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
      const user = mergedUsers.find(u => u.email === 'surya.prakash@example.com') || mergedUsers[0];
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

  // Products (Read/Write shared between Storefront, Admin & Seller Portal)
  getProducts() {
    return getStorageItem(STORAGE_KEYS.PRODUCTS, initialProducts);
  },

  saveProduct(productData) {
    const products = this.getProducts();
    const existingIdx = products.findIndex(p => p.id === productData.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...products];
      updated[existingIdx] = { ...updated[existingIdx], ...productData };
    } else {
      const newProd = {
        ...productData,
        id: productData.id || `prod-${Date.now()}`,
        rating: productData.rating || 5.0,
        reviewCount: productData.reviewCount || 1,
        availability: productData.availability || 'In Stock',
        freshness: productData.freshness || 'Fresh Today'
      };
      updated = [newProd, ...products];
    }
    setStorageItem(STORAGE_KEYS.PRODUCTS, updated);
    return productData;
  },

  deleteProduct(id) {
    const products = this.getProducts();
    const updated = products.filter(p => p.id !== id);
    setStorageItem(STORAGE_KEYS.PRODUCTS, updated);
  },

  // Seller Products
  getSellerProducts(sellerId) {
    const all = this.getProducts();
    // Default to Patel's farm or seller matching ID
    return all.filter(p => p.sellerId === sellerId || p.farmOrigin?.toLowerCase().includes('kengeri') || p.brand?.toLowerCase().includes('gir amrit') || !p.sellerId);
  },

  // Seller Morning Batches & Purity Certificates (Unique Feature)
  getSellerBatches(sellerId) {
    const all = getStorageItem(STORAGE_KEYS.SELLER_BATCHES, initialSellerBatches);
    if (!sellerId) return all;
    return all.filter(b => b.sellerId === sellerId);
  },

  getBatchById(id) {
    const all = getStorageItem(STORAGE_KEYS.SELLER_BATCHES, initialSellerBatches);
    return all.find(b => b.id === id);
  },

  addSellerBatch(batchData) {
    const all = getStorageItem(STORAGE_KEYS.SELLER_BATCHES, initialSellerBatches);
    const id = `BATCH-GIR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBatch = {
      id,
      date: new Date().toISOString().split('T')[0],
      milkingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Verified & Bottled for Sunrise Run",
      labCertNumber: `FSSAI-NABL-KA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...batchData
    };
    const updated = [newBatch, ...all];
    setStorageItem(STORAGE_KEYS.SELLER_BATCHES, updated);
    return newBatch;
  },

  // Seller Payouts
  getSellerPayouts(sellerId) {
    const all = getStorageItem(STORAGE_KEYS.SELLER_PAYOUTS, initialSellerPayouts);
    if (!sellerId) return all;
    return all.filter(p => p.sellerId === sellerId);
  },

  requestSellerPayout(sellerId, amount) {
    const all = getStorageItem(STORAGE_KEYS.SELLER_PAYOUTS, initialSellerPayouts);
    const users = this.getUsers();
    const user = users.find(u => u.id === sellerId);
    
    if (user) {
      user.walletBalance = Math.max(0, (user.walletBalance || 0) - Number(amount));
      this.saveUser(user);
      
      const currentSession = this.getSessionUser();
      if (currentSession && currentSession.id === user.id) {
        this.setSessionUser({ ...currentSession, walletBalance: user.walletBalance });
      }
    }

    const newPayout = {
      id: `pay-${Date.now()}`,
      sellerId,
      date: new Date().toISOString().split('T')[0],
      amount: Number(amount),
      litersPaid: Math.round(Number(amount) / 68),
      avgFat: 4.8,
      ratePerLiter: 68.0,
      status: "Settled to Bank",
      bankRef: `HDFC-NEFT-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    const updated = [newPayout, ...all];
    setStorageItem(STORAGE_KEYS.SELLER_PAYOUTS, updated);
    return newPayout;
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
