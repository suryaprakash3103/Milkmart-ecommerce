import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, QrCode, Smartphone, CreditCard, Building2, 
  Wallet, Clock, ArrowRight, Lock, X, Check, CheckCircle2, 
  Sparkles, RefreshCw, AlertCircle, Banknote, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentGatewayModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  walletBalance, 
  onPaymentSuccess,
  customerName = "Surya Prakash",
  customerPhone = "+91 98450 12345"
}) => {
  // Tabs: 'upi' | 'card' | 'wallet' | 'netbanking' | 'cod'
  const [activeTab, setActiveTab] = useState('upi');

  // Checkout hold timer (15 minutes countdown)
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 59);

  // Flow states: 'idle' | 'authorizing' | 'otp_3ds' | 'processing' | 'success'
  const [gatewayState, setGatewayState] = useState('idle');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [upiIdError, setUpiIdError] = useState('');

  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(customerName);
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [bankOtp, setBankOtp] = useState('');

  // NetBanking state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // COD state
  const [codCaptcha, setCodCaptcha] = useState('');
  const [expectedCaptcha] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [codError, setCodError] = useState('');

  // Hold Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Live Card Brand Detection
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '');
    if (/^4/.test(clean)) return { brand: 'Visa', color: '#1A1F71' };
    if (/^5[1-5]/.test(clean)) return { brand: 'Mastercard', color: '#EB001B' };
    if (/^(60|65|81|82)/.test(clean)) return { brand: 'RuPay', color: '#097938' };
    if (/^3[47]/.test(clean)) return { brand: 'Amex', color: '#002663' };
    return { brand: 'Card', color: '#55685C' };
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  // Trigger Final Order Success
  const completeTransaction = (methodUsed, txId) => {
    setGatewayState('processing');

    setTimeout(() => {
      setGatewayState('success');
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#183626', '#E8C582', '#A26D24', '#28A745', '#FAF7F2']
        });
      } catch (e) {}

      setTimeout(() => {
        onPaymentSuccess({
          paymentMethod: methodUsed,
          transactionId: txId || `TXN-${Date.now().toString().slice(-8)}`,
          paidAmount: amount,
          status: 'SUCCESS'
        });
      }, 1400);
    }, 1200);
  };

  // UPI Handler
  const handlePayUpi = (app) => {
    setGatewayState('authorizing');
    setTimeout(() => {
      completeTransaction(`UPI (${app.toUpperCase()})`, `UPI-${Date.now().toString().slice(-8)}`);
    }, 1500);
  };

  const handlePayCustomUpi = (e) => {
    e.preventDefault();
    if (!upiId || !upiId.includes('@')) {
      setUpiIdError('Please enter a valid VPA / UPI ID (e.g. name@okhdfcbank)');
      return;
    }
    setUpiIdError('');
    setGatewayState('authorizing');
    setTimeout(() => {
      completeTransaction(`UPI (${upiId})`, `UPI-${Date.now().toString().slice(-8)}`);
    }, 1500);
  };

  // Card Handler
  const handleCardSubmit = (e) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      setCardError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setCardError('Please enter card expiry MM/YY.');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setCardError('Please enter 3-digit CVV.');
      return;
    }
    setCardError('');
    // Open 3D Secure Bank authentication overlay
    setGatewayState('otp_3ds');
  };

  const handleVerifyBankOtp = (e) => {
    e.preventDefault();
    completeTransaction(`${getCardBrand(cardNumber).brand} Card ending in ${cardNumber.slice(-4)}`, `CRD-${Date.now().toString().slice(-8)}`);
  };

  // Wallet Handler
  const handlePayWallet = () => {
    if (walletBalance < amount) return;
    setGatewayState('authorizing');
    setTimeout(() => {
      completeTransaction('MilkMart Eco-Wallet', `WLT-${Date.now().toString().slice(-8)}`);
    }, 1000);
  };

  // NetBanking Handler
  const handlePayNetBanking = () => {
    setGatewayState('authorizing');
    setTimeout(() => {
      completeTransaction(`NetBanking (${selectedBank})`, `NB-${Date.now().toString().slice(-8)}`);
    }, 1600);
  };

  // COD Handler
  const handlePayCod = (e) => {
    e.preventDefault();
    if (codCaptcha.trim() !== expectedCaptcha) {
      setCodError('Incorrect security code. Please enter the 4 digits shown.');
      return;
    }
    setCodError('');
    setGatewayState('authorizing');
    setTimeout(() => {
      completeTransaction('Cash on Delivery (Doorstep Bottle Exchange)', `COD-${Date.now().toString().slice(-8)}`);
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 35, 24, 0.72)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '780px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1.5px solid #E6DEC9',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '92vh',
        position: 'relative'
      }}>
        {/* Gateway Top Bar */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(232, 197, 130, 0.2)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.25rem', color: '#FAF7F2', fontWeight: '700' }}>
                MilkMart <span style={{ color: '#E8C582' }}>Pay</span>
              </span>
              <span style={{ 
                backgroundColor: 'rgba(232, 197, 130, 0.2)', 
                color: '#E8C582', 
                fontSize: '0.7rem', 
                fontWeight: '800', 
                padding: '2px 8px', 
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Lock size={11} /> 256-BIT SSL SECURE
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#CBD5CB', marginTop: '2px' }}>
              RBI-Compliant Tokenized Gateway • Instant Doorstep Allocation
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#E8C582', textTransform: 'uppercase', fontWeight: '700' }}>Amount to Pay</div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#FAF7F2', lineHeight: 1 }}>₹{amount}</div>
            </div>

            <button
              onClick={onClose}
              disabled={gatewayState !== 'idle'}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                color: '#FAF7F2',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: gatewayState === 'idle' ? 'pointer' : 'not-allowed'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Hold Timer Bar */}
        <div style={{
          backgroundColor: '#FAF5EE',
          borderBottom: '1px solid #E6DEC9',
          padding: '8px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#8E5A17'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} />
            <span>Sunrise milk batch reserved for: <strong>{formattedTimer}</strong></span>
          </div>
          <div style={{ color: '#196D3D', fontWeight: '700' }}>
            ✓ Verified Farm Producer Allocation
          </div>
        </div>

        {/* Gateway Body: 2 Columns (Tabs Left, Content Right) */}
        {gatewayState === 'idle' && (
          <div style={{ display: 'flex', flex: 1, minHeight: '440px', overflowY: 'auto' }}>
            {/* Left Nav Tabs */}
            <div style={{
              width: '240px',
              backgroundColor: '#FAF7F2',
              borderRight: '1px solid #E6DEC9',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {[
                { id: 'upi', name: 'UPI (QR & Apps)', sub: 'GPay, PhonePe, Paytm', icon: <QrCode size={18} />, badge: 'Free' },
                { id: 'card', name: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: <CreditCard size={18} /> },
                { id: 'wallet', name: 'MilkMart Eco-Wallet', sub: `Balance: ₹${walletBalance}`, icon: <Wallet size={18} />, badge: '1-Click' },
                { id: 'netbanking', name: 'NetBanking', sub: 'HDFC, SBI, ICICI & more', icon: <Building2 size={18} /> },
                { id: 'cod', name: 'Cash on Delivery', sub: 'Cash / Bottle Exchange', icon: <Banknote size={18} /> }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                      color: isSelected ? '#183626' : '#55685C',
                      boxShadow: isSelected ? '0 3px 10px rgba(0,0,0,0.06)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      color: isSelected ? '#183626' : '#798C80'
                    }}>
                      {tab.icon}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: isSelected ? '700' : '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tab.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#798C80', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tab.sub}
                      </div>
                    </div>
                    {tab.badge && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        backgroundColor: tab.badge === '1-Click' ? '#E8F5EE' : '#FDF4E3',
                        color: tab.badge === '1-Click' ? '#196D3D' : '#8E5A17',
                        padding: '2px 6px',
                        borderRadius: '6px'
                      }}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Content Panel */}
            <div style={{ flex: 1, padding: '24px 30px', overflowY: 'auto' }}>
              {/* TAB 1: UPI */}
              {activeTab === 'upi' && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#183626' }}>
                    Scan QR or Pay with UPI App
                  </h4>
                  <p style={{ margin: '0 0 18px 0', fontSize: '0.82rem', color: '#798C80' }}>
                    Zero transaction fee. Supported on all UPI 2.0 apps.
                  </p>

                  {/* QR Code Section */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    backgroundColor: '#FAF5EE',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: '1px solid #E6DEC9',
                    marginBottom: '20px'
                  }}>
                    {/* Simulated Dynamic MilkMart QR */}
                    <div style={{
                      width: '110px',
                      height: '110px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '8px',
                      border: '1px solid #CCD8D0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      flexShrink: 0
                    }}>
                      <QrCode size={80} color="#183626" />
                      <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#8E5A17', marginTop: '2px' }}>MILKMART-UPI</span>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#183626', textTransform: 'uppercase' }}>
                        Scan &amp; Pay ₹{amount}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#55685C', marginTop: '4px' }}>
                        Open Google Pay, PhonePe, Paytm, or BHIM on your phone and point camera to pay.
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePayUpi('QR')}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '10px', fontSize: '0.78rem' }}
                      >
                        <Check size={14} /> Simulate QR Payment Received
                      </button>
                    </div>
                  </div>

                  {/* 1-Click UPI Apps */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '10px' }}>
                      Fast Pay via Installed Apps:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {[
                        { id: 'gpay', name: 'Google Pay', icon: '🟢 GPay' },
                        { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                        { id: 'paytm', name: 'Paytm UPI', icon: '🔵 Paytm' },
                        { id: 'cred', name: 'CRED UPI', icon: '⚫ CRED' }
                      ].map(app => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => handlePayUpi(app.name)}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            border: '1.5px solid #CCD8D0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            color: '#183626',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '1rem' }}>{app.icon.split(' ')[0]}</span>
                          <span style={{ fontSize: '0.74rem' }}>{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom UPI ID Input */}
                  <form onSubmit={handlePayCustomUpi}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                      Or Enter UPI VPA ID:
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@okhdfcbank or user@paytm"
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #CCD8D0',
                          fontSize: '0.88rem'
                        }}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Verify &amp; Pay ₹{amount}
                      </button>
                    </div>
                    {upiIdError && (
                      <span style={{ fontSize: '0.74rem', color: '#B2341A', marginTop: '4px', display: 'block' }}>
                        {upiIdError}
                      </span>
                    )}
                  </form>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARD */}
              {activeTab === 'card' && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#183626' }}>
                    Enter Card Details
                  </h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#798C80' }}>
                    Encrypted with 256-bit bank grade security. We do not store CVV.
                  </p>

                  {cardError && (
                    <div style={{ backgroundColor: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '14px' }}>
                      {cardError}
                    </div>
                  )}

                  <form onSubmit={handleCardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Card Number */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#183626' }}>Card Number</label>
                        <span style={{ fontSize: '0.74rem', fontWeight: '800', color: getCardBrand(cardNumber).color }}>
                          {getCardBrand(cardNumber).brand}
                        </span>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4532 •••• •••• 8921"
                          style={{
                            width: '100%',
                            padding: '11px 14px 11px 40px',
                            borderRadius: '10px',
                            border: '1.5px solid #CCD8D0',
                            fontSize: '0.94rem',
                            letterSpacing: '1px'
                          }}
                        />
                        <CreditCard size={18} color="#798C80" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                        Name on Card
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="SURYA PRAKASH"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #CCD8D0',
                          fontSize: '0.88rem',
                          textTransform: 'uppercase'
                        }}
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                          Valid Thru (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="08/29"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid #CCD8D0',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          required
                          maxLength="4"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid #CCD8D0',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                    </div>

                    {/* Save Card Checkbox */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#55685C', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        style={{ accentColor: '#183626' }}
                      />
                      Save this card securely as per RBI tokenization directives
                    </label>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                    >
                      <Lock size={16} /> Pay ₹{amount} Securely
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: WALLET */}
              {activeTab === 'wallet' && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#183626' }}>
                    MilkMart Eco-Wallet
                  </h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#798C80' }}>
                    Instant 1-click doorstep payment with zero processing delay.
                  </p>

                  <div style={{
                    backgroundColor: '#FAF5EE',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E6DEC9',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#8E5A17', textTransform: 'uppercase', fontWeight: '700' }}>Available Balance</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#183626', marginTop: '4px' }}>₹{walletBalance}</div>
                      </div>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#E8F5EE',
                        color: '#196D3D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Wallet size={22} />
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', borderTop: '1px solid #E6DEC9', paddingTop: '12px', fontSize: '0.82rem', color: '#55685C' }}>
                      Order Deducts: <strong>₹{amount}</strong> • Balance After Order: <strong>₹{Math.max(0, walletBalance - amount)}</strong>
                    </div>
                  </div>

                  {walletBalance >= amount ? (
                    <button
                      type="button"
                      onClick={handlePayWallet}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Sparkles size={16} /> 1-Click Pay ₹{amount} from Wallet
                    </button>
                  ) : (
                    <div>
                      <div style={{ backgroundColor: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem', marginBottom: '14px' }}>
                        Insufficient wallet balance (Deficit: ₹{amount - walletBalance}). Please choose UPI or Cards.
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upi')}
                        className="btn btn-secondary btn-lg"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        Switch to UPI
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: NETBANKING */}
              {activeTab === 'netbanking' && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#183626' }}>
                    Select Your Bank
                  </h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#798C80' }}>
                    Redirects to your bank's highly secure net banking login.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                    {[
                      { id: 'HDFC', name: 'HDFC Bank', color: '#004c8f' },
                      { id: 'SBI', name: 'State Bank of India', color: '#280071' },
                      { id: 'ICICI', name: 'ICICI Bank', color: '#b02a30' },
                      { id: 'AXIS', name: 'Axis Bank', color: '#97144d' },
                      { id: 'KOTAK', name: 'Kotak Bank', color: '#ed1c24' },
                      { id: 'PNB', name: 'Punjab National Bank', color: '#a20038' }
                    ].map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '10px',
                          border: selectedBank === bank.id ? '2px solid #183626' : '1px solid #CCD8D0',
                          backgroundColor: selectedBank === bank.id ? '#FAF5EE' : '#FFFFFF',
                          color: '#183626',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Building2 size={20} color={bank.color} />
                        <span>{bank.name}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handlePayNetBanking}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Pay ₹{amount} via {selectedBank} NetBanking
                  </button>
                </div>
              )}

              {/* TAB 5: COD */}
              {activeTab === 'cod' && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#183626' }}>
                    Cash on Doorstep Delivery
                  </h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#798C80' }}>
                    Pay cash or hand over rinsed empty bottles at your morning drop.
                  </p>

                  <div style={{
                    backgroundColor: '#E8F5EE',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '18px',
                    fontSize: '0.82rem',
                    color: '#183626'
                  }}>
                    <strong>Doorstep Glass Bottle Credit:</strong> Hand over your rinsed glass bottles to morning delivery partner Ramesh. Each bottle reduces your cash payable by ₹10!
                  </div>

                  {codError && (
                    <div style={{ backgroundColor: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '14px' }}>
                      {codError}
                    </div>
                  )}

                  <form onSubmit={handlePayCod}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                        Enter 4-Digit Security Captcha to Confirm:
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          backgroundColor: '#183626',
                          color: '#E8C582',
                          fontFamily: 'monospace',
                          fontSize: '1.3rem',
                          fontWeight: '800',
                          letterSpacing: '4px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          userSelect: 'none'
                        }}>
                          {expectedCaptcha}
                        </div>
                        <input
                          type="text"
                          required
                          maxLength="4"
                          value={codCaptcha}
                          onChange={(e) => setCodCaptcha(e.target.value)}
                          placeholder="Digits"
                          style={{
                            width: '120px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #CCD8D0',
                            fontSize: '1.1rem',
                            letterSpacing: '2px',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <CheckCircle2 size={16} /> Confirm Order with Doorstep Payment
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OVERLAY: 3D Secure Bank OTP Screen */}
        {gatewayState === 'otp_3ds' && (
          <div style={{ padding: '40px 24px', textAlign: 'center', minHeight: '380px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#FAF5EE',
              color: '#8E5A17',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid #E6DEC9'
            }}>
              <ShieldCheck size={32} />
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#8E5A17', textTransform: 'uppercase' }}>
              RBI 3D-Secure 2.0 Authentication
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#183626', margin: '6px 0 10px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
              Issuing Bank Verification
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#55685C', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              A 6-digit OTP has been sent by your bank to registered mobile <strong>{customerPhone}</strong> for ₹{amount}.
            </p>

            <form onSubmit={handleVerifyBankOtp} style={{ maxWidth: '320px', margin: '0 auto' }}>
              <input
                type="text"
                autoFocus
                maxLength="6"
                value={bankOtp}
                onChange={(e) => setBankOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid #183626',
                  fontSize: '1.4rem',
                  letterSpacing: '6px',
                  textAlign: 'center',
                  fontWeight: '800',
                  color: '#183626',
                  marginBottom: '12px'
                }}
              />

              <button
                type="button"
                onClick={() => setBankOtp('123456')}
                style={{
                  border: '1px dashed #A26D24',
                  background: '#FAF5EE',
                  color: '#8E5A17',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                ⚡ Auto-fill Bank Test OTP: 123456
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Authenticate &amp; Complete Payment
              </button>
            </form>
          </div>
        )}

        {/* OVERLAY: Authorizing & Contacting Bank Server */}
        {gatewayState === 'authorizing' && (
          <div style={{ padding: '60px 24px', textAlign: 'center', minHeight: '380px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FAF5EE',
              color: '#183626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              border: '2px solid #CCD8D0'
            }}>
              <RefreshCw size={28} style={{ animation: 'spin 1.2s linear infinite' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#183626', margin: '0 0 8px 0' }}>
              Connecting to Secure Payment Network...
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#55685C' }}>
              Please do not press back or refresh. Authorizing ₹{amount}...
            </p>
          </div>
        )}

        {/* OVERLAY: Final Success Animation */}
        {gatewayState === 'success' && (
          <div style={{ padding: '60px 24px', textAlign: 'center', minHeight: '380px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#E8F5EE',
              color: '#196D3D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              border: '2px solid rgba(25, 109, 61, 0.3)'
            }}>
              <CheckCircle2 size={46} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#183626', margin: '0 0 8px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
              Payment Authorized &amp; Confirmed!
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#55685C' }}>
              ₹{amount} paid successfully. Allocating your sunrise morning bottle...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
