import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Store } from '../data/store';
import { initialAddresses } from '../data/mockAddresses';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store initialization
  useEffect(() => {
    Store.init();
  }, []);

  const [user, setUser] = useState(() => {
    return Store.getSessionUser();
  });

  // Keep state synced if localStorage changes or custom event fires
  const syncFromStorage = useCallback(() => {
    const session = Store.getSessionUser();
    setUser(session);
  }, []);

  useEffect(() => {
    const handleSync = (e) => {
      if (!e.detail || e.detail.key === 'milkmart_session_user' || e.detail.key === 'milkmart_users') {
        syncFromStorage();
      }
    };
    window.addEventListener('milkmart:datasync', handleSync);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('milkmart:datasync', handleSync);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, [syncFromStorage]);

  const role = user?.role || null;
  const isAuthenticated = !!user;

  // Login handler
  const login = async (email, password, expectedRole = null) => {
    try {
      const res = await api.auth.login(email, password, expectedRole);
      if (res.success && res.user) {
        Store.saveUser(res.user);
        Store.setSessionUser(res.user);
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      console.warn('API login failed, checking local Store:', apiErr.message);
    }

    // Local fallback
    const found = Store.findUser(email, password, expectedRole);
    if (!found) {
      const userWithEmail = Store.findUserByEmail(email);
      if (!userWithEmail) {
        return { success: false, message: 'No MilkMart account found with this email.' };
      }
      if (expectedRole && userWithEmail.role !== expectedRole) {
        return { success: false, message: `Account exists as ${userWithEmail.role}, not ${expectedRole}.` };
      }
      return { success: false, message: 'Incorrect password. Try password123 or admin123.' };
    }

    Store.setSessionUser(found);
    setUser(found);
    return { success: true, user: found };
  };

  // OTP handlers
  const sendOtp = async (identifier) => {
    try {
      const res = await api.auth.sendOtp(identifier);
      return res;
    } catch (err) {
      return {
        success: true,
        message: `Verification code sent to ${identifier}`,
        demoOtp: '123456',
        expiresIn: 300
      };
    }
  };

  const verifyOtp = async (identifier, otp, otpRole = 'customer', name = '') => {
    try {
      const res = await api.auth.verifyOtp(identifier, otp, otpRole, name);
      if (res.success && res.user) {
        Store.saveUser(res.user);
        Store.setSessionUser(res.user);
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn('API verifyOtp fallback:', err.message);
    }

    // Master test code fallback
    if (otp === '123456') {
      const clean = identifier.trim().toLowerCase();
      let found = Store.findUserByEmail(clean) || Store.getUsers().find(u => u.phone && u.phone.includes(clean.replace(/\D/g, '')));
      if (!found) {
        found = {
          id: `usr-${Date.now()}`,
          name: name || (clean.includes('@') ? clean.split('@')[0] : 'MilkMart Member'),
          email: clean.includes('@') ? clean : `${clean.replace(/\D/g, '')}@milkmart.farm`,
          phone: clean.includes('@') ? '+91 98450 12345' : clean,
          role: otpRole,
          walletBalance: 500,
          bottlesReturnedTotal: 0,
          savedAddresses: initialAddresses
        };
        Store.saveUser(found);
      }
      Store.setSessionUser(found);
      setUser(found);
      return { success: true, user: found };
    }

    return { success: false, message: 'Invalid OTP code. Please enter 123456 or resend code.' };
  };

  // Signup handler
  const signup = async (userData, signupRole = 'customer') => {
    try {
      const res = await api.auth.register({
        ...userData,
        role: signupRole
      });
      if (res.success && res.user) {
        Store.saveUser(res.user);
        Store.setSessionUser(res.user);
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      console.warn('API signup failed, saving to local Store:', apiErr.message);
    }

    // Local fallback
    const existing = Store.findUserByEmail(userData.email);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      role: signupRole,
      name: userData.name,
      phone: userData.phone || '+91 98000 00000',
      avatar: '/images/users/avatar.jpg',
      walletBalance: signupRole === 'customer' ? 500 : 0,
      bottlesReturnedTotal: 0,
      savedAddresses: userData.address ? [
        {
          id: `addr-${Date.now()}`,
          tag: 'Home',
          isDefault: true,
          name: userData.name,
          phone: userData.phone,
          house: userData.address.house || 'Doorstep',
          street: userData.address.street || '',
          area: userData.address.area || 'Bengaluru',
          city: userData.address.city || 'Bengaluru',
          state: 'Karnataka',
          pincode: userData.address.pincode || '560102',
          instructions: userData.address.instructions || 'Leave in insulated doorstep bag.'
        }
      ] : initialAddresses,
      vehicleType: userData.vehicleType || (signupRole === 'delivery' ? 'Electric Chilled EV Van' : undefined),
      route: userData.route || (signupRole === 'delivery' ? 'Route 4B - Morning Sunrise Fleet' : undefined),
      farmName: userData.farmName || (signupRole === 'seller' ? 'Organic Dairy Pasture' : undefined),
      fssaiLicense: userData.fssaiLicense || (signupRole === 'seller' ? '11223344556677' : undefined),
      cattleCount: userData.cattleCount || (signupRole === 'seller' ? 30 : undefined),
      dailyCapacityLiters: userData.dailyCapacityLiters || (signupRole === 'seller' ? 250 : undefined),
      location: userData.location || (signupRole === 'seller' ? 'Kengeri Valley Dairy Pastures, Bengaluru West' : undefined),
      rating: signupRole === 'delivery' || signupRole === 'seller' ? 5.0 : undefined,
      completedDeliveries: 0,
      bottlesCollectedCount: 0
    };

    Store.saveUser(newUser);
    Store.setSessionUser(newUser);
    setUser(newUser);

    if (signupRole === 'customer') {
      Store.addWalletTransaction(newUser.id, {
        type: 'credit',
        amount: 500,
        title: 'Welcome Joining Bonus',
        description: 'MilkMart pure farm fresh welcome deposit credited'
      });
    }

    return { success: true, user: newUser };
  };

  // Logout handler
  const logout = () => {
    api.auth.logout();
    Store.clearSession();
    setUser(null);
  };

  // Fast switch for evaluators & navbar demo tools
  const switchRole = (newRole) => {
    const users = Store.getUsers();
    let target = users.find(u => u.role === newRole);
    if (!target) {
      if (newRole === 'admin') {
        target = {
          id: 'usr-admin-01',
          name: 'Aditi Rao (Operations Master)',
          email: 'admin@milkmart.farm',
          password: 'admin123',
          role: 'admin',
          avatar: '/images/users/avatar.jpg'
        };
      } else if (newRole === 'delivery') {
        target = {
          id: 'usr-del-01',
          name: 'Ramesh Kumar',
          email: 'ramesh.delivery@milkmart.farm',
          password: 'partner123',
          role: 'delivery',
          vehicleType: 'Chilled EV (KA01-EK-4501)',
          route: 'Route 4B - HSR & Koramangala'
        };
      } else if (newRole === 'seller') {
        target = {
          id: 'usr-seller-01',
          name: 'Devendra Patel',
          email: 'farmer.patel@milkmart.farm',
          password: 'farmer123',
          role: 'seller',
          farmName: 'Gir Amrit Organic Gaushala',
          walletBalance: 24500,
          location: 'Kengeri Valley Dairy Pastures, Bengaluru West',
          fssaiLicense: '11223344556677',
          cattleCount: 48,
          dailyCapacityLiters: 350
        };
      } else {
        target = {
          id: 'usr-cust-01',
          name: 'Surya Prakash',
          email: 'surya.prakash@example.com',
          password: 'password123',
          role: 'customer',
          walletBalance: 1250,
          savedAddresses: initialAddresses
        };
      }
    }
    Store.setSessionUser(target);
    setUser(target);
  };

  // Wallet operations
  const addWalletBalance = async (amount, title = 'Wallet Top-Up', description = 'Added funds via UPI') => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0 || !user) return false;

    try {
      const res = await api.wallet.topup(num, title);
      if (res?.balance !== undefined) {
        const updated = { ...user, walletBalance: res.balance };
        Store.saveUser(updated);
        Store.setSessionUser(updated);
        setUser(updated);
        return true;
      }
    } catch (e) {
      console.warn('Backend wallet topup fallback:', e.message);
    }

    Store.addWalletTransaction(user.id, {
      type: 'credit',
      amount: num,
      title,
      description
    });
    return true;
  };

  const deductWalletBalance = (amount, title = 'Order Payment', description = 'Deducted from wallet') => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0 || !user) return false;
    if ((user.walletBalance || 0) < num) return false;
    Store.addWalletTransaction(user.id, {
      type: 'debit',
      amount: num,
      title,
      description
    });
    return true;
  };

  // Address management
  const addAddress = (newAddress) => {
    if (!user) return null;
    const id = 'addr-' + Date.now();
    const created = { ...newAddress, id, isDefault: (user.savedAddresses || []).length === 0 };
    const updated = {
      ...user,
      savedAddresses: [...(user.savedAddresses || []), created]
    };
    Store.saveUser(updated);
    Store.setSessionUser(updated);
    setUser(updated);
    return created;
  };

  const updateAddress = (id, updatedFields) => {
    if (!user) return;
    const updated = {
      ...user,
      savedAddresses: (user.savedAddresses || []).map((a) =>
        a.id === id ? { ...a, ...updatedFields } : a
      )
    };
    Store.saveUser(updated);
    Store.setSessionUser(updated);
    setUser(updated);
  };

  const deleteAddress = (id) => {
    if (!user) return;
    const updated = {
      ...user,
      savedAddresses: (user.savedAddresses || []).filter((a) => a.id !== id)
    };
    Store.saveUser(updated);
    Store.setSessionUser(updated);
    setUser(updated);
  };

  const setDefaultAddress = (id) => {
    if (!user) return;
    const updated = {
      ...user,
      savedAddresses: (user.savedAddresses || []).map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    };
    Store.saveUser(updated);
    Store.setSessionUser(updated);
    setUser(updated);
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    try {
      await api.auth.updateProfile(profileData);
    } catch (e) {
      console.warn('Backend updateProfile fallback:', e.message);
    }
    const updated = { ...user, ...profileData };
    Store.saveUser(updated);
    Store.setSessionUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        role,
        activePortal: role || 'customer',
        isAuthenticated,
        login,
        signup,
        sendOtp,
        verifyOtp,
        logout,
        switchRole,
        setActivePortal: switchRole,
        addWalletBalance,
        deductWalletBalance,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
