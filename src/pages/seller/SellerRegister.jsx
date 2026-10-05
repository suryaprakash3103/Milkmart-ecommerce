import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { sellerService } from '../../services/sellerService';
import { BrandLogo } from '../../components/common/BrandLogo';
import { 
  Award, User, Mail, Phone, Lock, MapPin, 
  CheckCircle2, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';

export const SellerRegister = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    farmName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmLocation: '',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641109',
    sellerType: 'Dairy Farmer',
    fssaiLicense: '',
    agreeTerms: true
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agreeTerms) {
      setError('Please agree to MilkMart Producer Terms & Conditions.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newSeller = await sellerService.sellerRegister({
        fullName: formData.fullName,
        farmName: formData.farmName,
        phone: formData.mobile,
        email: formData.email,
        password: formData.password,
        farmLocation: formData.farmLocation,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        sellerType: formData.sellerType,
        fssaiLicense: formData.fssaiLicense || "12421003000542"
      });

      showToast(`Welcome ${newSeller.name}! Your farm '${newSeller.farmName}' is now registered.`);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#FAF7F2'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '680px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E6DEC9',
        boxShadow: '0 14px 44px rgba(24, 54, 38, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Banner */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '28px',
          textAlign: 'center'
        }}>
          <BrandLogo variant="compact" theme="light" size="md" />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(232, 197, 130, 0.2)', color: '#E8C582', padding: '4px 12px', borderRadius: '14px', fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: '10px' }}>
            <Award size={14} /> Direct Farm Onboarding
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FAF7F2', margin: '10px 0 4px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
            Register as a MilkMart Producer
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#CBD5CB' }}>
            Sell your pure farm milk, curd, bilona ghee, and artisan dairy directly to nearby doorstep subscribers.
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FDE8E4',
              color: '#B2341A',
              border: '1px solid rgba(178, 52, 26, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '20px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Owner & Farm Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Full Name (Farm Owner / Manager) *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. K. Murugan"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #E6DEC9',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Farm / Gaushala Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <Award size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                  <input
                    type="text"
                    name="farmName"
                    required
                    placeholder="e.g. Green Valley Dairy Farm"
                    value={formData.farmName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #E6DEC9',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="e.g. +91 94432 10987"
                    value={formData.mobile}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #E6DEC9',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. murugan.farm@milkmart.farm"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #E6DEC9',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Create Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #E6DEC9',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #E6DEC9',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Seller Type & FSSAI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Seller / Farm Type *
                </label>
                <select
                  name="sellerType"
                  value={formData.sellerType}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '0.9rem',
                    backgroundColor: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Dairy Farmer">Dairy Farmer (Cow &amp; Buffalo Milk)</option>
                  <option value="Organic Farm">Organic Farm (Certified Organic)</option>
                  <option value="Milk Producer">Milk Producer Cooperative</option>
                  <option value="Poultry/Farm Producer">Poultry / Country Eggs Producer</option>
                  <option value="Agricultural Producer">Agricultural / Ghee Producer</option>
                  <option value="Other">Other Artisan Dairy</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  FSSAI License / Registration No.
                </label>
                <input
                  type="text"
                  name="fssaiLicense"
                  placeholder="14-digit FSSAI number (optional for onboarding)"
                  value={formData.fssaiLicense}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Location & Address */}
            <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '12px', border: '1px solid #E6DEC9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '12px' }}>
                <MapPin size={15} color="#196D3D" /> Farm Geographical Location
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#55685C', marginBottom: '4px' }}>
                  Farm Address / Pasture Village *
                </label>
                <input
                  type="text"
                  name="farmLocation"
                  required
                  placeholder="e.g. SF No. 142/2, Green Pastures, Kinathukadavu"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E6DEC9',
                    fontSize: '0.88rem',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#55685C', marginBottom: '2px' }}>District *</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#55685C', marginBottom: '2px' }}>State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#55685C', marginBottom: '2px' }}>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E6DEC9', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                style={{ marginTop: '3px', accentColor: '#183626' }}
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '0.82rem', color: '#55685C', cursor: 'pointer' }}>
                I agree to the MilkMart Farm Producer Standards: 0% adulteration, chemical-free milk yield, and rapid chilling compliance before sunrise dispatch.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                fontSize: '0.98rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? 'Registering Farm...' : 'Create Seller Account & Open Dashboard'}
              <ArrowRight size={17} />
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#55685C' }}>
            Already have a registered farm account?{' '}
            <Link to="/seller/login" style={{ color: '#183626', fontWeight: '700', textDecoration: 'none' }}>
              Sign In to Seller Hub →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
