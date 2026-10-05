import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  TrendingUp, DollarSign, Calendar, Download, 
  ArrowUpRight, ShoppingBag, Percent, ShieldCheck, 
  Sparkles, Filter, ChevronDown, RefreshCw
} from 'lucide-react';

export const SellerSales = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('month'); // today, week, month, all

  const loadData = async () => {
    try {
      if (user?.id) {
        const data = await sellerService.getSalesAnalytics(user.id);
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  const handleExportCSV = () => {
    if (!analytics?.salesLedger?.length) {
      showToast('No sales records to export', 'info');
      return;
    }

    const headers = ["Order ID", "Date", "Product", "Quantity", "Gross Revenue (INR)", "Platform Fee 5% (INR)", "Net Seller Earnings (INR)", "Payment Method"];
    const rows = analytics.salesLedger.map(item => [
      `"${item.id}"`,
      `"${item.date}"`,
      `"${item.product}"`,
      item.quantity,
      item.grossRevenue,
      item.fee,
      item.netEarnings,
      `"${item.paymentMethod}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `milkmart_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales report CSV downloaded successfully!', 'success');
  };

  if (loading || !analytics) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <RefreshCw className="animate-spin" size={32} color="#183626" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: '#55685C' }}>Aggregating farm sales revenue...</p>
      </div>
    );
  }

  // Max value for SVG chart scaling
  const maxRevenue = Math.max(...(analytics.dailyTrend?.map(d => d.revenue) || [10000]));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
            Revenue &amp; Payout Analytics
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Sales &amp; Financial Ledger
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
            Track gross farm turnover, low 5% platform commissions, and net bank payout disbursements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#183626',
              color: '#FAF7F2',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(24, 54, 38, 0.2)'
            }}
          >
            <Download size={15} color="#E8C582" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* KPI Revenue Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Sales Today */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '20px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Sales Today</span>
            <span style={{ backgroundColor: '#E8F5E9', padding: '4px 8px', borderRadius: '20px', color: '#2E7D32', fontSize: '0.72rem', fontWeight: '800' }}>+12%</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, Georgia, serif' }}>
            ₹{analytics.todayRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#55685C' }}>Harvested 4:30 AM drop</span>
        </div>

        {/* Sales This Week */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '20px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Sales This Week</span>
            <span style={{ backgroundColor: '#E8F5E9', padding: '4px 8px', borderRadius: '20px', color: '#2E7D32', fontSize: '0.72rem', fontWeight: '800' }}>+24%</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, Georgia, serif' }}>
            ₹{analytics.weekRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#55685C' }}>7-day recurring orders</span>
        </div>

        {/* Sales This Month */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '20px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Total Revenue</span>
            <span style={{ backgroundColor: '#EFE8D8', padding: '4px 8px', borderRadius: '20px', color: '#A26D24', fontSize: '0.72rem', fontWeight: '800' }}>Gross</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, Georgia, serif' }}>
            ₹{analytics.totalRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#55685C' }}>{analytics.totalOrders} total shipments</span>
        </div>

        {/* Net Seller Earnings */}
        <div style={{
          backgroundColor: '#183626',
          borderRadius: '16px',
          border: '1px solid #132A1E',
          padding: '20px',
          color: '#FAF7F2',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#E8C582', textTransform: 'uppercase', fontWeight: '700' }}>Net Farm Earnings</span>
            <span style={{ backgroundColor: 'rgba(232, 197, 130, 0.2)', padding: '4px 8px', borderRadius: '20px', color: '#E8C582', fontSize: '0.72rem', fontWeight: '800' }}>95% Take-Home</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#FAF7F2', fontFamily: 'Fraunces, Georgia, serif' }}>
            ₹{analytics.netSellerEarnings.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#A5B5AA' }}>After ₹{analytics.platformFee} platform maintenance fee</span>
        </div>

      </div>

      {/* 7-Day Revenue Trend Chart */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Daily Revenue Performance
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#55685C' }}>Real-time sales velocity over the past 7 days</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#55685C' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#183626', display: 'inline-block' }} /> Gross Sales (₹)
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#E8C582', display: 'inline-block', marginLeft: '10px' }} /> Order Count
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div style={{ width: '100%', height: '220px', position: 'relative' }}>
          <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
              <line
                key={i}
                x1="0"
                y1={pct * 170 + 10}
                x2="100%"
                y2={pct * 170 + 10}
                stroke="#F0ECE1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Bars */}
            {analytics.dailyTrend?.map((item, idx) => {
              const count = analytics.dailyTrend.length;
              const barWidth = 44;
              const xPercent = (idx / (count - 1)) * 88 + 6;
              const barHeight = (item.revenue / maxRevenue) * 160;
              const yPos = 180 - barHeight;

              return (
                <g key={idx}>
                  {/* Revenue Bar */}
                  <rect
                    x={`${xPercent}%`}
                    y={yPos}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill="#183626"
                    style={{ transform: `translateX(-${barWidth / 2}px)`, transition: 'all 0.3s ease' }}
                  />
                  {/* Revenue Amount Label */}
                  <text
                    x={`${xPercent}%`}
                    y={yPos - 8}
                    textAnchor="middle"
                    fill="#183626"
                    fontSize="11"
                    fontWeight="700"
                  >
                    ₹{item.revenue}
                  </text>
                  {/* Day Label */}
                  <text
                    x={`${xPercent}%`}
                    y="204"
                    textAnchor="middle"
                    fill="#7E8B82"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {item.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sales Transactions Ledger Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E2D5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Itemized Sales Ledger
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#55685C' }}>
              Individual orders fulfilled from your farm facility
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#7E8B82', fontWeight: '600' }}>
            {analytics.salesLedger?.length || 0} Records
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D5' }}>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Order ID</th>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Date</th>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Product</th>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Qty</th>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Gross</th>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>5% Fee</th>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Net Payout</th>
                <th style={{ padding: '12px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {(analytics.salesLedger || []).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F0ECE1' }}>
                  <td style={{ padding: '14px 18px', fontWeight: '700', color: '#183626' }}>
                    #{row.id}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: '#55685C' }}>
                    {row.date}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>
                    {row.product}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: '#55685C' }}>
                    {row.quantity}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: '700', color: '#183626' }}>
                    ₹{row.grossRevenue}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: '#C62828' }}>
                    -₹{row.fee}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: '800', color: '#196D3D' }}>
                    ₹{row.netEarnings}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: '#EFE8D8',
                      color: '#183626',
                      fontSize: '0.74rem',
                      fontWeight: '700'
                    }}>
                      {row.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
