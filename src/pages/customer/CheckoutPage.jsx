import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { 
  MapPin, Clock, CreditCard, ShieldCheck, 
  CheckCircle2, Plus, Wallet, Sparkles, QrCode 
} from 'lucide-react';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, subtotal, discountAmount, deliveryFee, 
    bottleDeposit, finalTotal, totalTaxableValue, totalGstAmount, 
    cgstAmount, sgstAmount, hsnBreakdown, clearCart 
  } = useCart();
  const { currentUser, addAddress, deductWalletBalance } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [deliverySlot, setDeliverySlot] = useState("Morning Run: 5:30 AM – 7:30 AM");
  const [instructions, setInstructions] = useState("Leave in insulated doorstep pouch hanging on door handle. Silent morning drop.");
  const [isSilentDelivery, setIsSilentDelivery] = useState(true);
  const [pouchPlacement, setPouchPlacement] = useState("Hanging on main door handle");
  const [isB2bInvoice, setIsB2bInvoice] = useState(false);
  const [b2bGstin, setB2bGstin] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MilkMart Wallet");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // New address form state
  const [newTag, setNewTag] = useState("Home");
  const [newName, setNewName] = useState(currentUser.name);
  const [newPhone, setNewPhone] = useState(currentUser.phone);
  const [newHouse, setNewHouse] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newCity, setNewCity] = useState("Bengaluru");
  const [newState, setNewState] = useState("Karnataka");
  const [newPincode, setNewPincode] = useState("560102");

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Your Milk Basket is empty</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Shop Dairy Catalog
        </button>
      </div>
    );
  }

  const handleCreateAddress = (e) => {
    e.preventDefault();
    if (!newHouse || !newStreet) {
      showToast("Please fill in house and street details", "error");
      return;
    }
    const created = addAddress({
      tag: newTag,
      name: newName,
      phone: newPhone,
      house: newHouse,
      street: newStreet,
      area: newArea,
      city: newCity,
      state: newState,
      pincode: newPincode,
      instructions: instructions
    });
    setIsAddingAddress(false);
    showToast(`New address '${newTag}' added!`);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (paymentMethod === 'MilkMart Wallet' && currentUser.walletBalance < finalTotal) {
      showToast(`Insufficient wallet balance (Available: ₹${currentUser.walletBalance}). Please choose UPI or top up.`, 'error');
      return;
    }

    if (paymentMethod === 'MilkMart Wallet') {
      deductWalletBalance(finalTotal);
    }

    const chosenAddr = currentUser.savedAddresses[selectedAddressIndex] || currentUser.savedAddresses[0];

    const result = placeOrder({
      items: cartItems,
      deliveryAddress: chosenAddr,
      timeSlot: deliverySlot,
      paymentMethod,
      subtotal,
      discount: discountAmount,
      deliveryFee,
      bottleDeposit,
      total: finalTotal,
      taxableValue: totalTaxableValue,
      gstAmount: totalGstAmount,
      cgst: cgstAmount,
      sgst: sgstAmount,
      hsnBreakdown,
      instructions: `${instructions} • Placement: ${pouchPlacement} • ${isSilentDelivery ? 'Silent Delivery (No doorbell)' : 'Doorbell OK'}`,
      isSilentDelivery,
      b2bGstin: isB2bInvoice ? b2bGstin : null
    });

    if (result.success) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#183626', '#E8C582', '#A26D24', '#FAF7F2']
        });
      } catch (err) {
        // Confetti fallback safely ignored
      }

      clearCart();
      navigate(`/order-confirmation?orderId=${result.orderId}`);
    }
  };

  return (
    <div style={{ padding: '36px 0 70px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
            Sunrise Doorstep Checkout
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#55685C', marginTop: '4px' }}>
            Pure farm milk chilled in glass bottles delivered before sunrise
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* Left Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Step 1: Delivery Address */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E6DEC9',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#183626', color: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                      1
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#183626', margin: 0 }}>
                      Delivery Address
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.82rem',
                      color: '#8E5A17',
                      fontWeight: '700',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none'
                    }}
                  >
                    <Plus size={14} /> {isAddingAddress ? "Cancel" : "Add Address"}
                  </button>
                </div>

                {/* Add address subform */}
                {isAddingAddress && (
                  <div style={{
                    backgroundColor: '#FAF5EE',
                    border: '1px solid #E6DEC9',
                    borderRadius: '14px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ fontSize: '0.92rem', color: '#183626', marginBottom: '10px' }}>
                      Add New Delivery Location
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                      <input type="text" placeholder="Phone Number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" placeholder="Flat / House / Villa No." value={newHouse} onChange={(e) => setNewHouse(e.target.value)} />
                      <input type="text" placeholder="Street / Society / Apartment Name" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                      <input type="text" placeholder="Area" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
                      <input type="text" placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
                      <input type="text" placeholder="Pincode" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} />
                    </div>
                    <button type="button" onClick={handleCreateAddress} className="btn btn-primary btn-sm">
                      Save &amp; Use Address
                    </button>
                  </div>
                )}

                {/* Address selection cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentUser.savedAddresses.map((addr, idx) => (
                    <label
                      key={addr.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '14px',
                        borderRadius: '12px',
                        border: selectedAddressIndex === idx ? '2px solid #183626' : '1px solid #E6DEC9',
                        backgroundColor: selectedAddressIndex === idx ? '#FAF5EE' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={selectedAddressIndex === idx}
                        onChange={() => setSelectedAddressIndex(idx)}
                        style={{ marginTop: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{
                            backgroundColor: '#183626',
                            color: '#FAF7F2',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {addr.tag}
                          </span>
                          <strong style={{ fontSize: '0.92rem', color: '#183626' }}>{addr.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#798C80' }}>• {addr.phone}</span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#55685C' }}>
                          {addr.house}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Morning Time Slot & Instructions */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E6DEC9',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#183626', color: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                    2
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#183626', margin: 0 }}>
                    Morning Run Slot &amp; Doorstep Instructions
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '18px' }}>
                  {[
                    { slot: "Morning Run: 5:30 AM – 7:30 AM", label: "Standard Sunrise Run", desc: "Silent doorstep drop" },
                    { slot: "Early Bird: 5:00 AM – 6:30 AM", label: "Early Bird Run", desc: "First batch delivery" },
                    { slot: "Evening Drop: 5:30 PM – 7:30 PM", label: "Evening Run", desc: "Dinner milk & paneer" }
                  ].map((s) => (
                    <div
                      key={s.slot}
                      onClick={() => setDeliverySlot(s.slot)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: deliverySlot === s.slot ? '2px solid #183626' : '1px solid #E6DEC9',
                        backgroundColor: deliverySlot === s.slot ? '#FAF5EE' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#183626' }}>{s.label}</div>
                      <div style={{ fontSize: '0.78rem', color: '#8E5A17', fontWeight: '600' }}>{s.slot}</div>
                      <div style={{ fontSize: '0.72rem', color: '#798C80', marginTop: '2px' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                    Doorstep Instructions for Delivery Partner
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Leave inside insulated bag, collect 2 empty glass bottles"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Silent Morning Protocol Toggle */}
                <div 
                  onClick={() => setIsSilentDelivery(!isSilentDelivery)}
                  style={{
                    marginTop: '16px',
                    backgroundColor: isSilentDelivery ? '#F0F9F4' : '#FAF7F2',
                    border: `1.5px solid ${isSilentDelivery ? '#196D3D' : '#E6DEC9'}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#183626' }}>
                      🌙 Silent Morning Delivery Protocol
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#55685C', marginTop: '2px' }}>
                      Delivery partner will quietly drop bottles in your pouch without ringing doorbell before 7:00 AM.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSilentDelivery}
                    onChange={(e) => setIsSilentDelivery(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>

                {/* Doorstep Pouch Placement */}
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                    Doorstep Thermal Bag Placement:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                    {['Hanging on main door handle', 'Inside doorstep insulated box', 'Apartment reception / Guard'].map((p) => (
                      <div
                        key={p}
                        onClick={() => setPouchPlacement(p)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          border: pouchPlacement === p ? '1.5px solid #183626' : '1px solid #E6DEC9',
                          backgroundColor: pouchPlacement === p ? '#FAF5EE' : '#FFFFFF',
                          cursor: 'pointer',
                          color: '#183626'
                        }}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E6DEC9',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#183626', color: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                    3
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#183626', margin: 0 }}>
                    Payment Method
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* MilkMart Wallet Option */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: paymentMethod === 'MilkMart Wallet' ? '2px solid #183626' : '1px solid #E6DEC9',
                    backgroundColor: paymentMethod === 'MilkMart Wallet' ? '#FAF5EE' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'MilkMart Wallet'}
                      onChange={() => setPaymentMethod('MilkMart Wallet')}
                    />
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#FDF4E3',
                      color: '#8E5A17',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Wallet size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.92rem', color: '#183626' }}>MilkMart Wallet</strong>
                        <span style={{ fontSize: '0.72rem', backgroundColor: '#E8F5EE', color: '#196D3D', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          Instant 1-Click
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#798C80' }}>
                        Available Balance: <strong>₹{currentUser.walletBalance}</strong> (Auto-deducts ₹{finalTotal})
                      </div>
                    </div>
                  </label>

                  {/* UPI */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: paymentMethod === 'UPI' ? '2px solid #183626' : '1px solid #E6DEC9',
                    backgroundColor: paymentMethod === 'UPI' ? '#FAF5EE' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                    />
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#E8F5EE',
                      color: '#196D3D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <QrCode size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.92rem', color: '#183626' }}>UPI (Google Pay / PhonePe / Paytm)</strong>
                      <div style={{ fontSize: '0.82rem', color: '#798C80' }}>Simulated instant QR &amp; app checkout</div>
                    </div>
                  </label>

                  {/* Debit/Credit Card */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: paymentMethod === 'Card' ? '2px solid #183626' : '1px solid #E6DEC9',
                    backgroundColor: paymentMethod === 'Card' ? '#FAF5EE' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                    />
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#EBF4F9',
                      color: '#0E587B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CreditCard size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.92rem', color: '#183626' }}>Credit / Debit Card</strong>
                      <div style={{ fontSize: '0.82rem', color: '#798C80' }}>Visa, Mastercard, RuPay cards accepted</div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: paymentMethod === 'COD' ? '2px solid #183626' : '1px solid #E6DEC9',
                    backgroundColor: paymentMethod === 'COD' ? '#FAF5EE' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#F1EDE3',
                      color: '#55685C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      💵
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.92rem', color: '#183626' }}>Cash on Doorstep Delivery</strong>
                      <div style={{ fontSize: '0.82rem', color: '#798C80' }}>Pay during morning delivery run</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Summary Box */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E6DEC9',
              padding: '26px',
              boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: '#183626', marginBottom: '16px' }}>
                Order Receipt ({cartItems.length} Products)
              </h3>

              {/* Items overview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', maxHeight: '200px', overflowY: 'auto' }}>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                    <span style={{ color: '#183626' }}>
                      {item.quantity}x {item.name} ({item.size})
                    </span>
                    <strong style={{ color: '#183626' }}>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              {/* Price summary lines */}
              <div style={{ borderTop: '1px solid #F1EDE3', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E5A17', fontWeight: '600' }}>
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                  <span>Sunrise Delivery</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: '#196D3D' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
                  <span>Glass Bottle Deposit</span>
                  <span style={{ color: '#196D3D', fontWeight: '600' }}>₹0 (Waived)</span>
                </div>

                {/* GST Tax Summary Pill */}
                <div style={{
                  backgroundColor: '#FAF7F2',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  border: '1px solid #E6DEC9',
                  marginTop: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '3px' }}>
                    <span>GST (CGST + SGST Included):</span>
                    <span>₹{totalGstAmount}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#55685C', lineHeight: 1.4 }}>
                    Taxable Value: ₹{totalTaxableValue} • CGST: ₹{cgstAmount} • SGST: ₹{sgstAmount}
                  </div>
                </div>

                {/* Optional B2B Business Invoice Claim */}
                <div style={{ marginTop: '8px', borderTop: '1px dashed #E6DEC9', paddingTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '600', color: '#183626', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isB2bInvoice}
                      onChange={(e) => setIsB2bInvoice(e.target.checked)}
                    />
                    Claim B2B GST Input Credit (GSTIN)
                  </label>
                  {isB2bInvoice && (
                    <input
                      type="text"
                      value={b2bGstin}
                      onChange={(e) => setB2bGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 29AABCM8491K1Z2"
                      style={{ marginTop: '6px', width: '100%', fontSize: '0.8rem', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E6DEC9' }}
                    />
                  )}
                </div>

                <div style={{
                  borderTop: '1px solid #E6DEC9',
                  paddingTop: '12px',
                  marginTop: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#183626'
                }}>
                  <span>Final Total</span>
                  <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px', marginBottom: '12px' }}
              >
                <CheckCircle2 size={18} /> Confirm &amp; Place Sunrise Order
              </button>

              <div style={{ fontSize: '0.78rem', color: '#798C80', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#196D3D" />
                <span>Simulated instant order placement with live tracking</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
