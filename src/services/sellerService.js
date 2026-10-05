/**
 * MilkMart Seller & Producer Services Layer
 * API-ready architecture: Isolates all data mutations and reads so they can be
 * hooked directly to Django REST Framework / backend endpoints later.
 */
import { Store } from '../data/store';
import { initialFarms, FARM_PHOTOS_VERSION } from '../data/mockFarms';
import { initialSellerNotifications } from '../data/mockSellerNotifications';

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

// One-time migration: older saved farms pointed at images that don't exist.
// Refresh cover/logo/gallery from seed data while keeping all other edits.
if (Number(localStorage.getItem(FARM_PHOTOS_VERSION_KEY) || 0) < FARM_PHOTOS_VERSION) {
  const BROKEN = ['/images/farm-banner.jpg', '/images/farm-logo-1.jpg', '/images/farm-logo-2.jpg', '/images/farm-logo-3.jpg'];
  const saved = getStored(FARMS_KEY, initialFarms);
  const migrated = saved.map(farm => {
    const seed = initialFarms.find(s => s.id === farm.id);
    const fallbackSeed = initialFarms[2];
    const src = seed || fallbackSeed;
    const hasUserPhotos = (farm.galleryImages || []).some(g => (typeof g === 'string' ? g : g?.url || '').startsWith('data:'));
    return {
      ...farm,
      coverImage: !farm.coverImage || BROKEN.includes(farm.coverImage) || farm.coverImage.includes('unsplash') ? src.coverImage : farm.coverImage,
      logo: !farm.logo || BROKEN.includes(farm.logo) || farm.logo.includes('unsplash') ? (seed ? seed.logo : '/images/milk-bottle.svg') : farm.logo,
      galleryImages: hasUserPhotos ? farm.galleryImages : (seed ? seed.galleryImages : src.galleryImages.slice(0, 6))
    };
  });
  setStored(FARMS_KEY, migrated);
  localStorage.setItem(FARM_PHOTOS_VERSION_KEY, String(FARM_PHOTOS_VERSION));
}

export const sellerService = {
  // --- AUTHENTICATION & REGISTRATION ---
  async sellerLogin(emailOrPhone, password) {
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

    // Create corresponding farm profile
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

    // Send welcome notification
    this.addNotification(sellerId, {
      title: "Welcome to MilkMart Producer Hub!",
      message: `Your farm '${sellerData.farmName}' has been registered. You can now add your dairy SKUs and start receiving doorstep orders.`,
      type: "verified",
      link: "/seller/farm"
    });

    Store.setSessionUser(newSeller);
    return newSeller;
  },

  // --- SELLER & FARM PROFILE ---
  async getSellerProfile(sellerId) {
    const users = Store.getUsers();
    return users.find(u => u.id === sellerId) || null;
  },

  async updateSellerProfile(sellerId, updates) {
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
    const farms = getStored(FARMS_KEY, initialFarms);
    let farm = farms.find(f => f.sellerId === sellerId);
    if (!farm) {
      // Fallback matching by farm name from user
      const user = await this.getSellerProfile(sellerId);
      farm = farms.find(f => f.name?.toLowerCase() === user?.farmName?.toLowerCase()) || farms[0];
    }
    return farm;
  },

  async getFarmById(farmId) {
    const farms = getStored(FARMS_KEY, initialFarms);
    return farms.find(f => f.id === farmId) || farms[0];
  },

  async getAllFarms() {
    return getStored(FARMS_KEY, initialFarms);
  },

  async updateFarmProfile(sellerId, farmData) {
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
    const all = Store.getProducts();
    return all.find(p => p.id === id) || null;
  },

  async createProduct(productData, sellerUser) {
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

    // If pending approval, notify
    if (newProduct.approvalStatus === 'pending') {
      this.addNotification(sellerUser?.id, {
        title: "Product Submitted for Approval",
        message: `'${newProduct.name}' has been submitted for admin quality approval.`,
        type: "info",
        link: "/seller/products"
      });
    }

    return newProduct;
  },

  async updateProduct(productId, updates) {
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

    // Low stock notification trigger
    if (newStock <= (prod.lowStockThreshold || 15) && newStock > 0) {
      this.addNotification(prod.sellerId, {
        title: "Low Inventory Warning",
        message: `${prod.name} has only ${newStock} units remaining. Update stock to avoid order pauses.`,
        type: "warning",
        link: "/seller/inventory"
      });
    }

    return updated;
  },

  // --- ORDERS ---
  async getOrders(sellerId = null, statusFilter = 'all') {
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
    const all = Store.getOrders();
    const q = String(orderId || '').toLowerCase().replace(/^#/, '');
    return all.find(o => 
      String(o.id).toLowerCase() === q ||
      String(o.id).toLowerCase() === `ord-${q}` ||
      q === String(o.id).toLowerCase().replace(/^ord-/, '')
    ) || all[0] || null;
  },

  async updateOrderStatus(orderId, newStatus) {
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

      // Update customer timeline
      const updatedTimeline = ord.timeline ? ord.timeline.map(s => {
        if (s.title.toLowerCase().includes(newStatus.toLowerCase())) {
          return { ...s, completed: true, active: true, time: now };
        }
        return s;
      }) : [];

      all[idx] = {
        ...ord,
        sellerStatus: newStatus,
        status: newStatus === 'Ready' ? 'Out for Delivery' : (newStatus === 'Delivered' ? 'Delivered' : ord.status),
        timeline: updatedTimeline,
        updatedAt: now
      };

      setStored('milkmart_orders', all);

      // Notify seller
      this.addNotification(ord.sellerId || 'usr-seller-02', {
        title: `Order #${ord.id} Updated`,
        message: `Order status changed to '${newStatus}'.`,
        type: "order",
        link: `/seller/orders/${ord.id}`
      });

      return all[idx];
    }
    throw new Error("Order not found");
  },

  // --- SALES & ANALYTICS ---
  async getSalesAnalytics(sellerId) {
    const orders = await this.getOrders(sellerId);
    const completed = orders.filter(o => o.status === 'Delivered' || o.sellerStatus === 'Delivered');

    const totalRevenue = completed.reduce((sum, o) => sum + (o.total || 0), 0) || 54200;
    const todayRevenue = Math.round(totalRevenue * 0.12);
    const weekRevenue = Math.round(totalRevenue * 0.38);
    const monthRevenue = totalRevenue;

    // Platform commission (5%)
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
    const all = getStored(NOTIFS_KEY, initialSellerNotifications);
    const updated = all.map(n => n.id === notifId ? { ...n, read: true } : n);
    setStored(NOTIFS_KEY, updated);
  },

  async markAllNotificationsRead(sellerId) {
    const all = getStored(NOTIFS_KEY, initialSellerNotifications);
    const updated = all.map(n => n.sellerId === sellerId ? { ...n, read: true } : n);
    setStored(NOTIFS_KEY, updated);
  },

  // --- ADMIN APPROVAL SYSTEM ---
  async approveProduct(productId) {
    const all = Store.getProducts();
    const idx = all.findIndex(p => p.id === productId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], approvalStatus: 'approved' };
      setStored('milkmart_products', all);

      this.addNotification(all[idx].sellerId, {
        title: "Product Approved by Admin ✓",
        message: `'${all[idx].name}' has been verified and published to the MilkMart storefront!`,
        type: "success",
        link: "/seller/products"
      });
      return all[idx];
    }
    throw new Error("Product not found");
  },

  async rejectProduct(productId, reason = "Quality parameters require revision") {
    const all = Store.getProducts();
    const idx = all.findIndex(p => p.id === productId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], approvalStatus: 'rejected', rejectionReason: reason };
      setStored('milkmart_products', all);

      this.addNotification(all[idx].sellerId, {
        title: "Product Revision Requested",
        message: `'${all[idx].name}' was rejected: ${reason}`,
        type: "warning",
        link: "/seller/products"
      });
      return all[idx];
    }
    throw new Error("Product not found");
  }
};
