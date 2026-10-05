import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Store } from '../data/store';
import { initialAddresses } from '../data/mockAddresses';

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
  const login = (email, password, expectedRole = null) => {
    const found = Store.findUser(email, password, expectedRole);
    if (!found) {
      // Check if user exists with wrong password or role
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

  // Signup handler
  const signup = (userData, signupRole = 'customer') => {
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
      walletBalance: signupRole === 'customer' ? 500 : 0, // ₹500 welcome bonus for customer!
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
  const addWalletBalance = (amount, title = 'Wallet Top-Up', description = 'Added funds via UPI') => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0 || !user) return false;
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

  const updateProfile = (profileData) => {
    if (!user) return;
    const updated = { ...user, ...profileData };
    Store.saveUser(updated);
    Store.setSessionUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user, // backwards compatibility
        role,
        activePortal: role || 'customer', // backwards compatibility
        isAuthenticated,
        login,
        signup,
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
