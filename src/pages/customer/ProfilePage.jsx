import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  User, Wallet, MapPin, Package, Calendar, 
  Heart, RefreshCcw, ShieldCheck, Check, Edit2 
} from 'lucide-react';

export const ProfilePage = ({ onOpenWallet }) => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setIsEditing(false);
    showToast("Profile details updated successfully!");
  };

  return (
    <div style={{ padding: '36px 0 70px 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
            Household Dairy Account
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#55685C', marginTop: '4px' }}>
            Manage delivery addresses, daily subscriptions, and MilkMart wallet credits
          </p>
        </div>

        {/* User Card + Wallet Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* User Profile Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E6DEC9',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E6DEC9' }}
              />
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#183626', margin: 0 }}>
                  {currentUser.name}
                </h2>
                <div style={{ fontSize: '0.84rem', color: '#798C80' }}>
                  {currentUser.email}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#196D3D', fontWeight: '600', marginTop: '2px' }}>
                  {currentUser.phone}
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button type="submit" className="btn btn-primary btn-sm">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">Cancel</button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline-dark btn-sm"
                style={{ alignSelf: 'flex-start' }}
              >
                <Edit2 size={13} /> Edit Personal Details
              </button>
            )}
          </div>

          {/* MilkMart Eco-Wallet Card */}
          <div style={{
            backgroundColor: '#183626',
            color: '#FAF7F2',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(232, 197, 130, 0.3)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#E8C582', fontWeight: '700', textTransform: 'uppercase' }}>
                  MilkMart Eco-Pass
                </span>
                <Wallet size={20} color="#E8C582" />
              </div>

              <div style={{ fontSize: '0.84rem', color: '#D5DFC8' }}>Available Balance</div>
              <div style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '2.2rem',
                fontWeight: '700',
                color: '#E8C582',
                margin: '2px 0 12px 0'
              }}>
                ₹{currentUser.walletBalance}
              </div>

              <div style={{ fontSize: '0.82rem', color: '#FAF7F2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCcw size={14} color="#5CD685" />
                <span>{currentUser.bottlesReturnedTotal} Glass Bottles Returned (₹{currentUser.bottlesReturnedTotal * 10} credited)</span>
              </div>
            </div>

            <button
              onClick={onOpenWallet}
              className="btn btn-primary btn-sm"
              style={{ alignSelf: 'flex-start', marginTop: '16px' }}
            >
              Top Up / View Credits
            </button>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <Link
            to="/addresses"
            className="card-artisan"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FAF5EE', color: '#183626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.98rem' }}>Saved Addresses</div>
              <div style={{ fontSize: '0.8rem', color: '#798C80' }}>{currentUser.savedAddresses.length} Doorstep locations</div>
            </div>
          </Link>

          <Link
            to="/orders"
            className="card-artisan"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FAF5EE', color: '#183626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.98rem' }}>Order History</div>
              <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Receipts &amp; live tracking</div>
            </div>
          </Link>

          <Link
            to="/subscriptions"
            className="card-artisan"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FAF5EE', color: '#183626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.98rem' }}>Milk Subscriptions</div>
              <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Daily runs &amp; pause options</div>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="card-artisan"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FAF5EE', color: '#183626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.98rem' }}>Saved Favorites</div>
              <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Quick pantry re-orders</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
