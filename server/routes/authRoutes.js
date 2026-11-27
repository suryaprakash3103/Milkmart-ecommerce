import express from 'express';
import { db } from '../db/database.js';
import { signToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.find('users', u => 
      (u.email?.toLowerCase() === cleanEmail || u.phone?.replace(/\D/g, '') === cleanEmail.replace(/\D/g, '')) &&
      u.password === password
    );

    if (!user) {
      // Check if email exists
      const emailExists = db.find('users', u => u.email?.toLowerCase() === cleanEmail);
      if (!emailExists) {
        return res.status(404).json({ success: false, message: 'No MilkMart account found with this email or phone.' });
      }
      return res.status(401).json({ success: false, message: 'Incorrect password. Please verify and try again.' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Account is registered as '${user.role}', but login requested for '${role}'.`
      });
    }

    const token = signToken(user);
    const { password: _, ...safeUser } = user;
    return res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { email, password, role = 'customer', name, phone, address, ...meta } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.find('users', u => u.email?.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }

    const userId = `usr-${role === 'seller' ? 'seller' : role === 'delivery' ? 'del' : 'cust'}-${Date.now()}`;
    const farmId = role === 'seller' ? `farm-${(meta.farmName || name).toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined;

    const newUser = {
      id: userId,
      email: cleanEmail,
      password,
      role,
      name,
      phone: phone || '+91 98000 00000',
      avatar: '/images/users/avatar.jpg',
      walletBalance: role === 'customer' ? 500 : 0, // ₹500 welcome credit for new customers!
      bottlesReturnedTotal: 0,
      savedAddresses: address ? [
        {
          id: `addr-${Date.now()}`,
          tag: 'Home',
          isDefault: true,
          name,
          phone,
          house: address.house || 'Doorstep',
          street: address.street || '',
          area: address.area || 'Bengaluru',
          city: address.city || 'Bengaluru',
          state: 'Karnataka',
          pincode: address.pincode || '560102',
          instructions: address.instructions || 'Leave in insulated doorstep bag.'
        }
      ] : [],
      createdAt: new Date().toISOString(),
      ...(role === 'seller' && {
        farmId,
        farmName: meta.farmName || `${name}'s Dairy Pasture`,
        fssaiLicense: meta.fssaiLicense || '11223344556677',
        location: meta.location || 'Coimbatore, Tamil Nadu',
        district: meta.district || 'Coimbatore',
        state: meta.state || 'Tamil Nadu',
        pincode: meta.pincode || '641109',
        sellerType: meta.sellerType || 'Organic Dairy Farmer',
        rating: 5.0
      }),
      ...(role === 'delivery' && {
        vehicleType: meta.vehicleType || 'Electric Chilled EV Van (KA01-EK-4501)',
        route: meta.route || 'Route 4B - Morning Sunrise Fleet',
        shift: 'Sunrise Run (5:30 AM – 7:30 AM)',
        rating: 5.0,
        completedDeliveries: 0,
        bottlesCollectedCount: 0
      })
    };

    db.insert('users', newUser);

    // If seller, create corresponding farm profile
    if (role === 'seller') {
      const newFarm = {
        id: farmId,
        sellerId: userId,
        name: meta.farmName || `${name}'s Dairy Pasture`,
        ownerName: name,
        description: meta.description || `Pure and ethical dairy farm producing chemical-free, farm-fresh milk and artisan dairy.`,
        address: meta.location || 'Farmland Pastures',
        village: meta.district || 'Coimbatore',
        district: meta.district || 'Coimbatore',
        state: meta.state || 'Tamil Nadu',
        pincode: meta.pincode || '641109',
        phone: phone || '+91 94432 10987',
        email: cleanEmail,
        farmType: meta.sellerType || 'Organic & Natural',
        productsProduced: ["A2 Milk", "Raw Whole Milk", "Curd", "Ghee"],
        verificationStatus: "Verified",
        rating: 5.0,
        reviewCount: 0,
        totalOrders: 0,
        coverImage: "/images/farms/cover-green-valley.jpg",
        logo: "/images/milk-bottle.svg",
        galleryImages: [
          { id: `ph-${Date.now()}-1`, url: "/images/farms/cover-green-valley.jpg", caption: "Farm pastures", category: "Farm" },
          { id: `ph-${Date.now()}-2`, url: "/images/hero/hero-1.jpg", caption: "Our indigenous herd", category: "Cattle" }
        ],
        fssaiLicense: meta.fssaiLicense || "11223344556677",
        cattleCount: Number(meta.cattleCount || 25),
        dailyCapacityLiters: Number(meta.dailyCapacityLiters || 200)
      };
      db.insert('farms', newFarm);

      // Create welcome notification
      db.insert('notifications', {
        id: `notif-${Date.now()}`,
        sellerId: userId,
        title: "Welcome to MilkMart Producer Hub!",
        message: `Your farm '${newFarm.name}' has been created and verified. You can now add your dairy SKUs.`,
        type: "verified",
        link: "/seller/farm",
        timestamp: "Just now",
        read: false
      });
    }

    const token = signToken(newUser);
    const { password: _, ...safeUser } = newUser;
    return res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const { password: _, ...safeUser } = req.user;
  return res.json({ success: true, user: safeUser });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, (req, res) => {
  try {
    const updates = req.body;
    delete updates.id;
    delete updates.password;
    delete updates.role; // Prevent role hijacking

    const updated = db.update('users', req.user.id, updates);
    const { password: _, ...safeUser } = updated;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// PUT /api/auth/password
router.put('/password', authenticate, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }
    if (req.user.password !== currentPassword) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    db.update('users', req.user.id, { password: newPassword });
    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

// OTP Storage Map
const otpStore = new Map();

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Mobile number or email is required.' });
    }

    const clean = identifier.trim().toLowerCase();
    const isEmail = clean.includes('@');
    const otp = clean === '9845012345' || clean.includes('example.com') ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(clean, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log(`\n📲 [OTP DISPATCH] Verification code for ${clean}: ${otp} (Via ${isEmail ? 'Email' : 'WhatsApp/SMS'})\n`);

    return res.json({
      success: true,
      message: `6-digit verification code sent to ${clean} via ${isEmail ? 'Email' : 'SMS & WhatsApp'}.`,
      demoOtp: otp,
      expiresIn: 300
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  try {
    const { identifier, otp, role = 'customer', name } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile/Email and 6-digit OTP code are required.' });
    }

    const clean = identifier.trim().toLowerCase();
    const cleanDigits = clean.replace(/\D/g, '');
    const entry = otpStore.get(clean);

    // Accept master test code 123456 or matching OTP
    const isValid = otp === '123456' || (entry && entry.otp === otp && entry.expiresAt > Date.now());
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Use 123456 or request a new one.' });
    }

    let user = db.find('users', u => 
      u.email?.toLowerCase() === clean || 
      (cleanDigits.length >= 10 && u.phone?.replace(/\D/g, '').endsWith(cleanDigits.slice(-10)))
    );

    if (!user) {
      const isEmail = clean.includes('@');
      const userId = `usr-cust-${Date.now()}`;
      user = {
        id: userId,
        email: isEmail ? clean : `user_${cleanDigits.slice(-6)}@milkmart.farm`,
        phone: !isEmail ? clean : '+91 98000 00000',
        password: 'password123',
        name: name || (isEmail ? clean.split('@')[0] : `Customer ${cleanDigits.slice(-4)}`),
        role: role || 'customer',
        avatar: '/images/users/avatar.jpg',
        walletBalance: 500,
        bottlesReturnedTotal: 0,
        savedAddresses: [],
        createdAt: new Date().toISOString()
      };
      db.insert('users', user);
    }

    const token = signToken(user);
    const { password: _, ...safeUser } = user;
    otpStore.delete(clean);

    return res.json({
      success: true,
      message: 'OTP verified successfully! Welcome to MilkMart.',
      token,
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'OTP verification failed.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = db.find('users', u => u.email?.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No MilkMart account found with this email.' });
    }

    if (newPassword) {
      db.update('users', user.id, { password: newPassword });
      return res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
    }

    return res.json({ success: true, message: 'Verification link sent to your registered email.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to process password recovery.' });
  }
});

export default router;
