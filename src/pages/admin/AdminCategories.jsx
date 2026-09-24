import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { FolderTree, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCategories = () => {
  const { categories, products } = useProducts();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
          Dairy Categories Directory (10 Product Lines)
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
          Organize pastured cow &amp; buffalo milk, bilona ghee, cultured butter, and traditional sweets
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.id);

          return (
            <div
              key={cat.id}
              className="card-artisan"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #E6DEC9'
              }}
            >
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(24, 54, 38, 0.85)',
                  color: '#FAF7F2',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: '700'
                }}>
                  {cat.badge}
                </span>
              </div>

              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 6px 0' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#798C80', lineHeight: 1.4, marginBottom: '14px' }}>
                  {cat.tagline}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #F1EDE3',
                  paddingTop: '12px',
                  fontSize: '0.84rem'
                }}>
                  <strong style={{ color: '#8E5A17' }}>{catProducts.length} Active SKUs</strong>
                  <Link
                    to={`/products?category=${cat.id}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#183626', fontWeight: '700' }}
                  >
                    View Catalog <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
