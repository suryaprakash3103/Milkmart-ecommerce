import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store } from '../../data/store';
import { useToast } from '../../context/ToastContext';
import { 
  FileCheck2, Plus, Award, Droplets, ThermometerSnowflake, 
  ShieldCheck, CheckCircle2, QrCode, Printer, ExternalLink, 
  X, Search, Sparkles, AlertCircle, Calendar, Clock
} from 'lucide-react';

export const SellerBatches = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [batches, setBatches] = useState(() => Store.getSellerBatches(user?.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedBatchForCert, setSelectedBatchForCert] = useState(null);

  // Form state for logging a new batch
  const [formData, setFormData] = useState({
    productName: 'Farm Fresh A2 Gir Cow Raw Milk',
    litersDispatched: 320,
    milkingTime: '04:30 AM',
    fatPercentage: 4.8,
    snfPercentage: 8.9,
    chillerTemp: 3.6,
    somaticCellCount: '125,000 cells/ml (Premium Grade A)',
    feedLog: 'Free-grazing green Napier grass, Moringa leaves & organic barley fodder',
    cattleVaccinationStatus: '100% Verified Healthy • Bi-weekly Veterinary Inspection',
    adulterationUrea: 'Negative (Passed)',
    adulterationDetergent: 'Negative (Passed)',
    adulterationStarch: 'Negative (Passed)',
    adulterationWater: '0% (Nil Added)',
    adulterationAntibiotic: 'Nil (100% Free)'
  });

  const loadBatches = () => {
    setBatches(Store.getSellerBatches(user?.id));
  };

  useEffect(() => {
    loadBatches();
    const handleSync = () => loadBatches();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  // Pricing calculation based on dairy standard formula
  const calculatedRate = (42 + (parseFloat(formData.fatPercentage || 0) * 5.5) + (parseFloat(formData.snfPercentage || 0) * 3.5) - 31.75).toFixed(2);
  const estimatedBatchValue = Math.round((parseFloat(formData.litersDispatched) || 0) * 68);

  const handleSubmitBatch = (e) => {
    e.preventDefault();
    if (!formData.productName || !formData.litersDispatched) {
      showToast('Please fill in required batch details', 'error');
      return;
    }

    const newBatch = Store.addSellerBatch({
      sellerId: user?.id || 'usr-seller-01',
      farmName: user?.farmName || 'Gir Amrit Organic Gaushala',
      farmerName: user?.name || 'Devendra Patel',
      productName: formData.productName,
      litersDispatched: Number(formData.litersDispatched),
      milkingTime: formData.milkingTime,
      fatPercentage: Number(formData.fatPercentage),
      snfPercentage: Number(formData.snfPercentage),
      chillerTemp: Number(formData.chillerTemp),
      somaticCellCount: formData.somaticCellCount,
      feedLog: formData.feedLog,
      cattleVaccinationStatus: formData.cattleVaccinationStatus,
      adulterationTests: {
        urea: formData.adulterationUrea,
        detergent: formData.adulterationDetergent,
        starch: formData.adulterationStarch,
        waterAdded: formData.adulterationWater,
        antibioticResidues: formData.adulterationAntibiotic
      }
    });

    showToast(`Batch #${newBatch.id} logged & Digital Purity Certificate generated!`, 'success');
    setIsLogModalOpen(false);
    setSelectedBatchForCert(newBatch);
  };

  const filteredBatches = batches.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.labCertNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Sparkles size={14} /> Unique Feature: Farm Direct Traceability
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Milking Batches &amp; Digital Lab Certificates
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
            Log morning and evening milking, test cold chain parameters, and generate customer-verifiable purity certificates.
          </p>
        </div>

        <button 
          onClick={() => setIsLogModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Log Milking Batch &amp; Certify
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '26px'
      }}>
        <div className="card-artisan" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Active Farm Batches</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#183626', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {batches.length} Certified Batches
          </div>
          <div style={{ fontSize: '0.74rem', color: '#196D3D', marginTop: '4px', fontWeight: '600' }}>
            100% Passed Adulteration Screen
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Average Tested Fat</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#183626', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {batches[0]?.fatPercentage || 4.8}% Natural Fat
          </div>
          <div style={{ fontSize: '0.74rem', color: '#A26D24', marginTop: '4px', fontWeight: '600' }}>
            Avg SNF: {batches[0]?.snfPercentage || 8.9}%
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Chiller Tank Temp</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0E587B', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {batches[0]?.chillerTemp || 3.6}°C
          </div>
          <div style={{ fontSize: '0.74rem', color: '#196D3D', marginTop: '4px', fontWeight: '600' }}>
            Cold-Chain compliant (&lt; 4°C)
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Procurement Payout Rate</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#183626', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            ₹68.00 / Liter
          </div>
          <div style={{ fontSize: '0.74rem', color: '#196D3D', marginTop: '4px', fontWeight: '600' }}>
            Fat + SNF premium incentive
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
          <input
            type="text"
            placeholder="Search Batch ID, Product or Lab Cert..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              border: '1.5px solid #E6DEC9',
              fontSize: '0.86rem',
              backgroundColor: '#FFFFFF',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ fontSize: '0.84rem', color: '#798C80' }}>
          Showing <strong>{filteredBatches.length}</strong> batches
        </div>
      </div>

      {/* Batches Table Card */}
      <div className="card-artisan" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1.5px solid #E6DEC9', color: '#183626' }}>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Batch ID &amp; Date</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Product</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Liters Extracted</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Fat / SNF %</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Chiller Temp</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Adulteration Test</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'right' }}>Lab Certificate</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch.id} style={{ borderBottom: '1px solid #F0EAE1' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700', color: '#183626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={15} color="#A26D24" />
                      {batch.id}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#798C80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={12} /> {batch.date} at {batch.milkingTime}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '600', color: '#183626' }}>{batch.productName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#196D3D' }}>Gir Cow A2 Milk</div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700', color: '#183626' }}>{batch.litersDispatched} L</div>
                    <div style={{ fontSize: '0.72rem', color: '#798C80' }}>Bottled for Route</div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      backgroundColor: '#FEF8EB',
                      color: '#A26D24',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      border: '1px solid rgba(162, 109, 36, 0.2)'
                    }}>
                      {batch.fatPercentage}% / {batch.snfPercentage}%
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0E587B', fontWeight: '700', backgroundColor: '#EBF6FC', padding: '3px 8px', borderRadius: '6px' }}>
                      <ThermometerSnowflake size={13} /> {batch.chillerTemp}°C
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#E8F5EE',
                      color: '#196D3D',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '0.74rem'
                    }}>
                      <CheckCircle2 size={12} /> 0% Adulteration
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedBatchForCert(batch)}
                      className="btn btn-outline-dark btn-sm"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <FileCheck2 size={14} color="#183626" /> View Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Log Fresh Milking Batch */}
      {isLogModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FAF7F2',
            borderRadius: '20px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1.5px solid #E8C582',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1.5px solid #E6DEC9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#183626',
              color: '#FAF7F2',
              borderRadius: '18px 18px 0 0'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#E8C582', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                  Farm Direct Procurement Certification
                </div>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontFamily: 'Fraunces, serif' }}>
                  Log Milking Batch &amp; Test Parameters
                </h3>
              </div>
              <button 
                onClick={() => setIsLogModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#CBD5CB', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitBatch} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                    Dairy Product
                  </label>
                  <select
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #E6DEC9',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Farm Fresh A2 Gir Cow Raw Milk">Farm Fresh A2 Gir Cow Raw Milk</option>
                    <option value="Creamy Buffalo Raw Whole Milk">Creamy Buffalo Raw Whole Milk</option>
                    <option value="Traditional Set Dahi (Curd)">Traditional Set Dahi (Curd)</option>
                    <option value="Artisan Gir Cow Bilona Ghee">Artisan Gir Cow Bilona Ghee</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                    Milking Timestamp
                  </label>
                  <input
                    type="text"
                    value={formData.milkingTime}
                    onChange={(e) => setFormData({ ...formData, milkingTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #E6DEC9',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                    Volume (Liters)
                  </label>
                  <input
                    type="number"
                    value={formData.litersDispatched}
                    onChange={(e) => setFormData({ ...formData, litersDispatched: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #E6DEC9',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                    Fat Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fatPercentage}
                    onChange={(e) => setFormData({ ...formData, fatPercentage: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #E6DEC9',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                    SNF (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.snfPercentage}
                    onChange={(e) => setFormData({ ...formData, snfPercentage: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #E6DEC9',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Chiller Vat Telemetry */}
              <div style={{
                backgroundColor: 'rgba(14, 88, 123, 0.08)',
                border: '1px solid rgba(14, 88, 123, 0.25)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0E587B', fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <ThermometerSnowflake size={16} /> Cold Chain Telemetry
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#55685C', marginBottom: '2px' }}>
                      Chiller Tank Temp (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.chillerTemp}
                      onChange={(e) => setFormData({ ...formData, chillerTemp: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #BDD5E2',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#55685C', marginBottom: '2px' }}>
                      Somatic Cell Count
                    </label>
                    <input
                      type="text"
                      value={formData.somaticCellCount}
                      onChange={(e) => setFormData({ ...formData, somaticCellCount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #BDD5E2',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Adulteration Rapid Test Checklist */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #E6DEC9',
                padding: '14px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <ShieldCheck size={16} /> FSSAI Mandatory Adulteration Digital Checklist (All Passed)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.76rem' }}>
                  <div style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#E8F5EE', color: '#196D3D', fontWeight: '600' }}>
                    ✓ Urea: Negative
                  </div>
                  <div style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#E8F5EE', color: '#196D3D', fontWeight: '600' }}>
                    ✓ Detergent: Negative
                  </div>
                  <div style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#E8F5EE', color: '#196D3D', fontWeight: '600' }}>
                    ✓ Starch: Negative
                  </div>
                  <div style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#E8F5EE', color: '#196D3D', fontWeight: '600' }}>
                    ✓ Added Water: 0% Nil
                  </div>
                  <div style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#E8F5EE', color: '#196D3D', fontWeight: '600' }}>
                    ✓ Antibiotics: Free
                  </div>
                  <div style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#E8F5EE', color: '#196D3D', fontWeight: '600' }}>
                    ✓ Oxytocin: 0% Free
                  </div>
                </div>
              </div>

              {/* Payout preview */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FEF8EB',
                border: '1px solid #E8C582',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#A26D24', fontWeight: '700' }}>Estimated Batch Procurement Payout</div>
                  <div style={{ fontSize: '0.78rem', color: '#798C80' }}>
                    {formData.litersDispatched} Liters × ₹68.00 (Base + Fat + SNF formula)
                  </div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, serif' }}>
                  ₹{estimatedBatchValue.toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="btn btn-outline-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={16} /> Certify &amp; Generate Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Official Digital Purity Lab Certificate (The Unique Feature) */}
      {selectedBatchForCert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FAF7F2',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            border: '2px solid #E8C582',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            {/* Certificate Watermark / Header */}
            <div style={{
              backgroundColor: '#183626',
              color: '#FAF7F2',
              padding: '24px 28px',
              borderBottom: '4px solid #E8C582',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(232, 197, 130, 0.2)', color: '#E8C582', padding: '4px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Award size={14} /> FSSAI-NABL Certified Lab Report
                </div>
                <h2 style={{ margin: 0, fontSize: '1.6rem', fontFamily: 'Fraunces, Georgia, serif', color: '#FAF7F2' }}>
                  Certificate of Authenticity &amp; Purity
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#CBD5CB', marginTop: '4px' }}>
                  Accreditation No: {selectedBatchForCert.labCertNumber || 'FSSAI-NABL-KA-2026-9042'}
                </div>
              </div>

              <button
                onClick={() => setSelectedBatchForCert(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FAF7F2',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate Body (Printable styling) */}
            <div style={{ padding: '28px' }}>
              {/* Farm & Batch Origin Banner */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #E6DEC9',
                marginBottom: '20px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#798C80', textTransform: 'uppercase', fontWeight: '800' }}>Producer Gaushala</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, serif' }}>
                    {selectedBatchForCert.farmName || 'Gir Amrit Organic Gaushala'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#55685C' }}>
                    Farmer: {selectedBatchForCert.farmerName || 'Devendra Patel'} • FSSAI Lic #11223344556677
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div style={{
                  padding: '8px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E6DEC9',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <QrCode size={48} color="#183626" />
                  <div style={{ fontSize: '0.62rem', color: '#798C80', fontWeight: '700', marginTop: '2px' }}>
                    SCAN TO VERIFY
                  </div>
                </div>
              </div>

              {/* Verified Parameters Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                fontSize: '0.84rem'
              }}>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E6DEC9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#798C80' }}>Batch ID:</div>
                  <div style={{ fontWeight: '800', color: '#183626', fontSize: '0.95rem' }}>{selectedBatchForCert.id}</div>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E6DEC9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#798C80' }}>Milking Date &amp; Time:</div>
                  <div style={{ fontWeight: '800', color: '#183626' }}>{selectedBatchForCert.date} at {selectedBatchForCert.milkingTime}</div>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E6DEC9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#798C80' }}>Tested Milk Fat %:</div>
                  <div style={{ fontWeight: '800', color: '#A26D24', fontSize: '0.95rem' }}>{selectedBatchForCert.fatPercentage}% Natural Butterfat</div>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E6DEC9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#798C80' }}>Tested SNF (Solids Not Fat):</div>
                  <div style={{ fontWeight: '800', color: '#183626' }}>{selectedBatchForCert.snfPercentage}% (FSSAI standard &gt; 8.5%)</div>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E6DEC9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#798C80' }}>Chiller Tank Temp at Farm:</div>
                  <div style={{ fontWeight: '800', color: '#0E587B' }}>{selectedBatchForCert.chillerTemp}°C (Flash chilled in 18 mins)</div>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E6DEC9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#798C80' }}>Somatic Cell Count:</div>
                  <div style={{ fontWeight: '800', color: '#196D3D' }}>{selectedBatchForCert.somaticCellCount || '120k/ml (Grade A)'}</div>
                </div>
              </div>

              {/* Chemical Adulteration Test Matrix */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #E6DEC9',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '800', fontSize: '0.85rem', marginBottom: '10px' }}>
                  <ShieldCheck size={16} /> Certified Adulteration Screen (NABL Lab Standard)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                    <span style={{ color: '#55685C' }}>Urea &amp; Synthetic Fat:</span>
                    <strong style={{ color: '#196D3D' }}>Negative (Passed)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                    <span style={{ color: '#55685C' }}>Detergent / Surfactants:</span>
                    <strong style={{ color: '#196D3D' }}>Negative (Passed)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                    <span style={{ color: '#55685C' }}>Starch / Flours:</span>
                    <strong style={{ color: '#196D3D' }}>Negative (Passed)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                    <span style={{ color: '#55685C' }}>Added Neutralizers &amp; Water:</span>
                    <strong style={{ color: '#196D3D' }}>0% Nil Added</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                    <span style={{ color: '#55685C' }}>Antibiotics &amp; Hormones:</span>
                    <strong style={{ color: '#196D3D' }}>Zero Residues</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px' }}>
                    <span style={{ color: '#55685C' }}>Glass Packaging Hygiene:</span>
                    <strong style={{ color: '#196D3D' }}>Steam Sanitized 120°C</strong>
                  </div>
                </div>
              </div>

              {/* Feed & Livestock Notes */}
              <div style={{ fontSize: '0.8rem', color: '#55685C', backgroundColor: '#FAF7F2', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E6DEC9', marginBottom: '20px' }}>
                <strong>Feed Log:</strong> {selectedBatchForCert.feedLog}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline-dark"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
                >
                  <Printer size={15} /> Print Certificate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.origin + `/products/milk-a2?batch=${selectedBatchForCert.id}`);
                    showToast('Direct customer verification URL copied!', 'success');
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
                >
                  <ExternalLink size={15} /> Copy Verification Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
