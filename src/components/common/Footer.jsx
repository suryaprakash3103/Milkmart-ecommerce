import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCcw, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Sunrise Delivery",
    desc: "At your doorstep between 5:30 AM – 7:30 AM",
    tag: "Morning Slot",
    bg: "#FFF9E6",
    border: "#F5DFAD",
    hoverBorder: "#D97706",
    iconBg: "#FEEFCD",
    iconColor: "#B45309",
    tagBg: "#FEF3C7",
    tagColor: "#92400E",
    glowColor: "rgba(217, 119, 6, 0.16)"
  },
  {
    icon: RefreshCcw,
    title: "Glass Bottle Loop",
    desc: "0% single-use plastic. Return bottles for ₹10 credit",
    tag: "₹10 Cashback",
    bg: "#EDF8F1",
    border: "#BEE8CB",
    hoverBorder: "#16A34A",
    iconBg: "#DAF3E3",
    iconColor: "#15803D",
    tagBg: "#DCFCE7",
    tagColor: "#166534",
    glowColor: "rgba(22, 163, 74, 0.16)"
  },
  {
    icon: ShieldCheck,
    title: "4°C Cold Chain",
    desc: "Unbroken refrigeration from farm milking to pouch",
    tag: "Sub-Zero Chill",
    bg: "#EDF7FC",
    border: "#BCE3F7",
    hoverBorder: "#0284C7",
    iconBg: "#D8EEFB",
    iconColor: "#0369A1",
    tagBg: "#E0F2FE",
    tagColor: "#075985",
    glowColor: "rgba(2, 132, 199, 0.16)"
  },
  {
    icon: HeartHandshake,
    title: "Ethical Dairy",
    desc: "Free-grazing indigenous Gir cows, no hormones",
    tag: "A2 Vedic Care",
    bg: "#FAF1EA",
    border: "#EACFBF",
    hoverBorder: "#EA580C",
    iconBg: "#F6DFD1",
    iconColor: "#C2410C",
    tagBg: "#FFEDD5",
    tagColor: "#9A3412",
    glowColor: "rgba(234, 88, 12, 0.16)"
  }
];

const ValueBox = ({ item }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const Icon = item.icon;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: item.bg,
        border: `1.5px solid ${isHovered ? item.hoverBorder : item.border}`,
        borderRadius: '16px',
        padding: '20px 18px',
        boxShadow: isHovered 
          ? `0 12px 28px ${item.glowColor}` 
          : '0 3px 10px rgba(0, 0, 0, 0.03)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
        cursor: 'default'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: item.iconBg,
          color: item.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: `1px solid ${item.border}`
        }}>
          <Icon size={22} />
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: '700',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          padding: '4px 8px',
          borderRadius: '20px',
          backgroundColor: item.tagBg,
          color: item.tagColor,
          border: `1px solid ${item.border}`
        }}>
          {item.tag}
        </span>
      </div>

      <div>
        <div style={{
          fontWeight: '700',
          fontSize: '0.98rem',
          color: '#183626',
          marginBottom: '5px',
          letterSpacing: '-0.01em'
        }}>
          {item.title}
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: '#4B5563',
          lineHeight: 1.45
        }}>
          {item.desc}
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto'
    }}>
      {/* Value Proposition Highlights Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #EDE6D8',
        borderBottom: '1px solid #EDE6D8',
        padding: '36px 0',
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {VALUE_PROPS.map((item, idx) => (
            <ValueBox key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{
        backgroundColor: '#0F2318',
        color: '#FAF7F2',
        borderTop: '1px solid rgba(232, 197, 130, 0.25)',
      }}>
        <div className="container" style={{ padding: '48px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '36px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <BrandLogo variant="compact" theme="light" size="md" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#CBD5CB', lineHeight: 1.6, marginBottom: '16px' }}>
              Connecting conscious families directly with free-grazing dairy farms. Unprocessed raw A2 milk, slow-churned Vedic Bilona ghee, and daily morning subscriptions delivered in sanitized glass bottles.
            </p>
            <div style={{ fontSize: '0.82rem', color: '#E8C582', fontWeight: '600' }}>
              FSSAI Lic. No. 10024043000492
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 style={{ color: '#FAF7F2', fontSize: '1rem', marginBottom: '16px', borderBottom: '2px solid #E8C582', paddingBottom: '6px', display: 'inline-block' }}>
              Dairy Pantry
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <Link to="/products?category=milk" style={{ color: '#CBD5CB' }}>A2 Gir Cow Milk</Link>
              <Link to="/products?category=curd-yogurt" style={{ color: '#CBD5CB' }}>Clay-Pot Set Dahi</Link>
              <Link to="/products?category=paneer-cheese" style={{ color: '#CBD5CB' }}>Fresh Malai Paneer</Link>
              <Link to="/products?category=ghee-butter" style={{ color: '#CBD5CB' }}>Vedic Bilona Ghee</Link>
              <Link to="/products?category=traditional-indian" style={{ color: '#CBD5CB' }}>Slow-Cooked Khoya</Link>
              <Link to="/products?category=beverages" style={{ color: '#CBD5CB' }}>Spiced Masala Chaas</Link>
            </div>
          </div>

          {/* Subscriptions & Help */}
          <div>
            <h4 style={{ color: '#FAF7F2', fontSize: '1rem', marginBottom: '16px', borderBottom: '2px solid #E8C582', paddingBottom: '6px', display: 'inline-block' }}>
              Customer Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <Link to="/subscriptions" style={{ color: '#CBD5CB' }}>Morning Subscriptions</Link>
              <Link to="/orders" style={{ color: '#CBD5CB' }}>Order Tracking &amp; History</Link>
              <Link to="/addresses" style={{ color: '#CBD5CB' }}>Doorstep Delivery Instructions</Link>
              <Link to="/wishlist" style={{ color: '#CBD5CB' }}>Saved Favorites</Link>
              <Link to="/profile" style={{ color: '#CBD5CB' }}>MilkMart Wallet (₹1,250)</Link>
              <Link to="/admin" style={{ color: '#E8C582', fontWeight: '600' }}>Admin Operations Portal</Link>
              <Link to="/delivery" style={{ color: '#E8C582', fontWeight: '600' }}>Delivery Driver Portal</Link>
            </div>
          </div>

          {/* Farm Contact & Hours */}
          <div>
            <h4 style={{ color: '#FAF7F2', fontSize: '1rem', marginBottom: '16px', borderBottom: '2px solid #E8C582', paddingBottom: '6px', display: 'inline-block' }}>
              Farm Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#CBD5CB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#E8C582" /> +91 1800-425-MILK (Toll Free)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#E8C582" /> morningrun@milkmart.farm
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} color="#E8C582" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>MilkMart Agro Farms, Kanakapura Valley, Bengaluru Rural, KA 562117</span>
              </div>
              <div style={{ marginTop: '8px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', fontSize: '0.78rem' }}>
                <strong>Morning Delivery Window:</strong><br />
                Every day from 5:30 AM to 7:30 AM before sunrise.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          color: '#798C80'
        }}>
          <div>
            © 2026 MilkMart Pure Farm Private Limited. All rights reserved. Glass Bottle Circular Economy.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cold Chain Compliance</span>
            <span>FSSAI Certified</span>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};
