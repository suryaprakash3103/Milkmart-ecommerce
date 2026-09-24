import React from 'react';
import { X, Printer, Download, CheckCircle, FileText, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const TaxInvoiceModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const items = order.items || [];
  
  // Calculate GST breakdowns if not already present
  let totalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;

  const processedItems = items.map((item, idx) => {
    const rate = typeof item.gstRate === 'number' ? item.gstRate : (item.name.toLowerCase().includes('ghee') ? 12 : item.name.toLowerCase().includes('milk') ? 0 : 5);
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    const taxable = Number((itemTotal / (1 + rate / 100)).toFixed(2));
    const gst = Number((itemTotal - taxable).toFixed(2));
    const cgst = Number((gst / 2).toFixed(2));
    const sgst = Number((gst / 2).toFixed(2));

    totalTaxable += taxable;
    totalCgst += cgst;
    totalSgst += sgst;

    return {
      ...item,
      hsnCode: item.hsnCode || (rate === 12 ? '0405' : rate === 0 ? '0401' : '0403'),
      gstRate: rate,
      taxable,
      cgst,
      sgst,
      itemTotal
    };
  });

  const invoiceNo = `MM-INV-${order.id ? order.id.replace('MM-', '') : '2026'}`;
  const invoiceDate = order.date || new Date().toLocaleDateString('en-IN');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '820px', 
          maxHeight: '92vh', 
          overflowY: 'auto', 
          backgroundColor: '#FFFFFF',
          padding: 0,
          borderRadius: '20px'
        }}
      >
        {/* Top Control Bar */}
        <div style={{
          backgroundColor: '#183626',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FAF7F2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#E8C582" />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>
              Tax Invoice — #{invoiceNo}
            </span>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#E8C582', color: '#183626', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
              GST COMPLIANT
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(232, 197, 130, 0.4)',
                color: '#FAF7F2',
                padding: '6px 14px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <Printer size={16} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FAF7F2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" style={{ padding: '36px', color: '#183626', fontSize: '0.88rem' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #183626', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <BrandLogo variant="standard" theme="dark" size="md" />
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#55685C', lineHeight: 1.5 }}>
                <strong>MilkMart Pure Farm Private Limited</strong><br />
                Kanakapura Valley Agro Farm, Harohalli Industrial Area,<br />
                Bengaluru Rural, Karnataka - 562117<br />
                <strong>GSTIN:</strong> 29AABCM8491K1Z2 | <strong>State Code:</strong> 29 (KA)<br />
                <strong>FSSAI Central Lic No:</strong> 10024043000492 | CIN: U01409KA2026PTC184910
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', color: '#183626', margin: '0 0 6px 0' }}>
                TAX INVOICE
              </h2>
              <div style={{ fontSize: '0.84rem', color: '#4A5568', lineHeight: 1.6 }}>
                <div><strong>Invoice No:</strong> {invoiceNo}</div>
                <div><strong>Invoice Date:</strong> {invoiceDate}</div>
                <div><strong>Order Ref:</strong> #{order.id}</div>
                <div><strong>Time Slot:</strong> {order.timeSlot || 'Morning Run 5:30 AM'}</div>
                <div><strong>Place of Supply:</strong> Karnataka (Code 29)</div>
              </div>
            </div>
          </div>

          {/* Customer / Billing details */}
          <div style={{
            backgroundColor: '#FAF7F2',
            border: '1px solid #E6DEC9',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8E5A17', textTransform: 'uppercase', marginBottom: '4px' }}>
                Billed &amp; Delivered To (Customer)
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.98rem' }}>
                {order.deliveryAddress?.name || 'Surya Prakash'}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#55685C', lineHeight: 1.45, marginTop: '2px' }}>
                {order.deliveryAddress?.house || 'Flat 402, Green Meadows'}, {order.deliveryAddress?.street || '14th Main, 4th Sector'}<br />
                {order.deliveryAddress?.city || 'Bengaluru'}, {order.deliveryAddress?.state || 'Karnataka'} - {order.deliveryAddress?.pincode || '560102'}<br />
                Phone: {order.deliveryAddress?.phone || '+91 98450 12345'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8E5A17', textTransform: 'uppercase', marginBottom: '4px' }}>
                Tax &amp; Payment Details
              </div>
              <div style={{ fontSize: '0.84rem', color: '#55685C', lineHeight: 1.5 }}>
                <div><strong>Buyer Type:</strong> Consumer (B2C)</div>
                <div><strong>Payment Method:</strong> {order.paymentMethod || 'MilkMart Wallet'}</div>
                <div><strong>Payment Status:</strong> {order.paymentStatus || 'Paid (Auto-Settled)'}</div>
                <div><strong>Doorstep Drop:</strong> {order.instructions || 'Leave inside insulated pouch'}</div>
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#183626', color: '#FAF7F2', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', borderTopLeftRadius: '8px' }}>#</th>
                  <th style={{ padding: '10px 12px' }}>Description of Dairy Produce</th>
                  <th style={{ padding: '10px 12px' }}>HSN</th>
                  <th style={{ padding: '10px 12px' }}>Qty</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Taxable Val</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>CGST</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>SGST</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', borderTopRightRadius: '8px' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {processedItems.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E6DEC9' }}>
                    <td style={{ padding: '10px 12px' }}>{i + 1}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: '700', color: '#183626' }}>{item.name}</div>
                      <div style={{ fontSize: '0.76rem', color: '#798C80' }}>Pack: {item.size || '1 L'} • Glass Bottle Loop</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{item.hsnCode}</td>
                    <td style={{ padding: '10px 12px' }}>{item.quantity}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{item.taxable.toFixed(2)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {item.gstRate === 0 ? '0%' : `${(item.gstRate / 2)}%`}<br />
                      <span style={{ fontSize: '0.74rem', color: '#798C80' }}>₹{item.cgst.toFixed(2)}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {item.gstRate === 0 ? '0%' : `${(item.gstRate / 2)}%`}<br />
                      <span style={{ fontSize: '0.74rem', color: '#798C80' }}>₹{item.sgst.toFixed(2)}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700' }}>
                      ₹{item.itemTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Breakup Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
            <div style={{ maxWidth: '380px' }}>
              <div style={{
                backgroundColor: '#FAF7F2',
                border: '1px solid #E6DEC9',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '0.8rem'
              }}>
                <div style={{ fontWeight: '700', color: '#183626', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#8E5A17" />
                  Glass Bottle Circular Economy Exemption
                </div>
                <div style={{ color: '#55685C', lineHeight: 1.4 }}>
                  Bottle caution deposit (₹0) waived under MilkMart active return loop. Customer retains sanitised European glass bottles for subsequent morning exchange.
                </div>
              </div>
            </div>

            <div style={{ width: '280px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#55685C' }}>
                <span>Total Taxable Value:</span>
                <span style={{ fontWeight: '600' }}>₹{totalTaxable.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#55685C' }}>
                <span>Total CGST:</span>
                <span style={{ fontWeight: '600' }}>₹{totalCgst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#55685C' }}>
                <span>Total SGST:</span>
                <span style={{ fontWeight: '600' }}>₹{totalSgst.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#15803D' }}>
                  <span>Farm Discount Applied:</span>
                  <span>-₹{Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#55685C' }}>
                <span>Doorstep Delivery Fee:</span>
                <span>{order.deliveryFee === 0 ? 'FREE (Sunrise Slot)' : `₹${order.deliveryFee}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0 0 0',
                borderTop: '2px solid #183626',
                marginTop: '6px',
                fontSize: '1.1rem',
                fontWeight: '800',
                color: '#183626'
              }}>
                <span>Total Payable:</span>
                <span style={{ color: '#8E5A17' }}>₹{Number(order.total || order.subtotal).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signatory & FSSAI Footer */}
          <div style={{
            borderTop: '1px solid #E6DEC9',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '0.78rem',
            color: '#798C80'
          }}>
            <div>
              <div style={{ fontWeight: '700', color: '#183626', marginBottom: '2px' }}>
                100% Unbroken Cold-Chain Compliance
              </div>
              <div>Milked at 4:30 AM • Packaged at 4°C • Laboratory Batch Tested for Purity</div>
              <div>This is a computer-generated tax invoice verified under the CGST/SGST Act 2017.</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '0.95rem', color: '#183626', fontStyle: 'italic', marginBottom: '4px' }}>
                MilkMart Agro Operations
              </div>
              <div style={{ borderTop: '1px solid #183626', paddingTop: '4px', fontWeight: '700', color: '#183626' }}>
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
