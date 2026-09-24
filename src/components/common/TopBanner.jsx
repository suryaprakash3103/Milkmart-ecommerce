import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck, Code2, ChevronDown } from 'lucide-react';

export const TopBanner = ({ onOpenBlueprint }) => {
  const { activePortal, switchRole } = useAuth();
  const navigate = useNavigate();

  const handlePortalChange = (e) => {
    const newRole = e.target.value;
    switchRole(newRole);
    if (newRole === 'admin') {
      navigate('/admin');
    } else if (newRole === 'delivery') {
      navigate('/delivery');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      backgroundColor: '#0F2318',
      color: '#FAF7F2',
      fontSize: '0.82rem',
      padding: '7px 0',
      borderBottom: '1px solid rgba(232, 197, 130, 0.2)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Left Message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(232, 197, 130, 0.15)',
            border: '1px solid rgba(232, 197, 130, 0.3)',
            padding: '2px 9px',
            borderRadius: '12px',
            color: '#E8C582',
            fontWeight: '600',
            fontSize: '0.78rem'
          }}>
            <Truck size={13} /> Morning Milk Run: 5:30 AM – 7:30 AM
          </span>
          <span style={{ color: '#D5DFC8', opacity: 0.9 }}>
            Order before 10:00 PM for doorstep glass-bottle drop tomorrow
          </span>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenBlueprint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(24, 54, 38, 0.9)',
              border: '1px solid rgba(232, 197, 130, 0.35)',
              color: '#E8C582',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Inspect Full-Stack Technical Architecture, Schema & PRD"
          >
            <Code2 size={13} /> &lt;/&gt; Full-Stack PRD
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#E8C582', fontWeight: '500', fontSize: '0.78rem' }}>Portal:</span>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select
                value={activePortal}
                onChange={handlePortalChange}
                style={{
                  backgroundColor: '#183626',
                  color: '#FAF7F2',
                  border: '1px solid rgba(232, 197, 130, 0.4)',
                  borderRadius: '6px',
                  padding: '3px 24px 3px 10px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                <option value="customer">Customer Storefront</option>
                <option value="admin">Admin Operations Hub</option>
              </select>
              <ChevronDown
                size={12}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#E8C582'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
