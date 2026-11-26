/**
 * MilkMart Seller & Producer Services Layer
 * Integrated with the Express REST API backend on port 5000 with local fallback.
 */
import { Store } from '../data/store';
import { initialFarms, FARM_PHOTOS_VERSION } from '../data/mockFarms';
import { initialSellerNotifications } from '../data/mockSellerNotifications';
import { api } from './api';

const FARMS_KEY = 'milkmart_farms';
const NOTIFS_KEY = 'milkmart_seller_notifications';
const FARM_PHOTOS_VERSION_KEY = 'milkmart_farm_photos_version';

const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const isQuotaError = (e) =>
  e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);

const setStored = (key, val, { throwOnError = false } = {}) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent('milkmart:datasync', { detail: { key, value: val } }));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
    if (throwOnError) {
      if (isQuotaError(e)) {
        throw new Error('Browser storage is full. Remove a few photos or use smaller images, then save again.');
      }
      throw e;
    }
  }
};

// Initialize farms and notifications if absent
if (!localStorage.getItem(FARMS_KEY)) {
  setStored(FARMS_KEY, initialFarms);
  localStorage.setItem(FARM_PHOTOS_VERSION_KEY, String(FARM_PHOTOS_VERSION));
}
if (!localStorage.getItem(NOTIFS_KEY)) {
  setStored(NOTIFS_KEY, initialSellerNotifications);
}

export const sellerService = {
  // --- AUTHENTICATION & REGISTRATION ---
  async sellerLogin(emailOrPhone, password) {
    try {
      const res = await api.auth.login(emailOrPhone, password, 'seller');
      if (res?.user) {
        Store.setSessionUser(res.user);
        return res.user;
      }
    } catch (e) {
      console.warn('Backend login fallback to local Store:', e.message);
    }

    const users = Store.getUsers();
    const query = emailOrPhone.trim().toLowerCase();
    const user = users.find(u => 
      (u.email?.toLowerCase() === query || u.phone?.replace(/\D/g, '') === query.replace(/\D/g, '')) &&
      u.password === password &&
      u.role === 'seller'
    );
    if (!user) {
      throw new Error("Invalid seller credentials. Please verify your email/phone and password.");
    }
    Store.setSessionUser(user);
    return user;
  },

  async sellerRegister(sellerData) {
    try {
      const res = await api.auth.register({
        email: sellerData.email,
        password: sellerData.password,
        name: sellerData.fullName,
        phone: sellerData.phone,
        role: 'seller',
        farmName: sellerData.farmName,
        location: `${sellerData.farmLocation}, ${sellerData.district}, ${sellerData.state}`,
        district: sellerData.district,
        state: sellerData.state,
        pincode: sellerData.pincode,
        sellerType: sellerData.sellerType,
        fssaiLicense: sellerData.fssaiLicense || "11223344556677"
      });
      if (res?.user) {
        Store.saveUser(res.user);
        Store.setSessionUser(res.user);
        return res.user;
      }
    } catch (e) {
      console.warn('Backend register fallback to local Store:', e.message);
    }

    const users = Store.getUsers();
    const existing = users.find(u => u.email?.toLowerCase() === sellerData.email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email already exists. Please login instead.");
    }

    const sellerId = `usr-seller-${Date.now()}`;
    const farmId = `farm-${sellerData.farmName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const newSeller = {
      id: sellerId,
      farmId,
      name: sellerData.fullName,
      farmName: sellerData.farmName,
      email: sellerData.email,
      phone: sellerData.phone,
      password: sellerData.password,
      role: 'seller',
      location: `${sellerData.farmLocation}, ${sellerData.district}, ${sellerData.state}`,
      district: sellerData.district,
      state: sellerData.state,
      pincode: sellerData.pincode,
      sellerType: sellerData.sellerType || 'Dairy Farmer',
      fssaiLicense: sellerData.fssaiLicense || "11223344556677",
      walletBalance: 0,
      rating: 5.0,
      avatar: "/images/users/avatar.jpg",
      createdAt: new Date().toISOString()
    };

    Store.saveUser(newSeller);

    const newFarm = {
      id: farmId,
      sellerId,
      name: sellerData.farmName,
      ownerName: sellerData.fullName,
      description: sellerData.description || `Pure and ethical dairy farm producing chemical-free, farm-fresh milk and artisan dairy in ${sellerData.district}.`,
      address: sellerData.farmLocation,
      village: sellerData.farmLocation,
      district: sellerData.district,
      state: sellerData.state,
      pincode: sellerData.pincode,
      phone: sellerData.phone,
      email: sellerData.email,
      farmType: sellerData.sellerType || 'Organic & Natural',
      productsProduced: ["Milk", "A2 Milk", "Curd", "Ghee"],
      verificationStatus: "Verified",
      rating: 5.0,
      reviewCount: 0,
      totalOrders: 0,
      coverImage: "/images/farms/cover-green-valley.jpg",
      logo: "/images/milk-bottle.svg",
      galleryImages: [
        { id: `ph-${Date.now()}-1`, url: "/images/hero/hero-1.jpg", caption: "Our herd", category: "Cattle" },
        { id: `ph-${Date.now()}-2`, url: "/images/categories/milk.jpg", caption: "Fresh farm milk", category: "Products" }
      ],
      fssaiLicense: newSeller.fssaiLicense,
      cattleCount: 30,
      dailyCapacityLiters: 200
    };

    const farms = getStored(FARMS_KEY, initialFarms);
    setStored(FARMS_KEY, [newFarm, ...farms]);

    Store.setSessionUser(newSeller);
    return newSeller;
  },

  // --- SELLER & FARM PROFILE ---
  async getSellerProfile(sellerId) {
    const users = Store.getUsers();
    return users.find(u => u.id === sellerId) || null;
  },

  async updateSellerProfile(sellerId, updates) {
    try {
      await api.auth.updateProfile(updates);
    } catch (e) {
      console.warn('Backend updateProfile fallback:', e.message);
    }

    const users = Store.getUsers();
    const idx = users.findIndex(u => u.id === sellerId);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      setStored('milkmart_users', users);
      const session = Store.getSessionUser();
      if (session && session.id === sellerId) {
        Store.setSessionUser(users[idx]);
      }
      return users[idx];
    }
    throw new Error("Seller not found");
  },

  async getFarmProfile(sellerId) {
    try {
      const serverFarm = await api.farms.getById(sellerId);
      if (serverFarm) return serverFarm;
    } catch (e) {
      // fallback
    }

    const farms = getStored(FARMS_KEY, initialFarms);
    let farm = farms.find(f => f.sellerId === sellerId);
    if (!farm) {
      const user = await this.getSellerProfile(sellerId);
      farm = farms.find(f => f.name?.toLowerCase() === user?.farmName?.toLowerCase()) || farms[0];
    }
    return farm;
  },

  async getFarmById(farmId) {
    try {
      const serverFarm = await api.farms.getById(farmId);
      if (serverFarm) return serverFarm;
    } catch (e) {
      // fallback
    }
    const farms = getStored(FARMS_KEY, initialFarms);
    return farms.find(f => f.id === farmId) || farms[0];
  },

  async getAllFarms() {
    try {
      const serverFarms = await api.farms.getAll();
      if (serverFarms && serverFarms.length > 0) return serverFarms;
    } catch (e) {
      // fallback
    }
    return getStored(FARMS_KEY, initialFarms);
  },

  async updateFarmProfile(sellerId, farmData) {
    try {
      const updated = await api.farms.update(farmData.id || sellerId, farmData);
      if (updated) {
        const farms = getStored(FARMS_KEY, initialFarms);
        const idx = farms.findIndex(f => f.id === updated.id || f.sellerId === sellerId);
        if (idx >= 0) farms[idx] = updated;
        else farms.unshift(updated);
        setStored(FARMS_KEY, farms);
        return updated;
      }
    } catch (e) {
      console.warn('Backend updateFarm fallback:', e.message);
    }

    const farms = getStored(FARMS_KEY, initialFarms);
    let idx = farmData.id ? farms.findIndex(f => f.id === farmData.id) : -1;
    if (idx < 0) idx = farms.findIndex(f => f.sellerId === sellerId);
    if (idx >= 0) {
      const next = [...farms];
      next[idx] = { ...farms[idx], ...farmData };
      setStored(FARMS_KEY, next, { throwOnError: true });
      return next[idx];
    } else {
      const newFarm = { id: `farm-${Date.now()}`, sellerId, ...farmData };
      setStored(FARMS_KEY, [newFarm, ...farms], { throwOnError: true });
      return newFarm;
    }
  },

  // --- PRODUCTS ---
  async getProducts(sellerId = null, filters = {}) {
    try {
      const serverProducts = await api.products.getAll({
        sellerId: sellerId || '',
        category: filters.category || '',
        status: filters.status || '',
        search: filters.search || ''
      });
      if (serverProducts && serverProducts.length > 0) {
        return serverProducts;
      }
    } catch (e) {
      console.warn('Backend getProducts fallback:', e.message);
    }

    const all = Store.getProducts();
    let list = all;

    if (sellerId) {
      const user = await this.getSellerProfile(sellerId);
      list = all.filter(p => 
        p.sellerId === sellerId || 
        p.farmId === user?.farmId ||
        p.brand?.toLowerCase() === user?.farmName?.toLowerCase() ||
        (!p.sellerId && sellerId === 'usr-seller-01')
      );
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter(p => (p.approvalStatus || 'approved').toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter(p => p.category?.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s));
    }

    return list;
  },

  async getProductById(id) {
    try {
      const prod = await api.products.getById(id);
      if (prod) return prod;
    } catch (e) {
      // fallback
    }
    const all = Store.getProducts();
    return all.find(p => p.id === id) || null;
  },

  async createProduct(productData, sellerUser) {
    try {
      const created = await api.products.create({
        ...productData,
        sellerId: sellerUser?.id,
        farmId: sellerUser?.farmId,
        brand: sellerUser?.farmName
      });
      if (created) {
        Store.saveProduct(created);
        return created;
      }
    } catch (e) {
      console.warn('Backend createProduct fallback:', e.message);
    }

    const id = `prod-${Date.now()}`;
    const newProduct = {
      id,
      name: productData.name,
      category: productData.category || 'milk',
      brand: sellerUser?.farmName || productData.brand || 'Artisan Farm Dairy',
      sellerId: sellerUser?.id || 'usr-seller-01',
      farmId: sellerUser?.farmId || 'farm-gir-amrit',
      farmName: sellerUser?.farmName || 'Gir Amrit Organic Gaushala',
      farmLocation: sellerUser?.location || 'Coimbatore, Tamil Nadu',
      description: productData.description || 'Pure farm-fresh unadulterated dairy bottled in sterilized returnable glass.',
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      discount: productData.originalPrice ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) : 0,
      size: productData.size || '1 L',
      unit: productData.unit || 'L',
      stock: Number(productData.stock || 50),
      reservedStock: 0,
      availableStock: Number(productData.stock || 50),
      lowStockThreshold: Number(productData.lowStockThreshold || 15),
      minOrderQty: Number(productData.minOrderQty || 1),
      maxOrderQty: Number(productData.maxOrderQty || 10),
      image: productData.image || '/images/products/milk-a2.jpg',
      additionalImages: productData.additionalImages || [],
      freshness: productData.freshness || 'Fresh Today',
      shelfLife: productData.shelfLife || '2-3 Days (Store below 4°C)',
      storageInstructions: productData.storageInstructions || 'Keep refrigerated at 3°C - 4°C. Consume within 48 hours of delivery.',
      ingredients: productData.ingredients || '100% Raw Pure Milk (No added preservatives or neutralizers)',
      nutritionalInfo: productData.nutritionalInfo || {
        calories: "68 kcal / 100ml",
        protein: "3.4g",
        fat: "4.8g",
        calcium: "125mg"
      },
      fatContent: productData.fatContent || '4.8% Natural Fat',
      snf: productData.snf || '8.9%',
      hsnCode: productData.hsnCode || '0401',
      gstRate: Number(productData.gstRate || 0),
      rating: 5.0,
      reviewCount: 1,
      availability: Number(productData.stock) > 0 ? 'In Stock' : 'Out of Stock',
      approvalStatus: productData.submitForApproval ? 'pending' : 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      isSubscribable: true
    };

    Store.saveProduct(newProduct);
    return newProduct;
  },

  async updateProduct(productId, updates) {
    try {
      const updated = await api.products.update(productId, updates);
      if (updated) {
        Store.saveProduct(updated);
        return updated;
      }
    } catch (e) {
      console.warn('Backend updateProduct fallback:', e.message);
    }

    const all = Store.getProducts();
    const idx = all.findIndex(p => p.id === productId);
    if (idx >= 0) {
      const updated = {
        ...all[idx],
        ...updates,
        availableStock: updates.stock !== undefined ? Number(updates.stock) - (all[idx].reservedStock || 0) : all[idx].availableStock
      };
      all[idx] = updated;
      setStored('milkmart_products', all);
      return updated;
    }
    throw new Error("Product not found");
  },

  async deleteProduct(productId) {
    try {
      await api.products.delete(productId);
    } catch (e) {
      console.warn('Backend deleteProduct fallback:', e.message);
    }
    Store.deleteProduct(productId);
    return true;
  },

  async duplicateProduct(productId, sellerUser) {
    const original = await this.getProductById(productId);
    if (!original) throw new Error("Original product not found");

    const copy = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Copy)`,
      approvalStatus: 'draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    Store.saveProduct(copy);
    return copy;
  },

  // --- INVENTORY ---
  async getInventory(sellerId) {
    const products = await this.getProducts(sellerId);
    return products.map(p => ({
      productId: p.id,
      productName: p.name,
      category: p.category,
      unit: p.unit || 'L',
      image: p.image,
      currentStock: Number(p.stock || 0),
      reservedStock: Number(p.reservedStock || 0),
      availableStock: Math.max(0, Number(p.stock || 0) - Number(p.reservedStock || 0)),
      lowStockThreshold: Number(p.lowStockThreshold || 15),
      isLowStock: Number(p.stock || 0) <= Number(p.lowStockThreshold || 15),
      isOutOfStock: Number(p.stock || 0) <= 0,
      lastUpdated: p.lastUpdated || "Today, 05:00 AM"
    }));
  },

  async updateInventoryItem(productId, { action, amount, exactValue }) {
    try {
      const res = await api.products.adjustStock(productId, { action, amount, exactValue });
      if (res) {
        Store.saveProduct(res);
        return res;
      }
    } catch (e) {
      console.warn('Backend adjustStock fallback:', e.message);
    }

    const prod = await this.getProductById(productId);
    if (!prod) throw new Error("Product not found");

    let newStock = prod.stock || 0;
    if (action === 'increase') newStock += Number(amount);
    if (action === 'decrease') newStock = Math.max(0, newStock - Number(amount));
    if (action === 'set') newStock = Math.max(0, Number(exactValue));

    const updated = await this.updateProduct(productId, {
      stock: newStock,
      availability: newStock > 0 ? 'In Stock' : 'Out of Stock',
      lastUpdated: "Just now"
    });
    return updated;
  },

  // --- ORDERS ---
  async getOrders(sellerId = null, statusFilter = 'all') {
    try {
      const serverOrders = await api.orders.getAll();
      if (serverOrders && serverOrders.length > 0) {
        let list = serverOrders;
        if (statusFilter && statusFilter !== 'all') {
          list = list.filter(o => (o.sellerStatus || o.status || 'Pending').toLowerCase() === statusFilter.toLowerCase());
        }
        return list;
      }
    } catch (e) {
      console.warn('Backend getOrders fallback:', e.message);
    }

    const all = Store.getOrders();
    let list = all;

    if (sellerId) {
      const user = await this.getSellerProfile(sellerId);
      list = all.filter(o => 
        o.sellerId === sellerId || 
        o.items?.some(i => i.farmId === user?.farmId || i.sellerId === sellerId) ||
        sellerId === 'usr-seller-01' ||
        sellerId === 'usr-seller-02'
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(o => {
        const current = (o.sellerStatus || o.status || 'Pending').toLowerCase();
        return current === statusFilter.toLowerCase();
      });
    }

    return list;
  },

  async getOrderById(orderId) {
    try {
      const serverOrd = await api.orders.getById(orderId);
      if (serverOrd) return serverOrd;
    } catch (e) {
      // fallback
    }
    const all = Store.getOrders();
    const q = String(orderId || '').toLowerCase().replace(/^#/, '');
    return all.find(o => 
      String(o.id).toLowerCase() === q ||
      String(o.id).toLowerCase() === `ord-${q}` ||
      q === String(o.id).toLowerCase().replace(/^ord-/, '')
    ) || all[0] || null;
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const res = await api.orders.updateStatus(orderId, newStatus);
      if (res) {
        // sync local store
        const all = Store.getOrders();
        const idx = all.findIndex(o => o.id === res.id);
        if (idx >= 0) all[idx] = res;
        setStored('milkmart_orders', all);
        return res;
      }
    } catch (e) {
      console.warn('Backend updateOrderStatus fallback:', e.message);
    }

    const all = Store.getOrders();
    const q = String(orderId || '').toLowerCase().replace(/^#/, '');
    const idx = all.findIndex(o => 
      String(o.id).toLowerCase() === q ||
      String(o.id).toLowerCase() === `ord-${q}` ||
      q === String(o.id).toLowerCase().replace(/^ord-/, '')
    );
    if (idx >= 0) {
      const ord = all[idx];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      all[idx] = {
        ...ord,
        sellerStatus: newStatus,
        status: newStatus === 'Ready' ? 'Out for Delivery' : (newStatus === 'Delivered' ? 'Delivered' : ord.status),
        updatedAt: now
      };

      setStored('milkmart_orders', all);
      return all[idx];
    }
    throw new Error("Order not found");
  },

  // --- SALES & ANALYTICS ---
  async getSalesAnalytics(sellerId) {
    try {
      const res = await api.analytics.getSellerAnalytics(sellerId || 'usr-seller-01');
      if (res) return res;
    } catch (e) {
      // fallback
    }

    const orders = await this.getOrders(sellerId);
    const completed = orders.filter(o => o.status === 'Delivered' || o.sellerStatus === 'Delivered');

    const totalRevenue = completed.reduce((sum, o) => sum + (o.total || 0), 0) || 54200;
    const todayRevenue = Math.round(totalRevenue * 0.12);
    const weekRevenue = Math.round(totalRevenue * 0.38);
    const monthRevenue = totalRevenue;

    const platformFee = Math.round(totalRevenue * 0.05);
    const netSellerEarnings = totalRevenue - platformFee;

    const dailyTrend = [
      { day: "Mon", revenue: 4800, orders: 18 },
      { day: "Tue", revenue: 6200, orders: 24 },
      { day: "Wed", revenue: 5400, orders: 21 },
      { day: "Thu", revenue: 7100, orders: 28 },
      { day: "Fri", revenue: 6900, orders: 26 },
      { day: "Sat", revenue: 8400, orders: 32 },
      { day: "Sun", revenue: 9200, orders: 36 }
    ];

    const salesLedger = orders.map(o => ({
      id: o.id,
      date: o.date || "2026-09-30",
      product: o.items?.[0]?.name || "Farm Fresh A2 Milk",
      quantity: o.items?.[0]?.quantity || 2,
      grossRevenue: o.total || 170,
      fee: Math.round((o.total || 170) * 0.05),
      netEarnings: Math.round((o.total || 170) * 0.95),
      paymentMethod: o.paymentMethod || "Online UPI"
    }));

    return {
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalRevenue,
      platformFee,
      netSellerEarnings,
      totalOrders: orders.length,
      completedOrders: completed.length,
      dailyTrend,
      salesLedger
    };
  },

  // --- NOTIFICATIONS ---
  async getNotifications(sellerId) {
    try {
      const res = await api.notifications.getAll();
      if (res && res.length > 0) return res;
    } catch (e) {
      // fallback
    }
    const all = getStored(NOTIFS_KEY, initialSellerNotifications);
    if (!sellerId) return all;
    return all.filter(n => n.sellerId === sellerId || !n.sellerId);
  },

  addNotification(sellerId, notif) {
    const all = getStored(NOTIFS_KEY, initialSellerNotifications);
    const newN = {
      id: `notif-${Date.now()}`,
      sellerId,
      timestamp: "Just now",
      read: false,
      ...notif
    };
    setStored(NOTIFS_KEY, [newN, ...all]);
    return newN;
  },

  async markNotificationRead(notifId) {
    try {
      await api.notifications.markRead(notifId);
    } catch (e) {}
    const all = getStored(NOTIFS_KEY, initialSellerNotifications);
    const updated = all.map(n => n.id === notifId ? { ...n, read: true } : n);
    setStored(NOTIFS_KEY, updated);
  },

  async markAllNotificationsRead(sellerId) {
    try {
      await api.notifications.markAllRead();
    } catch (e) {}
    const all = getStored(NOTIFS_KEY, initialSellerNotifications);
    const updated = all.map(n => n.sellerId === sellerId ? { ...n, read: true } : n);
    setStored(NOTIFS_KEY, updated);
  },

  // --- ADMIN APPROVAL SYSTEM ---
  async approveProduct(productId) {
    try {
      const res = await api.products.setApproval(productId, 'approved');
      if (res) {
        Store.saveProduct(res);
        return res;
      }
    } catch (e) {
      console.warn('Backend approveProduct fallback:', e.message);
    }

    const all = Store.getProducts();
    const idx = all.findIndex(p => p.id === productId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], approvalStatus: 'approved' };
      setStored('milkmart_products', all);
      return all[idx];
    }
    throw new Error("Product not found");
  },

  async rejectProduct(productId, reason = "Quality parameters require revision") {
    try {
      const res = await api.products.setApproval(productId, 'rejected', reason);
      if (res) {
        Store.saveProduct(res);
        return res;
      }
    } catch (e) {
      console.warn('Backend rejectProduct fallback:', e.message);
    }

    const all = Store.getProducts();
    const idx = all.findIndex(p => p.id === productId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], approvalStatus: 'rejected', rejectionReason: reason };
      setStored('milkmart_products', all);
      return all[idx];
    }
    throw new Error("Product not found");
  }
};
