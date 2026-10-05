import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  Package, Plus, Edit2, Trash2, Copy, 
  ExternalLink, Check, X, Sparkles, AlertCircle, 
  Award, Tag, Search, Filter, RefreshCw, Eye, 
  ToggleLeft, ToggleRight, Layers, ArrowUpDown
} from 'lucide-react';

export const SellerProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // table, grid

  // Quick Stock Edit Modal
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [quickStockVal, setQuickStockVal] = useState('');

  const loadProducts = async () => {
    try {
      if (user?.id) {
        const list = await sellerService.getProducts(user.id);
        setProducts(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const handleSync = () => loadProducts();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  const handleDuplicate = async (p) => {
    try {
      await sellerService.duplicateProduct(p.id, user);
      showToast(`Created draft duplicate of "${p.name}"`, 'success');
      loadProducts();
    } catch (err) {
      showToast('Failed to duplicate product', 'error');
    }
  };

  const handleDelete = async (productId, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await sellerService.deleteProduct(productId);
        showToast(`"${name}" deleted from your catalog`, 'info');
        loadProducts();
      } catch (err) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleToggleActive = async (p) => {
    const isCurrentlyInactive = p.approvalStatus === 'inactive';
    const newStatus = isCurrentlyInactive ? 'approved' : 'inactive';
    try {
      await sellerService.updateProduct(p.id, { approvalStatus: newStatus });
      showToast(`Product ${isCurrentlyInactive ? 'enabled' : 'disabled'} successfully`, 'success');
      loadProducts();
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    try {
      await sellerService.updateProduct(stockModalProduct.id, {
        stock: Number(quickStockVal),
        availability: Number(quickStockVal) > 0 ? 'In Stock' : 'Out of Stock'
      });
      showToast('Inventory stock updated!', 'success');
      setStockModalProduct(null);
      loadProducts();
    } catch (err) {
      showToast('Error updating stock', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const s = search.toLowerCase();
    const matchSearch = p.name?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s);
    if (!matchSearch) return false;

    if (categoryFilter !== 'all' && p.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

    if (statusFilter !== 'all') {
      const currentStatus = (p.approvalStatus || 'approved').toLowerCase();
      if (statusFilter === 'approved' && currentStatus !== 'approved') return false;
      if (statusFilter === 'pending' && currentStatus !== 'pending') return false;
      if (statusFilter === 'draft' && currentStatus !== 'draft') return false;
      if (statusFilter === 'rejected' && currentStatus !== 'rejected') return false;
      if (statusFilter === 'inactive' && currentStatus !== 'inactive') return false;
      if (statusFilter === 'out_of_stock' && Number(p.stock) > 0) return false;
    }

    return true;
  });

  const getStatusBadge = (status, stock) => {
    if (Number(stock) <= 0) {
      return (
        <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '700', backgroundColor: '#FFEBEE', color: '#C62828' }}>
          Out of Stock
        </span>
      );
    }
    switch (status) {
      case 'pending':
        return (
          <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '700', backgroundColor: '#FFF8E1', color: '#B78103' }}>
            Pending Approval
          </span>
        );
      case 'draft':
        return (
          <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '700', backgroundColor: '#EFE8D8', color: '#55685C' }}>
            Draft
          </span>
        );
      case 'rejected':
        return (
          <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '700', backgroundColor: '#FFCDD2', color: '#B71C1C' }}>
            Revision Needed
          </span>
        );
      case 'inactive':
        return (
          <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '700', backgroundColor: '#E0E0E0', color: '#616161' }}>
            Inactive
          </span>
        );
      case 'approved':
      default:
        return (
          <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '700', backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
            Approved &amp; Live
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
            Dairy SKU Catalog
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            My Farm Products
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
            Manage your certified farm-fresh milk variants, butter, paneer, and ghee offerings.
          </p>
        </div>

        <Link
          to="/seller/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#183626',
            color: '#FAF7F2',
            fontSize: '0.88rem',
            fontWeight: '700',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(24, 54, 38, 0.2)'
          }}
        >
          <Plus size={16} color="#E8C582" /> Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E8E2D5',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={16} color="#7E8B82" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #D5CBBB',
              fontSize: '0.88rem',
              backgroundColor: '#FAF7F2'
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #D5CBBB',
              fontSize: '0.85rem',
              backgroundColor: '#FAF7F2',
              color: '#183626'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved &amp; Live</option>
            <option value="pending">Pending Approval</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #D5CBBB',
              fontSize: '0.85rem',
              backgroundColor: '#FAF7F2',
              color: '#183626'
            }}
          >
            <option value="all">All Categories</option>
            <option value="milk">Fresh Milk</option>
            <option value="a2-milk">A2 Milk</option>
            <option value="curd">Curd &amp; Yogurt</option>
            <option value="paneer">Paneer</option>
            <option value="ghee">Ghee</option>
            <option value="butter">Butter</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D5' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Product</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Category</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Price</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Stock</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Created</th>
                <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#7E8B82' }}>
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F0ECE1' }}>
                    {/* Product Name & thumbnail */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={p.image || '/images/products/milk-a2.jpg'} 
                          alt={p.name} 
                          style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E8E2D5' }} 
                        />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#183626' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#7E8B82' }}>
                            {p.size || '1 L'} • {p.brand || user?.farmName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: '#55685C', textTransform: 'capitalize' }}>
                      {p.category}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#183626' }}>
                        ₹{p.price}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span style={{ fontSize: '0.78rem', color: '#7E8B82', textDecoration: 'line-through', marginLeft: '6px' }}>
                          ₹{p.originalPrice}
                        </span>
                      )}
                    </td>

                    {/* Stock & Quick update trigger */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          color: Number(p.stock) <= 0 ? '#C62828' : '#183626'
                        }}>
                          {p.stock} {p.unit || 'L'}
                        </span>
                        <button
                          onClick={() => {
                            setStockModalProduct(p);
                            setQuickStockVal(p.stock?.toString() || '0');
                          }}
                          title="Quick update stock"
                          style={{
                            border: '1px solid #D5CBBB',
                            borderRadius: '4px',
                            background: '#FAF7F2',
                            padding: '2px 6px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            color: '#183626'
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 18px' }}>
                      {getStatusBadge(p.approvalStatus || 'approved', p.stock)}
                    </td>

                    {/* Created Date */}
                    <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: '#7E8B82' }}>
                      {p.createdAt || '2026-09-28'}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {/* Public Link if approved */}
                        {(p.approvalStatus === 'approved' || !p.approvalStatus) && (
                          <Link
                            to={`/products/${p.id}`}
                            target="_blank"
                            title="View on Customer Store"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              backgroundColor: '#FAF7F2',
                              color: '#183626',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(p)}
                          title="Duplicate SKU"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #D5CBBB',
                            backgroundColor: '#FFFFFF',
                            color: '#55685C',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Copy size={14} />
                        </button>

                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => handleToggleActive(p)}
                          title={p.approvalStatus === 'inactive' ? 'Enable Product' : 'Disable Product'}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #D5CBBB',
                            backgroundColor: '#FFFFFF',
                            color: p.approvalStatus === 'inactive' ? '#7E8B82' : '#2E7D32',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {p.approvalStatus === 'inactive' ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Delete Product"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #FFCDD2',
                            backgroundColor: '#FFF5F5',
                            color: '#C62828',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Edit Modal */}
      {stockModalProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '380px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#183626', fontFamily: 'Fraunces, Georgia, serif' }}>
              Update Available Stock
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#55685C' }}>
              For <strong>{stockModalProduct.name}</strong>
            </p>

            <form onSubmit={handleSaveStock}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  New Stock Count ({stockModalProduct.unit || 'Units'})
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quickStockVal}
                  onChange={(e) => setQuickStockVal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    backgroundColor: '#FAF7F2',
                    color: '#55685C',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#183626',
                    color: '#FAF7F2',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
