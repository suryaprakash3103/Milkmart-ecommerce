import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { RatingStars } from '../../components/common/RatingStars';
import { MessageSquare, Star, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReviewsPage = () => {
  const { reviews, products } = useProducts();
  const [filterRating, setFilterRating] = useState('all');

  const filtered = filterRating === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === Number(filterRating));

  return (
    <div style={{ padding: '36px 0 70px 0' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
            Household Dairy Reviews &amp; Testimonials
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#55685C', marginTop: '4px' }}>
            Unfiltered feedback from thousands of morning milk and bilona ghee subscribers
          </p>
        </div>

        {/* Rating summary cards */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          borderRadius: '20px',
          padding: '28px 32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '0.84rem', color: '#E8C582', fontWeight: '700', textTransform: 'uppercase' }}>
              Overall Quality Score
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '3rem', fontWeight: '700', color: '#FAF7F2' }}>
                4.9
              </span>
              <span style={{ fontSize: '1.1rem', color: '#E8C582' }}>/ 5.0</span>
            </div>
            <div style={{ color: '#D5DFC8', fontSize: '0.84rem' }}>Based on 1,840+ verified doorstep subscriber ratings</div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', '5', '4', '3'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  backgroundColor: filterRating === r ? '#E8C582' : 'rgba(255, 255, 255, 0.1)',
                  color: filterRating === r ? '#183626' : '#FAF7F2',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {r === 'all' ? 'All Reviews' : `${r} Stars ★`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((rev) => {
            const prod = products.find((p) => p.id === rev.productId);
            return (
              <div
                key={rev.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E6DEC9',
                  padding: '24px',
                  boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '1rem', color: '#183626' }}>{rev.author}</strong>
                    {rev.verified && (
                      <span style={{ fontSize: '0.74rem', color: '#196D3D', backgroundColor: '#E8F5EE', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                        ✓ Verified Household Subscriber
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#798C80' }}>{rev.date}</span>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <RatingStars rating={rev.rating} size={14} />
                </div>

                {prod && (
                  <Link to={`/products/${prod.id}`} style={{ display: 'inline-block', fontSize: '0.8rem', color: '#8E5A17', fontWeight: '600', marginBottom: '8px' }}>
                    Reviewing: {prod.name} &gt;
                  </Link>
                )}

                {rev.title && (
                  <h4 style={{ fontSize: '1.05rem', color: '#183626', margin: '0 0 6px 0' }}>
                    {rev.title}
                  </h4>
                )}

                <p style={{ fontSize: '0.9rem', color: '#55685C', lineHeight: 1.55, margin: 0 }}>
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
