import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import { 
  User, Mail, Phone, Lock, Truck, MapPin, 
  ArrowRight, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';

export const SignupPage = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [signupRole, setSignupRole] = useState(location.state?.defaultRole || 'customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Customer specific
    house: '',
    street: '',
    area: 'HSR Layout',
    pincode: '560102',
    instructions: 'Leave inside insulated doorstep pouch before 7 AM',
    // Delivery Partner specific
    vehicleType: 'Electric Chilled Van',
    route: 'Route 4B - HSR Layout & Koramangala'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: signupRole === 'customer' ? {
        house: formData.house,
        street: formData.street,
        area: formData.area,
        city: 'Bengaluru',
        pincode: formData.pincode,
        instructions: formData.instructions
      } : undefined,
      vehicleType: signupRole === 'delivery' ? formData.vehicleType : undefined,
      route: signupRole === 'delivery' ? formData.route : undefined
    };

    setTimeout(() => {
      const res = signup(payload, signupRole);
      setIsSubmitting(false);

      if (res.success) {
        showToast(`Welcome to MilkMart, ${formData.name}! Your account is ready.`);
        if (signupRole === 'delivery') {
          navigate('/partner');
        } else {
          navigate('/account');
        }
      } else {
        setError(res.message || 'Signup failed. Please try again.');
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#FAF7F2'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E6DEC9',
        boxShadow: '0 12px 40px rgba(24, 54, 38, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Banner */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '28px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'inline-block', marginBottom: '10px' }}>
            <BrandLogo variant="compact" theme="light" size="md" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FAF7F2', margin: '0 0 6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
            Join the MilkMart Family
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#CBD5CB' }}>
            Subscribe to morning farm-fresh milk or join our sunrise delivery fleet
          </p>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Role Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#FAF5EE',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid #EFE8D8'
          }}>
            <button
              type="button"
              onClick={() => { setSignupRole('customer'); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: signupRole === 'customer' ? '700' : '600',
                backgroundColor: signupRole === 'customer' ? '#183626' : 'transparent',
                color: signupRole === 'customer' ? '#FAF7F2' : '#55685C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={15} /> Customer Account (+₹500 Bonus)
            </button>
            <button
              type="button"
              onClick={() => { setSignupRole('delivery'); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: signupRole === 'delivery' ? '700' : '600',
                backgroundColor: signupRole === 'delivery' ? '#183626' : 'transparent',
                color: signupRole === 'delivery' ? '#FAF7F2' : '#55685C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Truck size={15} /> Delivery Partner
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div style={{
              backgroundColor: '#FDE8E4',
              color: '#B2341A',
              border: '1px solid rgba(178, 52, 26, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '18px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignupSubmit}>
            {/* Common Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Anand Murthy"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98450 XXXXX"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
              />
            </div>

            {/* Passwords */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                  Create Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
                />
              </div>
            </div>

            {/* Customer Specific Fields: Address */}
            {signupRole === 'customer' && (
              <div style={{
                backgroundColor: '#FAF5EE',
                border: '1px solid #E6DEC9',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#183626', fontSize: '0.86rem', marginBottom: '10px' }}>
                  <MapPin size={15} color="#A26D24" /> Morning Doorstep Delivery Address
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#798C80', marginBottom: '2px' }}>Flat / House / Villa No.</label>
                    <input
                      type="text"
                      name="house"
                      required={signupRole === 'customer'}
                      value={formData.house}
                      onChange={handleChange}
                      placeholder="e.g. Flat 301, Tower B"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#798C80', marginBottom: '2px' }}>Street / Apartment Complex</label>
                    <input
                      type="text"
                      name="street"
                      required={signupRole === 'customer'}
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="e.g. Prestige Greenwoods"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#798C80', marginBottom: '2px' }}>Area / Locality</label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="HSR Layout">HSR Layout (Route 4B)</option>
                      <option value="Koramangala">Koramangala (Route 4B)</option>
                      <option value="Indiranagar">Indiranagar (Route 2A)</option>
                      <option value="Whitefield">Whitefield (Route 1C)</option>
                      <option value="Bellandur">Bellandur (Route 3D)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#798C80', marginBottom: '2px' }}>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#798C80', marginBottom: '2px' }}>Doorstep Drop Note (Silent Delivery)</label>
                  <input
                    type="text"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="e.g. Leave in porch thermal bag, ring bell once"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>
            )}

            {/* Delivery Partner Specific Fields */}
            {signupRole === 'delivery' && (
              <div style={{
                backgroundColor: '#FAF5EE',
                border: '1px solid #E6DEC9',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#183626', fontSize: '0.86rem', marginBottom: '10px' }}>
                  <Truck size={15} color="#196D3D" /> Fleet &amp; Route Assignment
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#798C80', marginBottom: '2px' }}>Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Electric Chilled Van (KA01-EK-4501)">Electric Chilled Van (Insulated 3.8°C)</option>
                    <option value="EV 3-Wheeler Chilled Loader">EV 3-Wheeler Chilled Loader</option>
                    <option value="Electric Scooter with Chilled Crate">Electric Scooter with Chilled Crate</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#798C80', marginBottom: '2px' }}>Preferred Morning Sunrise Shift Route</label>
                  <select
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Route 4B - HSR Layout & Koramangala">Route 4B - HSR Layout &amp; Koramangala (5:30 AM)</option>
                    <option value="Route 2A - Indiranagar & Domlur">Route 2A - Indiranagar &amp; Domlur (5:30 AM)</option>
                    <option value="Route 1C - Whitefield & ITPL">Route 1C - Whitefield &amp; ITPL (5:30 AM)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                backgroundColor: '#183626',
                color: '#FAF7F2',
                border: 'none',
                fontSize: '0.96rem',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(24, 54, 38, 0.2)'
              }}
            >
              {isSubmitting ? 'Creating account...' : `Register as ${signupRole === 'delivery' ? 'Fleet Delivery Partner' : 'Customer'}`}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Login Link */}
          <div style={{
            marginTop: '22px',
            textAlign: 'center',
            fontSize: '0.86rem',
            color: '#55685C',
            borderTop: '1px solid #F1EDE3',
            paddingTop: '18px'
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#A26D24', fontWeight: '700', textDecoration: 'none' }}
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
