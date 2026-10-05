import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  PlusCircle, Package, ArrowLeft, Upload, 
  Image as ImageIcon, CheckCircle2, AlertCircle, 
  Sparkles, Layers, DollarSign, ShieldAlert, 
  FileText, Info, HelpCircle
} from 'lucide-react';

export const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [farm, setFarm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const units = ['250 ml', '500 ml', '1 L', '2 L', '5 L', '250 g', '500 g', '1 kg', 'Pack', 'Box'];
  
  const categories = [
    { id: 'milk', label: 'Fresh Milk' },
    { id: 'a2-milk', label: 'A2 Milk' },
    { id: 'organic-milk', label: 'Organic Milk' },
    { id: 'curd', label: 'Curd & Yogurt' },
    { id: 'paneer', label: 'Paneer' },
    { id: 'butter', label: 'Butter' },
    { id: 'ghee', label: 'Ghee' },
    { id: 'cheese', label: 'Artisan Cheese' },
    { id: 'farm-eggs', label: 'Farm Eggs' },
    { id: 'other', label: 'Other Farm Products' }
  ];

  const presetImages = [
    { label: 'Raw Cow Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80' },
    { label: 'A2 Vedic Milk Bottle', url: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&q=80' },
    { label: 'Pure Bilona Ghee', url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80' },
    { label: 'Farm Fresh Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80' },
    { label: 'Claypot Curd', url: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&q=80' },
    { label: 'Artisan Butter', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    category: 'a2-milk',
    description: '',
    price: 85,
    originalPrice: 95,
    unit: '1 L',
    stock: 60,
    minOrderQty: 1,
    maxOrderQty: 8,
    image: presetImages[0].url,
    additionalImages: [
      'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=600&q=80'
    ],
    freshness: 'Harvested Today (4:30 AM Milking)',
    shelfLife: '3 Days (Store below 4°C)',
    storageInstructions: 'Keep refrigerated continuously at 2°C - 4°C. Consume within 72 hours of unsealing.',
    ingredients: '100% Raw Indigenous A2 Gir Cow Milk. Zero preservatives, zero neutralizers, non-homogenized.',
    nutritionalCalories: '68 kcal / 100ml',
    nutritionalProtein: '3.4g',
    nutritionalFat: '4.8g',
    nutritionalCalcium: '124mg',
    fatContent: '4.8% Natural Butterfat',
    snf: '8.9% Solids-Not-Fat',
    deliveryAvailability: 'Morning Doorstep Slot (6:00 AM - 7:30 AM)',
    hsnCode: '0401',
    gstRate: 0
  });

  useEffect(() => {
    const loadFarm = async () => {
      if (user?.id) {
        const f = await sellerService.getFarmProfile(user.id);
        setFarm(f);
      }
    };
    loadFarm();
  }, [user?.id]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (submitForApproval) => {
    if (!formData.name.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }
    if (formData.price <= 0) {
      showToast('Price must be greater than zero', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        stock: Number(formData.stock),
        minOrderQty: Number(formData.minOrderQty),
        maxOrderQty: Number(formData.maxOrderQty),
        nutritionalInfo: {
          calories: formData.nutritionalCalories,
          protein: formData.nutritionalProtein,
          fat: formData.nutritionalFat,
          calcium: formData.nutritionalCalcium
        },
        submitForApproval
      };

      await sellerService.createProduct(payload, {
        id: user?.id,
        farmId: farm?.id,
        farmName: farm?.name || user?.farmName,
        location: farm?.district ? `${farm.district}, ${farm.state}` : user?.location
      });

      if (submitForApproval) {
        showToast('Product submitted for admin quality approval!', 'success');
      } else {
        showToast('Product saved as draft!', 'info');
      }
      navigate('/seller/products');
    } catch (err) {
      console.error(err);
      showToast('Failed to save product. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link
            to="/seller/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#55685C',
              fontSize: '0.85rem',
              fontWeight: '600',
              textDecoration: 'none',
              marginBottom: '6px'
            }}
          >
            <ArrowLeft size={16} /> Back to My Products
          </Link>
          <h1 style={{ fontSize: '1.85rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Add New Farm Dairy Product
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', margin: '4px 0 0 0' }}>
            List your freshly harvested dairy or artisan products from <strong style={{ color: '#183626' }}>{farm?.name || user?.farmName || "Your Farm"}</strong>.
          </p>
        </div>

        {/* Farm Source Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E2D5',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2E7D32' }} />
          <div style={{ fontSize: '0.8rem', color: '#183626' }}>
            Sourcing Origin: <strong>{farm?.name || user?.farmName || "Verified Farm"}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Basic Product Info Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="#A26D24" /> Product Details
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Raw Vedic Gir Cow A2 Milk (Morning Batch)"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 12px',
                borderRadius: '8px',
                border: '1px solid #D5CBBB',
                fontSize: '0.9rem',
                color: '#183626',
                backgroundColor: '#FAF7F2'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
              Product Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '11px 12px',
                borderRadius: '8px',
                border: '1px solid #D5CBBB',
                fontSize: '0.9rem',
                color: '#183626',
                backgroundColor: '#FAF7F2'
              }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
              Product Description &amp; Benefits
            </label>
            <textarea
              rows={4}
              placeholder="Describe the purity, milk harvest timing, cow breed, and taste profile..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Unit / Packaging Size *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.9rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              >
                {units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Butterfat Content
              </label>
              <input
                type="text"
                placeholder="e.g. 4.8% Natural Fat"
                value={formData.fatContent}
                onChange={(e) => handleChange('fatContent', e.target.value)}
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

        {/* Pricing & Stock Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="#A26D24" /> Pricing &amp; Stock Availability
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Selling Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                MRP / Strikethrough Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={formData.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '1rem',
                  color: '#55685C',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Available Initial Stock *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#7E8B82' }}>Units ready for delivery</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Delivery Slot
              </label>
              <input
                type="text"
                value={formData.deliveryAvailability}
                onChange={(e) => handleChange('deliveryAvailability', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.85rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Min Order Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.minOrderQty}
                onChange={(e) => handleChange('minOrderQty', e.target.value)}
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
                Max Order Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxOrderQty}
                onChange={(e) => handleChange('maxOrderQty', e.target.value)}
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

        {/* Quality & Traceability Specs Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)',
          gridColumn: '1 / -1'
        }}>
          <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#A26D24" /> Quality, Freshness &amp; Nutritional Facts
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Freshness Level
              </label>
              <input
                type="text"
                value={formData.freshness}
                onChange={(e) => handleChange('freshness', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.88rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Shelf Life
              </label>
              <input
                type="text"
                value={formData.shelfLife}
                onChange={(e) => handleChange('shelfLife', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.88rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Storage Instructions
              </label>
              <input
                type="text"
                value={formData.storageInstructions}
                onChange={(e) => handleChange('storageInstructions', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.88rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
              Ingredients &amp; Milking Process
            </label>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #D5CBBB',
                fontSize: '0.88rem',
                color: '#183626',
                backgroundColor: '#FAF7F2'
              }}
            />
          </div>

          {/* Nutrition 4 Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#55685C', marginBottom: '4px' }}>Calories</label>
              <input
                type="text"
                value={formData.nutritionalCalories}
                onChange={(e) => handleChange('nutritionalCalories', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5CBBB', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#55685C', marginBottom: '4px' }}>Protein</label>
              <input
                type="text"
                value={formData.nutritionalProtein}
                onChange={(e) => handleChange('nutritionalProtein', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5CBBB', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#55685C', marginBottom: '4px' }}>Fat</label>
              <input
                type="text"
                value={formData.nutritionalFat}
                onChange={(e) => handleChange('nutritionalFat', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5CBBB', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#55685C', marginBottom: '4px' }}>Calcium</label>
              <input
                type="text"
                value={formData.nutritionalCalcium}
                onChange={(e) => handleChange('nutritionalCalcium', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D5CBBB', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Product Image Selection Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)',
          gridColumn: '1 / -1'
        }}>
          <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} color="#A26D24" /> Product Imagery
          </h2>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
              Select Image Preset or Enter Custom Image URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #D5CBBB',
                fontSize: '0.88rem',
                color: '#183626',
                marginBottom: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {presetImages.map((preset, idx) => (
              <div 
                key={idx}
                onClick={() => handleChange('image', preset.url)}
                style={{
                  cursor: 'pointer',
                  border: formData.image === preset.url ? '2px solid #183626' : '1px solid #E8E2D5',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#FAF7F2'
                }}
              >
                <img 
                  src={preset.url} 
                  alt={preset.label} 
                  style={{ width: '100%', height: '80px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '6px', fontSize: '0.72rem', fontWeight: '600', color: '#183626', textAlign: 'center' }}>
                  {preset.label}
                </div>
                {formData.image === preset.url && (
                  <div style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#183626', borderRadius: '50%', padding: '2px' }}>
                    <CheckCircle2 size={14} color="#FAF7F2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Buttons Footer */}
      <div style={{
        marginTop: '28px',
        padding: '18px 24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <button
          type="button"
          onClick={() => navigate('/seller/products')}
          style={{
            padding: '11px 20px',
            borderRadius: '8px',
            border: '1px solid #D5CBBB',
            backgroundColor: '#FAF7F2',
            color: '#55685C',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave(false)}
            style={{
              padding: '11px 22px',
              borderRadius: '8px',
              border: '1px solid #183626',
              backgroundColor: '#FFFFFF',
              color: '#183626',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 26px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#183626',
              color: '#FAF7F2',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(24, 54, 38, 0.2)'
            }}
          >
            <CheckCircle2 size={16} color="#E8C582" /> Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
};
