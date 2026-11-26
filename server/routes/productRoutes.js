import express from 'express';
import { db } from '../db/database.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, farmId, sellerId, search, status, fatContent, sortBy, inStockOnly, brand } = req.query;
    let products = db.get('products');

    // Filter by approvalStatus:
    // Regular public customers only see 'approved' products (or undefined, which defaults to approved)
    // If authenticated as admin or matching seller, they can see draft/pending/rejected
    const isPrivileged = req.user && (req.user.role === 'admin' || req.user.role === 'seller');
    if (!isPrivileged && (!status || status === 'approved')) {
      products = products.filter(p => !p.approvalStatus || p.approvalStatus === 'approved');
    } else if (status && status !== 'all') {
      products = products.filter(p => (p.approvalStatus || 'approved').toLowerCase() === status.toLowerCase());
    }

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    // Filter by brand
    if (brand && brand !== 'all') {
      products = products.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
    }

    // Filter by farm
    if (farmId) {
      products = products.filter(p => p.farmId === farmId);
    }

    // Filter by seller
    if (sellerId) {
      products = products.filter(p => 
        p.sellerId === sellerId || 
        (!p.sellerId && sellerId === 'usr-seller-01')
      );
    }

    // Filter by fat content
    if (fatContent && fatContent !== 'all') {
      products = products.filter(p => p.fatContent?.toLowerCase().includes(fatContent.toLowerCase()));
    }

    // Filter in stock only
    if (inStockOnly === 'true' || inStockOnly === true) {
      products = products.filter(p => (Number(p.stock) > 0) && p.availability !== 'Out of Stock');
    }

    // Filter search
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.find('products', p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  return res.json({ success: true, product });
});

// POST /api/products
router.post('/', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.price) {
      return res.status(400).json({ success: false, message: 'Product name and price are required.' });
    }

    const id = `prod-${Date.now()}`;
    const price = Number(data.price);
    const originalPrice = Number(data.originalPrice || price);
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const stock = Number(data.stock || 50);

    const isFarmer = req.user.role === 'seller';
    const farmProfile = isFarmer ? db.find('farms', f => f.sellerId === req.user.id) : null;

    const newProduct = {
      id,
      name: data.name,
      category: data.category || 'milk',
      brand: data.brand || farmProfile?.name || req.user.farmName || 'Artisan Farmstead',
      sellerId: isFarmer ? req.user.id : (data.sellerId || req.user.id),
      farmId: farmProfile?.id || req.user.farmId || 'farm-gir-amrit',
      farmName: farmProfile?.name || req.user.farmName || 'Gir Amrit Organic Gaushala',
      farmLocation: farmProfile?.district ? `${farmProfile.district}, ${farmProfile.state}` : 'Kengeri Valley, Karnataka',
      description: data.description || 'Farm-fresh unadulterated dairy delivered before sunrise in returnable glass.',
      price,
      originalPrice,
      discount,
      size: data.size || '1 L',
      unit: data.unit || 'L',
      stock,
      reservedStock: 0,
      availableStock: stock,
      lowStockThreshold: Number(data.lowStockThreshold || 15),
      minOrderQty: Number(data.minOrderQty || 1),
      maxOrderQty: Number(data.maxOrderQty || 10),
      image: data.image || '/images/products/milk-a2.jpg',
      additionalImages: data.additionalImages || [],
      freshness: data.freshness || 'Fresh Today',
      shelfLife: data.shelfLife || '2-3 Days (Store below 4°C)',
      storageInstructions: data.storageInstructions || 'Keep refrigerated at 3°C - 4°C.',
      ingredients: data.ingredients || '100% Raw Pure Milk',
      nutritionalInfo: data.nutritionalInfo || {
        calories: "68 kcal / 100ml",
        protein: "3.4g",
        fat: "4.8g",
        calcium: "125mg"
      },
      fatContent: data.fatContent || '4.8% Natural Fat',
      snf: data.snf || '8.9%',
      hsnCode: data.hsnCode || '0401',
      gstRate: Number(data.gstRate || 0),
      rating: 5.0,
      reviewCount: 1,
      availability: stock > 0 ? 'In Stock' : 'Out of Stock',
      approvalStatus: req.user.role === 'admin' ? 'approved' : (data.submitForApproval ? 'pending' : 'draft'),
      isSubscribable: data.isSubscribable !== undefined ? data.isSubscribable : true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.insert('products', newProduct);

    // If pending approval, notify seller and admin
    if (newProduct.approvalStatus === 'pending') {
      db.insert('notifications', {
        id: `notif-${Date.now()}`,
        sellerId: req.user.id,
        title: "Product Submitted for Approval",
        message: `'${newProduct.name}' has been submitted for central quality verification.`,
        type: "info",
        link: "/seller/products",
        timestamp: "Just now",
        read: false
      });
    }

    return res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

// PUT /api/products/:id
router.put('/:id', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const existing = db.find('products', p => p.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check authorization: admin can edit any, seller can edit their own
    if (req.user.role === 'seller' && existing.sellerId && existing.sellerId !== req.user.id && req.user.id !== 'usr-seller-01') {
      return res.status(403).json({ success: false, message: 'You do not have permission to edit this product.' });
    }

    const updates = { ...req.body };
    delete updates.id;

    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
      updates.availableStock = Math.max(0, updates.stock - (existing.reservedStock || 0));
      updates.availability = updates.stock > 0 ? 'In Stock' : 'Out of Stock';
    }

    const updated = db.update('products', req.params.id, updates);
    return res.json({ success: true, product: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const existing = db.find('products', p => p.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (req.user.role === 'seller' && existing.sellerId && existing.sellerId !== req.user.id && req.user.id !== 'usr-seller-01') {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete this product.' });
    }

    db.delete('products', req.params.id);
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

// PATCH /api/products/:id/approval (Admin quality approval)
router.patch('/:id/approval', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status ('approved', 'rejected', 'pending') is required." });
    }

    const existing = db.find('products', p => p.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updated = db.update('products', req.params.id, {
      approvalStatus: status,
      rejectionReason: status === 'rejected' ? (reason || 'Quality parameters need adjustment') : undefined
    });

    // Notify seller
    if (existing.sellerId) {
      db.insert('notifications', {
        id: `notif-${Date.now()}`,
        sellerId: existing.sellerId,
        title: status === 'approved' ? 'Product Approved by Admin ✓' : 'Product Revision Requested',
        message: status === 'approved'
          ? `'${existing.name}' has been verified and published to the customer storefront!`
          : `'${existing.name}' was rejected: ${reason || 'Please review purity specs.'}`,
        type: status === 'approved' ? 'success' : 'warning',
        link: '/seller/products',
        timestamp: 'Just now',
        read: false
      });
    }

    return res.json({ success: true, product: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update approval status.' });
  }
});

// PATCH /api/products/:id/stock (Inventory adjustment)
router.patch('/:id/stock', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const { action, amount, exactValue } = req.body;
    const existing = db.find('products', p => p.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let newStock = Number(existing.stock || 0);
    if (action === 'increase') newStock += Number(amount || 0);
    if (action === 'decrease') newStock = Math.max(0, newStock - Number(amount || 0));
    if (action === 'set') newStock = Math.max(0, Number(exactValue || 0));

    const updated = db.update('products', req.params.id, {
      stock: newStock,
      availableStock: Math.max(0, newStock - (existing.reservedStock || 0)),
      availability: newStock > 0 ? 'In Stock' : 'Out of Stock',
      lastUpdated: 'Just now'
    });

    // Low stock alert check
    if (newStock <= (existing.lowStockThreshold || 15) && newStock > 0) {
      db.insert('notifications', {
        id: `notif-${Date.now()}`,
        sellerId: existing.sellerId,
        title: 'Low Inventory Warning',
        message: `${existing.name} has only ${newStock} units left. Update stock to prevent auto-pausing.`,
        type: 'warning',
        link: '/seller/inventory',
        timestamp: 'Just now',
        read: false
      });
    }

    return res.json({ success: true, product: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to adjust stock.' });
  }
});

export default router;
