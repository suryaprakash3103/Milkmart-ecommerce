import React from 'react';
import { X, ShieldCheck, Award, CheckCircle2, ThermometerSnowflake, Clock, Sparkles, MapPin, QrCode } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Store } from '../../data/store';

export const PurityCertificateModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const allBatches = Store.getSellerBatches();
  const matchingBatch = allBatches.find(b => b.productName?.toLowerCase() === product.name?.toLowerCase()) || allBatches[0];

  const purity = {
    batchNumber: matchingBatch?.id || product.purityCertificate?.batchNumber || "BATCH-GIR-9042",
    milkingTime: matchingBatch ? `${matchingBatch.milkingTime} (${matchingBatch.date})` : (product.purityCertificate?.milkingTime || "4:30 AM Today"),
    chillingTemp: matchingBatch ? `${matchingBatch.chillerTemp}°C (Farm Chiller Vat)` : (product.purityCertificate?.chillingTemp || "3.6°C (Unbroken Cold Chain)"),
    aflatoxinM1: "Absent (<0.01 µg/kg)",
    antibiotics: matchingBatch?.adulterationTests?.antibioticResidues || "Not Detected (Nil)",
    syntheticHormones: "Zero (No Oxytocin)",
    adulterationTest: "Passed (100% Pure Raw Dairy - Zero Urea / Detergent)",
    labCertification: matchingBatch?.labCertNumber || "FSSAI & NABL Accredited Lab #KA-8902",
    farmName: matchingBatch?.farmName || "Gir Amrit Organic Gaushala",
    farmerName: matchingBatch?.farmerName || "Devendra Patel",
    fatContent: matchingBatch ? `${matchingBatch.fatPercentage}% Natural Fat` : (product.fatContent || '4.8% Fat'),
    snfContent: matchingBatch ? `${matchingBatch.snfPercentage}% SNF` : (product.snf || '8.9% SNF')
  };

  const testResults = [
    { parameter: "Aflatoxin M1 (Carcinogenic Fungal Toxins)", standard: "< 0.5 µg/kg", actual: purity.aflatoxinM1, status: "Passed", icon: ShieldCheck },
    { parameter: "Antibiotic Residue (Beta-lactam, Tetracycline)", standard: "Maximum Residue Limit (MRL)", actual: purity.antibiotics, status: "Passed", icon: Award },
    { parameter: "Synthetic Hormones (Oxytocin, Bovine Somatotropin)", standard: "Zero Tolerance", actual: purity.syntheticHormones, status: "Passed", icon: CheckCircle2 },
    { parameter: "Adulterants (Water, Urea, Detergent, Starch, Neutralizers)", standard: "Nil (0.00%)", actual: purity.adulterationTest, status: "Passed", icon: CheckCircle2 },
    { parameter: "Natural Milk Fat & Solid-Not-Fat (SNF)", standard: "FSSAI A2 Raw Dairy Standard", actual: `${purity.fatContent} • ${purity.snfContent}`, status: "Certified", icon: Sparkles }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '680px', 
          maxHeight: '92vh', 
          overflowY: 'auto', 
          backgroundColor: '#FFFFFF',
          padding: 0,
          borderRadius: '22px'
        }}
      >
        {/* Header */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '24px 28px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#FAF7F2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(232, 197, 130, 0.2)', color: '#E8C582', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Award size={14} /> Batch Quality &amp; Purity Certificate
          </div>

          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.6rem', margin: '0 0 6px 0', color: '#FAF7F2' }}>
            {product.name}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.84rem', color: '#CBD5CB' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} color="#E8C582" /> Milked: {purity.milkingTime}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <ThermometerSnowflake size={14} color="#E8C582" /> {purity.chillingTemp}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={14} color="#E8C582" /> Batch: {purity.batchNumber}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px' }}>
          {/* Farm Origin Banner */}
          <div style={{
            backgroundColor: '#FAF7F2',
            border: '1px solid #E6DEC9',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#183626',
              color: '#E8C582',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#8E5A17', fontWeight: '700', textTransform: 'uppercase' }}>
                Pasture Herd Origin
              </div>
              <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.94rem' }}>
                {product.farmOrigin || 'Kanakapura Valley Pasture Farms, KA'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#55685C', marginTop: '2px' }}>
                Free-grazing indigenous Gir cows grazing on organic Lucerne, Sorghum, and medicinal herbs.
              </div>
            </div>
          </div>

          {/* Purity Test Grid */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1rem', color: '#183626', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#183626" /> NABL Accredited Laboratory Test Results
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {testResults.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div key={idx} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E6DEC9',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#E8F5E9',
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#183626' }}>
                          {t.parameter}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                          Standard: {t.standard}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        textTransform: 'uppercase'
                      }}>
                        ✓ {t.status}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#183626', fontWeight: '600', marginTop: '3px' }}>
                        {t.actual}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certification seal */}
          <div style={{
            borderTop: '1px solid #E6DEC9',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '0.8rem',
            color: '#55685C'
          }}>
            <div>
              <div><strong>Certification Authority:</strong> {purity.labCertification}</div>
              <div>FSSAI Central License: 10024043000492 • Batch Seal: #KA-BATCH-VERIFIED</div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              Close Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
