import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, Check, X, Search, Filter } from 'lucide-react';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability, categories } = useProducts();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'milk',
    brand: 'MilkMart Pure Farm',
    price: 60,
    originalPrice: 70,
    size: '1 L',
    unit: 'L',
    fatContent: '4.5% Fat',
    stock: 50,
    availability: 'In Stock',
    image: '/images/products/milk-a2.jpg',
    hsnCode: '0401',
    gstRate: 0,
    description: 'Farm-fresh pure whole dairy from pastured cows.'
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'milk',
      brand: 'MilkMart Pure Farm',
      price: 60,
      originalPrice: 70,
      size: '1 L',
      unit: 'L',
      fatContent: '4.5% Fat',
      stock: 50,
      availability: 'In Stock',
      image: '/images/products/milk-a2.jpg',
      hsnCode: '0401',
      gstRate: 0,
      description: 'Farm-fresh pure whole dairy from pastured cows.'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      size: product.size,
      unit: product.unit || 'L',
      fatContent: product.fatContent || '4.0% Fat',
      stock: product.stock,
      availability: product.availability,
      image: product.image,
      hsnCode: product.hsnCode || (product.category === 'ghee' ? '0405' : product.category === 'paneer' ? '0406' : '0401'),
      gstRate: product.gstRate !== undefined ? product.gstRate : (product.category === 'ghee' ? 12 : product.category === 'paneer' ? 5 : 0),
      description: product.description
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      showToast(`Updated '${formData.name}' successfully!`);
    } else {
      addProduct({
        ...formData,
        tags: ["Fresh", "Glass Bottle"],
        isSubscribable: true
      });
      showToast(`Added new dairy SKU '${formData.name}'!`);
    }
    setIsModalOpen(false);
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
            Product Catalog Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
            Add new dairy SKUs, update live prices, and adjust stock quantities
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} /> Add New Dairy SKU
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E6DEC9',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        gap: '14px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          style={{ padding: '10px 14px', fontWeight: '600' }}
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
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
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Product</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Category</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Price</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>HSN / Tax</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Stock</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F1EDE3' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.image} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '700', color: '#183626' }}>{p.name}</div>
                        <div style={{ fontSize: '0.76rem', color: '#798C80' }}>{p.brand} • {p.size}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#55685C' }}>
                    {p.category}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: '700', color: '#183626' }}>
                    ₹{p.price}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ backgroundColor: '#FAF5EE', border: '1px solid #E6DEC9', borderRadius: '6px', padding: '2px 8px', fontSize: '0.78rem', color: '#183626', fontWeight: '600' }}>
                      HSN: {p.hsnCode || (p.category === 'ghee' ? '0405' : '0401')} ({p.gstRate !== undefined ? p.gstRate : (p.category === 'ghee' ? 12 : 0)}% GST)
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      fontWeight: '700',
                      color: p.stock === 0 ? '#B2341A' : p.stock < 20 ? '#8E5A17' : '#196D3D'
                    }}>
                      {p.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => toggleAvailability(p.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        backgroundColor: p.availability === 'In Stock' ? '#E8F5EE' : '#FDE8E4',
                        color: p.availability === 'In Stock' ? '#196D3D' : '#B2341A',
                        cursor: 'pointer',
                        border: 'none'
                      }}
                      title="Click to toggle availability"
                    >
                      {p.availability}
                    </button>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(p)}
                        style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#FAF5EE', border: '1px solid #E6DEC9', color: '#183626', cursor: 'pointer' }}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete product '${p.name}'?`)) {
                            deleteProduct(p.id);
                            showToast("Product deleted from catalog");
                          }
                        }}
                        style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#FDE8E4', border: '1px solid #F8CCC2', color: '#B2341A', cursor: 'pointer' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Product */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#183626', margin: 0 }}>
                  {editingProduct ? `Edit '${editingProduct.name}'` : "Add New Farm Dairy SKU"}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
                  <X size={20} color="#183626" />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Product Title</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Brand / Farm</label>
                  <input type="text" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%' }}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Selling Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Original MRP (₹)</label>
                  <input type="number" required value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Pack Size / Volume</label>
                  <input type="text" required value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="e.g. 1 L or 500 g" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Fat Content</label>
                  <input type="text" value={formData.fatContent} onChange={(e) => setFormData({ ...formData, fatContent: e.target.value })} placeholder="e.g. 4.8% Fat" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Current Stock Units</label>
                  <input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>HSN Tariff Code</label>
                  <input type="text" required value={formData.hsnCode} onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })} placeholder="e.g. 0401 or 0405" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>GST Tax Rate (%)</label>
                  <select value={formData.gstRate} onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })} style={{ width: '100%' }}>
                    <option value={0}>0% GST (Fresh Liquid Milk & Raw Curd)</option>
                    <option value={5}>5% GST (Fresh Artisanal Paneer)</option>
                    <option value={12}>12% GST (Bilona Cultured Ghee & Butter)</option>
                    <option value={18}>18% GST (Condensed / Value-Added)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Product Image URL</label>
                <input type="url" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} style={{ width: '100%' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Description</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingProduct ? "Save Changes" : "Create Dairy SKU"}
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
  );
};
