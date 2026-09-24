import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShoppingBag, Calendar, AlertTriangle, 
  ThermometerSnowflake, Droplets, ShieldCheck, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { products, chillerTelemetry } = useProducts();
  const { orders } = useOrders();
  const { subscriptions } = useSubscriptions();

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0) + 148500; // Realistic running total
  const activeSubsCount = subscriptions.filter(s => s.status === 'Active').length;
  const lowStockItems = products.filter(p => p.stock < 25);
  const outOfStockItems = products.filter(p => p.availability === 'Out of Stock');

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
            Dairy Operations Dashboard
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
            Live procurement telemetry, morning dispatch progress, and bottle inventory
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{
            backgroundColor: '#E8F5EE',
            color: '#196D3D',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
            Morning Run Shift: Active (5:30 AM – 7:30 AM)
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div className="card-artisan" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#798C80', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '600' }}>Total Farm Revenue</span>
            <TrendingUp size={18} color="#196D3D" />
          </div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#183626' }}>
            ₹{totalSales.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#196D3D', marginTop: '4px', fontWeight: '600' }}>
            ↑ 14.8% vs last week
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#798C80', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '600' }}>Total Orders</span>
            <ShoppingBag size={18} color="#0E587B" />
          </div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#183626' }}>
            {orders.length + 380}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#0E587B', marginTop: '4px', fontWeight: '600' }}>
            98.4% On-time sunrise deliveries
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#798C80', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '600' }}>Active Morning Subs</span>
            <Calendar size={18} color="#8E5A17" />
          </div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#183626' }}>
            {activeSubsCount + 142}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8E5A17', marginTop: '4px', fontWeight: '600' }}>
            Recurring daily bottles
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#798C80', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '600' }}>Glass Bottle Return Rate</span>
            <CheckCircle2 size={18} color="#196D3D" />
          </div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#196D3D' }}>
            94.2%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#798C80', marginTop: '4px' }}>
            Zero plastic waste circular loop
          </div>
        </div>
      </div>

      {/* Chiller Tank Telemetry & Procurement Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E6DEC9',
        padding: '26px',
        marginBottom: '28px',
        boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThermometerSnowflake size={22} color="#0E587B" />
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#183626', margin: 0 }}>
                Bulk Milk Cooler (BMC) Telemetry
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#798C80' }}>
                Real-time IoT temperature and vat capacity sensors
              </p>
            </div>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#183626', backgroundColor: '#E8F5EE', padding: '4px 12px', borderRadius: '12px', fontWeight: '700' }}>
            Avg Temp: {chillerTelemetry.averageChillerTemp}°C (Safe &lt; 4.0°C)
          </div>
        </div>

        {/* 4 Chiller Vats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {chillerTelemetry.bulkMilkCoolerVats.map((vat) => (
            <div
              key={vat.id}
              style={{
                backgroundColor: '#FAF5EE',
                border: '1px solid #E6DEC9',
                borderRadius: '14px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.92rem', color: '#183626' }}>{vat.name}</strong>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0E587B' }}>{vat.temp}°C</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#55685C', marginBottom: '8px' }}>
                {vat.currentLiters.toLocaleString()} L / {vat.capacityLiters.toLocaleString()} L
              </div>
              {/* Progress bar */}
              <div style={{ height: '7px', backgroundColor: '#E6DEC9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(vat.currentLiters / vat.capacityLiters) * 100}%`,
                  height: '100%',
                  backgroundColor: '#183626'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Today's Procurement Lab Test Stats */}
        <div style={{
          backgroundColor: '#FAF7F2',
          border: '1px solid #EFE8D8',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          fontSize: '0.84rem'
        }}>
          <div>
            <span style={{ color: '#798C80' }}>Total Morning Inflow:</span>
            <div style={{ fontWeight: '700', color: '#183626' }}>{chillerTelemetry.todayProcurement.totalLitersReceived.toLocaleString()} Liters</div>
          </div>
          <div>
            <span style={{ color: '#798C80' }}>Avg Fat Content:</span>
            <div style={{ fontWeight: '700', color: '#A26D24' }}>{chillerTelemetry.todayProcurement.avgFatPercentage}%</div>
          </div>
          <div>
            <span style={{ color: '#798C80' }}>Avg SNF:</span>
            <div style={{ fontWeight: '700', color: '#183626' }}>{chillerTelemetry.todayProcurement.avgSNF}%</div>
          </div>
          <div>
            <span style={{ color: '#798C80' }}>Purity Tests:</span>
            <div style={{ fontWeight: '700', color: '#196D3D' }}>{chillerTelemetry.todayProcurement.adulterationTests}</div>
          </div>
        </div>
      </div>

      {/* Grid: Low Stock Alert + Best Selling Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Low Stock Alerts */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E6DEC9',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#B2341A" />
              <h3 style={{ fontSize: '1.15rem', color: '#183626', margin: 0 }}>
                Chiller &amp; Inventory Alerts ({lowStockItems.length + outOfStockItems.length})
              </h3>
            </div>
            <Link to="/admin/inventory" style={{ fontSize: '0.82rem', color: '#8E5A17', fontWeight: '700' }}>
              View Inventory
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {outOfStockItems.map((p) => (
              <div key={p.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#FDE8E4',
                fontSize: '0.84rem'
              }}>
                <div>
                  <strong style={{ color: '#B2341A' }}>{p.name}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#798C80' }}>{p.size} • Sold out for sunrise run</div>
                </div>
                <span style={{ fontWeight: '700', color: '#B2341A' }}>0 Units</span>
              </div>
            ))}

            {lowStockItems.slice(0, 3).map((p) => (
              <div key={p.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#FDF4E3',
                fontSize: '0.84rem'
              }}>
                <div>
                  <strong style={{ color: '#8E5A17' }}>{p.name}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#798C80' }}>{p.size} • Low batch remaining</div>
                </div>
                <span style={{ fontWeight: '700', color: '#8E5A17' }}>{p.stock} Units</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Products */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E6DEC9',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#183626', margin: 0 }}>
              Top Daily Subscribed Dairy
            </h3>
            <Link to="/admin/products" style={{ fontSize: '0.82rem', color: '#8E5A17', fontWeight: '700' }}>
              Manage Products
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.slice(0, 4).map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #F1EDE3', paddingBottom: '10px' }}>
                <img src={p.image} alt={p.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>{p.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#798C80' }}>{p.brand} • {p.size}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.92rem' }}>₹{p.price}</div>
                  <div style={{ fontSize: '0.74rem', color: '#196D3D', fontWeight: '600' }}>{p.reviewCount} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
