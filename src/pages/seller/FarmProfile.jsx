import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  Award, ShieldCheck, MapPin, Phone, Mail, 
  Building2, Camera, Upload, CheckCircle2, 
  Clock, AlertTriangle, ExternalLink, Sparkles, 
  Check, Save, RefreshCw, FileText
} from 'lucide-react';

export const FarmProfile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [farm, setFarm] = useState({
    id: '',
    name: '',
    ownerName: '',
    description: '',
    address: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    farmType: 'Organic',
    productsProduced: ['Milk', 'A2 Milk', 'Curd', 'Ghee'],
    verificationStatus: 'Verified',
    fssaiLicense: '11223344556677',
    cattleCount: 45,
    dailyCapacityLiters: 350,
    coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&q=80',
      'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=600&q=80',
      'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80'
    ]
  });

  const farmTypes = ['Organic', 'Natural', 'Conventional', 'Sustainable'];
  const allProductOptions = [
    'Milk', 'A2 Milk', 'Cow Milk', 'Buffalo Milk', 
    'Curd', 'Paneer', 'Butter', 'Ghee', 'Cheese', 'Other Dairy Products'
  ];

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        if (user?.id) {
          const data = await sellerService.getFarmProfile(user.id);
          if (data) {
            setFarm(prev => ({
              ...prev,
              ...data,
              productsProduced: data.productsProduced || prev.productsProduced,
              galleryImages: data.galleryImages || prev.galleryImages
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching farm profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarm();
  }, [user?.id]);

  const handleChange = (field, value) => {
    setFarm(prev => ({ ...prev, [field]: value }));
  };

  const toggleProduct = (prod) => {
    setFarm(prev => {
      const exists = prev.productsProduced.includes(prod);
      return {
        ...prev,
        productsProduced: exists 
          ? prev.productsProduced.filter(p => p !== prod)
          : [...prev.productsProduced, prod]
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await sellerService.updateFarmProfile(user?.id, farm);
      showToast('Farm Profile updated successfully! Changes reflect on customer store.', 'success');
    } catch (err) {
      showToast('Failed to update farm profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw className="animate-spin" size={36} color="#183626" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#55685C', fontSize: '0.9rem' }}>Loading Farm Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Banner / Verification Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.05)',
        marginBottom: '24px'
      }}>
        {/* Cover Photo */}
        <div style={{
          height: '200px',
          backgroundImage: `url(${farm.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(19, 42, 30, 0.3) 0%, rgba(19, 42, 30, 0.8) 100%)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            gap: '10px'
          }}>
            <Link
              to={`/farm/${farm.id || 'farm-green-valley'}`}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#183626',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <ExternalLink size={14} /> View Public Storefront
            </Link>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img 
              src={farm.logo} 
              alt={farm.name} 
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                marginTop: '-36px',
                backgroundColor: '#FAF7F2'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '1.45rem', color: '#183626', fontFamily: 'Fraunces, Georgia, serif' }}>
                  {farm.name || 'Farm Name'}
                </h1>
                {farm.verificationStatus === 'Verified' ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: '20px',
                    backgroundColor: '#E8F5E9',
                    color: '#2E7D32',
                    fontSize: '0.74rem',
                    fontWeight: '700'
                  }}>
                    <ShieldCheck size={13} /> Verified Farm Producer
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: '20px',
                    backgroundColor: '#FFF8E1',
                    color: '#B78103',
                    fontSize: '0.74rem',
                    fontWeight: '700'
                  }}>
                    <Clock size={13} /> Under Review
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#55685C' }}>
                Managed by <strong style={{ color: '#183626' }}>{farm.ownerName || user?.name}</strong> • {farm.district}, {farm.state}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right', borderRight: '1px solid #E8E2D5', paddingRight: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>FSSAI Registration</div>
              <div style={{ fontSize: '0.9rem', color: '#183626', fontWeight: '800' }}>#{farm.fssaiLicense}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Daily Capacity</div>
              <div style={{ fontSize: '0.9rem', color: '#A26D24', fontWeight: '800' }}>{farm.dailyCapacityLiters} Litres</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* General Information Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#A26D24" /> General Farm Details
            </h2>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Farm / Gaushala Name *
              </label>
              <input
                type="text"
                value={farm.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.9rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Owner / Farmer Full Name *
              </label>
              <input
                type="text"
                value={farm.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.9rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Farm Description &amp; Heritage
              </label>
              <textarea
                rows={4}
                value={farm.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Share your farm story, ethical milking practices, animal feed, and natural environment..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.88rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Farm Phone *
                </label>
                <input
                  type="tel"
                  value={farm.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Farm Email *
                </label>
                <input
                  type="email"
                  value={farm.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Cattle Headcount
                </label>
                <input
                  type="number"
                  value={farm.cattleCount}
                  onChange={(e) => handleChange('cattleCount', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Daily Capacity (Liters)
                </label>
                <input
                  type="number"
                  value={farm.dailyCapacityLiters}
                  onChange={(e) => handleChange('dailyCapacityLiters', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

          </div>

          {/* Location & Certification Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#A26D24" /> Location &amp; Certification
            </h2>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Farm Address / Survey No.
              </label>
              <input
                type="text"
                value={farm.address}
                onChange={(e) => handleChange('address', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.9rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Village / Town
                </label>
                <input
                  type="text"
                  value={farm.village}
                  onChange={(e) => handleChange('village', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  District
                </label>
                <input
                  type="text"
                  value={farm.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  State
                </label>
                <input
                  type="text"
                  value={farm.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Pincode
                </label>
                <input
                  type="text"
                  value={farm.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                FSSAI Dairy License Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={farm.fssaiLicense}
                  onChange={(e) => handleChange('fssaiLicense', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2',
                    fontWeight: '600'
                  }}
                />
                <ShieldCheck size={18} color="#2E7D32" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Farm Farming Classification
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {farmTypes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleChange('farmType', t)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: farm.farmType === t ? '2px solid #183626' : '1px solid #E8E2D5',
                      backgroundColor: farm.farmType === t ? '#EFE8D8' : '#FAF7F2',
                      color: '#183626',
                      fontWeight: farm.farmType === t ? '700' : '500',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Products Produced Selection */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)',
            gridColumn: '1 / -1'
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 8px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#A26D24" /> Dairy Items &amp; Products Harvested
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#55685C', marginTop: 0, marginBottom: '16px' }}>
              Select the categories of fresh milk and artisanal dairy produced at your facility. These tags will show on your farm showcase.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {allProductOptions.map(p => {
                const isSelected = farm.productsProduced?.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleProduct(p)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      border: isSelected ? '2px solid #183626' : '1px solid #D5CBBB',
                      backgroundColor: isSelected ? '#183626' : '#FFFFFF',
                      color: isSelected ? '#FAF7F2' : '#55685C',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected && <Check size={14} />} {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Farm Imagery Showcase */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)',
            gridColumn: '1 / -1'
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} color="#A26D24" /> Farm Photos &amp; Facility Gallery
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Cover Banner URL
                </label>
                <input
                  type="text"
                  value={farm.coverImage}
                  onChange={(e) => handleChange('coverImage', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.82rem',
                    marginBottom: '8px'
                  }}
                />
                <img 
                  src={farm.coverImage} 
                  alt="Cover Preview" 
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E8E2D5' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Farm Logo / Emblem URL
                </label>
                <input
                  type="text"
                  value={farm.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.82rem',
                    marginBottom: '8px'
                  }}
                />
                <img 
                  src={farm.logo} 
                  alt="Logo Preview" 
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E8E2D5' }} 
                />
              </div>

              {farm.galleryImages?.slice(0, 2).map((img, idx) => (
                <div key={idx}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                    Gallery Photo #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => {
                      const updated = [...farm.galleryImages];
                      updated[idx] = e.target.value;
                      handleChange('galleryImages', updated);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #D5CBBB',
                      fontSize: '0.82rem',
                      marginBottom: '8px'
                    }}
                  />
                  <img 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E8E2D5' }} 
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Button Bar */}
        <div style={{
          marginTop: '28px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '14px'
        }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 30px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#183626',
              color: '#FAF7F2',
              fontSize: '0.96rem',
              fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(24, 54, 38, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin" size={18} /> Saving Profile...
              </>
            ) : (
              <>
                <Save size={18} color="#E8C582" /> Save Farm Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
