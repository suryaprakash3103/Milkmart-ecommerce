import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialAddresses } from '../data/mockAddresses';

const AuthContext = createContext();

const defaultUser = {
  id: "usr-01",
  name: "Surya Prakash",
  email: "surya.prakash@example.com",
  phone: "+91 98450 12345",
  role: "customer", // 'customer' | 'admin' | 'delivery'
  avatar: "/images/users/avatar.jpg",
  walletBalance: 1250,
  bottlesReturnedTotal: 18,
  savedAddresses: initialAddresses
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('milkmart_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [activePortal, setActivePortal] = useState(() => {
    return localStorage.getItem('milkmart_portal') || 'customer';
  });

  useEffect(() => {
    localStorage.setItem('milkmart_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('milkmart_portal', activePortal);
  }, [activePortal]);

  // Wallet operations
  const addWalletBalance = (amount) => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return false;
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + num
    }));
    return true;
  };

  const deductWalletBalance = (amount) => {
    const num = Number(amount);
    if (currentUser.walletBalance < num) return false;
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - num
    }));
    return true;
  };

  // Address management
  const addAddress = (newAddress) => {
    const id = 'addr-' + Date.now();
    const created = { ...newAddress, id, isDefault: currentUser.savedAddresses.length === 0 };
    setCurrentUser((prev) => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, created]
    }));
    return created;
  };

  const updateAddress = (id, updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.map((a) =>
        a.id === id ? { ...a, ...updatedFields } : a
      )
    }));
  };

  const deleteAddress = (id) => {
    setCurrentUser((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter((a) => a.id !== id)
    }));
  };

  const setDefaultAddress = (id) => {
    setCurrentUser((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    }));
  };

  // Role switching
  const switchRole = (role) => {
    setActivePortal(role);
    if (role === 'admin') {
      setCurrentUser((prev) => ({
        ...prev,
        role: 'admin',
        name: 'Dairy Operations Master',
        email: 'ops@milkmart.farm'
      }));
    } else if (role === 'delivery') {
      setCurrentUser((prev) => ({
        ...prev,
        role: 'delivery',
        name: 'Ramesh Kumar (Route 4B)',
        email: 'ramesh.delivery@milkmart.farm'
      }));
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        role: 'customer',
        name: 'Surya Prakash',
        email: 'surya.prakash@example.com'
      }));
    }
  };

  const updateProfile = (profileData) => {
    setCurrentUser((prev) => ({ ...prev, ...profileData }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activePortal,
        setActivePortal,
        switchRole,
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
