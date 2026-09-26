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

      {/* Inline SVG Charts: 7-Day Volume Dispatched & Bottle Circular Loop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Chart 1: 7-Day Liters Dispatched */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E6DEC9',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#183626', margin: 0 }}>
                7-Day Sunrise Dispatch (Liters)
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#798C80' }}>Morning 5:30 AM route deliveries</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#196D3D', backgroundColor: '#E8F5EE', padding: '3px 10px', borderRadius: '12px' }}>
              Avg: 480L / day
            </span>
          </div>

          <div style={{ width: '100%', height: '160px' }}>
            <svg viewBox="0 0 350 140" style={{ width: '100%', height: '100%' }}>
              {/* Grid lines */}
              <line x1="30" y1="20" x2="340" y2="20" stroke="#F1EDE3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="340" y2="60" stroke="#F1EDE3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="340" y2="100" stroke="#F1EDE3" strokeWidth="1" strokeDasharray="3 3" />

              {/* Y Axis text */}
              <text x="22" y="24" fontSize="9" fill="#798C80" textAnchor="end">600L</text>
              <text x="22" y="64" fontSize="9" fill="#798C80" textAnchor="end">400L</text>
              <text x="22" y="104" fontSize="9" fill="#798C80" textAnchor="end">200L</text>

              {/* Bars: Mon - Sun */}
              {[
                { day: 'Mon', h: 75, val: '430L', x: 45 },
                { day: 'Tue', h: 80, val: '450L', x: 88 },
                { day: 'Wed', h: 85, val: '480L', x: 131 },
                { day: 'Thu', h: 82, val: '465L', x: 174 },
                { day: 'Fri', h: 90, val: '510L', x: 217 },
                { day: 'Sat', h: 105, val: '580L', x: 260 },
                { day: 'Sun', h: 108, val: '595L', x: 303 }
              ].map((bar, i) => (
                <g key={i}>
                  <rect
                    x={bar.x}
                    y={110 - bar.h}
                    width="24"
                    height={bar.h}
                    rx="4"
                    fill={i >= 5 ? '#E8C582' : '#183626'}
                  />
                  <text x={bar.x + 12} y="126" fontSize="9.5" fill="#55685C" textAnchor="middle" fontWeight="600">
                    {bar.day}
                  </text>
                  <text x={bar.x + 12} y={105 - bar.h} fontSize="8" fill="#183626" textAnchor="middle" fontWeight="700">
                    {bar.val}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: 7-Day Bottle Return Rate % Area Trend */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E6DEC9',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#183626', margin: 0 }}>
                Glass Bottle Return Loop Trend
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#798C80' }}>Empties returned / bottles dropped</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#196D3D', backgroundColor: '#E8F5EE', padding: '3px 10px', borderRadius: '12px' }}>
              Target: 95%
            </span>
          </div>

          <div style={{ width: '100%', height: '160px' }}>
            <svg viewBox="0 0 350 140" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#196D3D" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#196D3D" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="30" y1="20" x2="340" y2="20" stroke="#F1EDE3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="340" y2="60" stroke="#F1EDE3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="340" y2="100" stroke="#F1EDE3" strokeWidth="1" strokeDasharray="3 3" />

              <text x="24" y="24" fontSize="9" fill="#798C80" textAnchor="end">98%</text>
              <text x="24" y="64" fontSize="9" fill="#798C80" textAnchor="end">94%</text>
              <text x="24" y="104" fontSize="9" fill="#798C80" textAnchor="end">90%</text>

              {/* Area path */}
              <path
                d="M 50,75 L 95,70 L 140,65 L 185,58 L 230,50 L 275,44 L 320,38 L 320,110 L 50,110 Z"
                fill="url(#areaGrad)"
              />

              {/* Line path */}
              <path
                d="M 50,75 L 95,70 L 140,65 L 185,58 L 230,50 L 275,44 L 320,38"
                fill="none"
                stroke="#196D3D"
                strokeWidth="2.5"
              />

              {/* Points & Days */}
              {[
                { x: 50, y: 75, day: 'Mon', p: '92.4%' },
                { x: 95, y: 70, day: 'Tue', p: '93.0%' },
                { x: 140, y: 65, day: 'Wed', p: '93.6%' },
                { x: 185, y: 58, day: 'Thu', p: '94.2%' },
                { x: 230, y: 50, day: 'Fri', p: '94.9%' },
                { x: 275, y: 44, day: 'Sat', p: '95.4%' },
                { x: 320, y: 38, day: 'Sun', p: '95.8%' }
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#FAF7F2" stroke="#196D3D" strokeWidth="2" />
                  <text x={pt.x} y="126" fontSize="9.5" fill="#55685C" textAnchor="middle" fontWeight="600">
                    {pt.day}
                  </text>
                </g>
              ))}
            </svg>
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
