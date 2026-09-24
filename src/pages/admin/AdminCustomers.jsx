import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Wallet, RefreshCcw } from 'lucide-react';

export const AdminCustomers = () => {
  const { currentUser } = useAuth();

  const mockCustomers = [
    {
      id: "CUST-101",
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      joined: "Aug 2026",
      walletBalance: currentUser.walletBalance,
      bottlesReturned: currentUser.bottlesReturnedTotal,
      activeSubs: 2,
      lifetimeOrders: 14
    },
    {
      id: "CUST-102",
      name: "Meenakshi Sundaram",
      email: "meenakshi@example.com",
      phone: "+91 94480 11223",
      joined: "Jul 2026",
      walletBalance: 840,
      bottlesReturned: 24,
      activeSubs: 1,
      lifetimeOrders: 28
    },
    {
      id: "CUST-103",
      name: "Vikram Malhotra",
      email: "vikram.m@example.com",
      phone: "+91 98200 44556",
      joined: "Aug 2026",
      walletBalance: 420,
      bottlesReturned: 12,
      activeSubs: 1,
      lifetimeOrders: 9
    },
    {
      id: "CUST-104",
      name: "Ananya Deshmukh",
      email: "ananya.d@example.com",
      phone: "+91 97654 33221",
      joined: "Jun 2026",
      walletBalance: 1100,
      bottlesReturned: 38,
      activeSubs: 3,
      lifetimeOrders: 42
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
          Household Customers &amp; Eco-Wallet Directory
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
          Overview of registered household subscribers, glass bottle return scores, and wallet credit balances
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E6DEC9',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF5EE', borderBottom: '1px solid #E6DEC9', color: '#183626' }}>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Subscriber</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Phone &amp; Email</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Eco-Wallet Balance</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Bottles Returned</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Active Plans</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1EDE3' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '700', color: '#183626' }}>{c.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#798C80' }}>ID: {c.id} • Joined {c.joined}</div>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#55685C' }}>
                    <div>{c.phone}</div>
                    <div style={{ fontSize: '0.76rem', color: '#798C80' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontWeight: '700', color: '#A26D24', fontSize: '0.94rem' }}>
                      ₹{c.walletBalance}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ color: '#196D3D', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <RefreshCcw size={13} /> {c.bottlesReturned} Bottles
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#183626', fontWeight: '600' }}>
                    {c.activeSubs} Plans
                  </td>
                  <td style={{ padding: '14px 18px', color: '#55685C' }}>
                    {c.lifetimeOrders} Deliveries
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
