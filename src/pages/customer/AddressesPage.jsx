import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AddressesPage = () => {
  const { currentUser, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [tag, setTag] = useState('Home');
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560102');
  const [instructions, setInstructions] = useState('Leave in insulated doorstep bag. Ring bell once softly.');

  const openAddModal = () => {
    setEditingId(null);
    setTag('Home');
    setName(currentUser.name);
    setPhone(currentUser.phone);
    setHouse('');
    setStreet('');
    setArea('');
    setCity('Bengaluru');
    setState('Karnataka');
    setPincode('560102');
    setInstructions('Leave in insulated doorstep bag.');
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr.id);
    setTag(addr.tag);
    setName(addr.name);
    setPhone(addr.phone);
    setHouse(addr.house);
    setStreet(addr.street);
    setArea(addr.area);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setInstructions(addr.instructions || '');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!house || !street) {
      showToast("Please fill house and street info", "error");
      return;
    }

    const payload = { tag, name, phone, house, street, area, city, state, pincode, instructions };

    if (editingId) {
      updateAddress(editingId, payload);
      showToast("Address updated successfully!");
    } else {
      addAddress(payload);
      showToast("New delivery address added!");
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '36px 0 70px 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>
            <ArrowLeft size={16} /> Back to My Account
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
              Doorstep Delivery Addresses
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#55685C', marginTop: '4px' }}>
              Where our morning partners should drop off chilled glass bottles before 7:30 AM
            </p>
          </div>

          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add Address
          </button>
        </div>

        {/* Address Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {currentUser.savedAddresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: addr.isDefault ? '2px solid #183626' : '1px solid #E6DEC9',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    backgroundColor: '#183626',
                    color: '#FAF7F2',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '6px'
                  }}>
                    {addr.tag}
                  </span>

                  {addr.isDefault ? (
                    <span style={{ fontSize: '0.74rem', color: '#196D3D', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> Default
                    </span>
                  ) : (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      style={{ fontSize: '0.75rem', color: '#8E5A17', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#183626', marginBottom: '2px' }}>
                  {addr.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#798C80', marginBottom: '10px' }}>
                  {addr.phone}
                </div>

                <div style={{ fontSize: '0.86rem', color: '#55685C', lineHeight: 1.5, marginBottom: '12px' }}>
                  {addr.house}, {addr.street}<br />
                  {addr.area}, {addr.city} - {addr.pincode}
                </div>

                {addr.instructions && (
                  <div style={{ backgroundColor: '#FAF5EE', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#8E5A17' }}>
                    <strong>Instructions:</strong> {addr.instructions}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', borderTop: '1px solid #F1EDE3', paddingTop: '12px' }}>
                <button
                  onClick={() => openEditModal(addr)}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1 }}
                >
                  <Edit2 size={13} /> Edit
                </button>
                {currentUser.savedAddresses.length > 1 && (
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#B2341A' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Add/Edit Address */}
        {isModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
              <form onSubmit={handleSave} style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#183626', marginBottom: '16px' }}>
                  {editingId ? "Edit Delivery Address" : "Add Doorstep Delivery Location"}
                </h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  {['Home', 'Work', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: tag === t ? '2px solid #183626' : '1px solid #E6DEC9',
                        backgroundColor: tag === t ? '#FAF5EE' : '#FFFFFF',
                        fontWeight: '700',
                        fontSize: '0.86rem',
                        color: '#183626'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="text" placeholder="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <input type="text" placeholder="Flat, House No., Building Name" required value={house} onChange={(e) => setHouse(e.target.value)} style={{ width: '100%' }} />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <input type="text" placeholder="Street Name, Main Road, Landmark" required value={street} onChange={(e) => setStreet(e.target.value)} style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                  <input type="text" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  <input type="text" placeholder="Pincode" required value={pincode} onChange={(e) => setPincode(e.target.value)} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Morning Doorstep Drop Instructions
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Leave in pouch, ring bell softly once"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Address
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
