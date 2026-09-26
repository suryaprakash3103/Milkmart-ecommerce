import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#FAF7F2'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E6DEC9',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(24, 54, 38, 0.08)'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#FAF5EE',
          border: '2px dashed #E6DEC9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <img src="/images/milk-bottle.svg" alt="MilkMart Bottle" style={{ width: '38px', height: '38px', opacity: 0.8 }} />
        </div>

        <span style={{
          backgroundColor: '#FAF5EE',
          color: '#8E5A17',
          fontSize: '0.78rem',
          fontWeight: '800',
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          404 Page Not Found
        </span>

        <h2 style={{ fontSize: '1.8rem', color: '#183626', margin: '14px 0 8px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
          Fresh Milk Not Found Here
        </h2>

        <p style={{ fontSize: '0.92rem', color: '#55685C', lineHeight: 1.6, marginBottom: '28px' }}>
          The page you requested may have been relocated, or the morning delivery route has moved to another doorstep.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-dark"
          >
            <ArrowLeft size={15} /> Go Back
          </button>
          <Link
            to="/"
            className="btn btn-primary"
          >
            <Home size={15} /> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
