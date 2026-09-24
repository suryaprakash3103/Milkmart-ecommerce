import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { QuantitySelector } from '../common/QuantitySelector';
import { useNavigate } from 'react-router-dom';

export const SubscriptionModal = ({ product, defaultSize = null, isOpen, onClose }) => {
  const { addSubscription } = useSubscription();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [size, setSize] = useState(() => defaultSize || (product ? product.size : '1 L'));
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState('Daily');
  const [timeSlot, setTimeSlot] = useState('Morning Run: 5:30 AM – 7:30 AM');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [instructions, setInstructions] = useState('Leave in insulated doorstep bag. Ring bell once softly.');

  if (!isOpen || !product) return null;

  // Variant calculation
  let basePrice = product.price;
  if (product.availableSizes) {
    const matched = product.availableSizes.find((v) => v.size === size);
    if (matched) basePrice = matched.price;
  }

  const discountedDailyPrice = Number((basePrice * 0.9 * quantity).toFixed(1));
  const fullDailyPrice = basePrice * quantity;
  const monthlySavings = Math.round((fullDailyPrice - discountedDailyPrice) * 30);

  const handleConfirmSubscription = (e) => {
    e.preventDefault();
    const addr = currentUser.savedAddresses[selectedAddressIndex] || currentUser.savedAddresses[0];

    addSubscription({
      product,
      size,
      quantity,
      frequency,
      timeSlot,
      deliveryAddress: addr,
      instructions
    });

    onClose();
    navigate('/subscriptions');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '22px 24px',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: '#FAF7F2',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E8C582', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Calendar size={15} />
            <span>MilkMart Daily Farmstead Plan</span>
          </div>

          <h3 style={{ color: '#FAF7F2', fontSize: '1.35rem', margin: 0 }}>
            Start Morning Doorstep Milk Plan
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#D5DFC8' }}>
            Delivered cold before sunrise with 10% daily savings and zero commitment. Pause or skip anytime.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleConfirmSubscription} style={{ padding: '24px' }}>
          {/* Selected Product summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#FAF5EE',
            border: '1px solid #E6DEC9',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.96rem', fontWeight: '700', color: '#183626' }}>
                {product.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#798C80' }}>
                {product.brand} • {product.fatContent}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#A26D24' }}>
                ₹{discountedDailyPrice}/day
              </div>
              <div style={{ fontSize: '0.74rem', color: '#196D3D', fontWeight: '600' }}>
                10% Off Applied
              </div>
            </div>
          </div>

          {/* Size Variant Selector */}
          {product.availableSizes && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
                Bottle Size
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.availableSizes.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    onClick={() => setSize(v.size)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: size === v.size ? '700' : '500',
                      backgroundColor: size === v.size ? '#183626' : '#FAF7F2',
                      color: size === v.size ? '#FAF7F2' : '#55685C',
                      border: size === v.size ? '1.5px solid #183626' : '1px solid #E6DEC9',
                      cursor: 'pointer'
                    }}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
              Daily Bottles
            </label>
            <QuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              onIncrease={() => setQuantity(quantity + 1)}
            />
          </div>

          {/* Frequency Options */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
              Delivery Frequency
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['Daily', 'Alternate Day', 'Weekly'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: frequency === freq ? '700' : '500',
                    backgroundColor: frequency === freq ? '#FAF5EE' : '#FFFFFF',
                    color: frequency === freq ? '#183626' : '#55685C',
                    border: frequency === freq ? '2px solid #183626' : '1px solid #E6DEC9',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Morning Window notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#E8F5EE',
            border: '1px solid rgba(25, 109, 61, 0.25)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '18px',
            fontSize: '0.82rem',
            color: '#196D3D'
          }}>
            <Clock size={16} />
            <span>
              <strong>Morning Run: 5:30 AM – 7:30 AM.</strong> Placed quietly inside your doorstep thermal pouch.
            </span>
          </div>

          {/* Address selection */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
              Delivery Address
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentUser.savedAddresses.map((addr, idx) => (
                <label
                  key={addr.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: selectedAddressIndex === idx ? '2px solid #183626' : '1px solid #E6DEC9',
                    backgroundColor: selectedAddressIndex === idx ? '#FAF5EE' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="subAddress"
                    checked={selectedAddressIndex === idx}
                    onChange={() => setSelectedAddressIndex(idx)}
                  />
                  <div style={{ fontSize: '0.84rem' }}>
                    <strong>{addr.tag}:</strong> {addr.house}, {addr.street}, {addr.city}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Doorstep note */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
              Doorstep Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Leave in bag, don't ring doorbell"
              style={{ width: '100%' }}
            />
          </div>

          {/* Monthly Savings summary banner */}
          <div style={{
            backgroundColor: '#FDF4E3',
            border: '1px solid rgba(142, 90, 23, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8E5A17', fontSize: '0.85rem', fontWeight: '700' }}>
              <Sparkles size={16} /> Estimated Monthly Savings:
            </div>
            <div style={{ fontWeight: '800', color: '#8E5A17', fontSize: '1.05rem' }}>
              ₹{monthlySavings} / month
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <CheckCircle2 size={18} /> Confirm Morning Subscription
          </button>
        </form>
      </div>
    </div>
  );
};
