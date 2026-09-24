import React, { useState } from 'react';
import { X, Code2, Database, Server, Layers, Cpu, CheckCircle2, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const BlueprintModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Architecture spec copied to clipboard!");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '22px 28px',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(232, 197, 130, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(232, 197, 130, 0.2)',
              color: '#E8C582',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Code2 size={20} />
            </div>
            <div>
              <h3 style={{ color: '#FAF7F2', fontSize: '1.25rem', margin: 0 }}>
                MilkMart Full-Stack PRD &amp; Architecture Blueprint
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#D5DFC8' }}>
                Production Technical Spec, Future Django REST Schema &amp; Cold-Chain Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#FAF7F2',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: '#FAF5EE',
          borderBottom: '1px solid #E6DEC9',
          padding: '0 24px'
        }}>
          {[
            { id: 'overview', label: 'System Overview', icon: Layers },
            { id: 'django', label: 'Django REST API Contract', icon: Server },
            { id: 'telemetry', label: 'Cold-Chain IoT Telemetry', icon: Cpu },
            { id: 'storage', label: 'LocalStorage State Spec', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 16px',
                  fontSize: '0.86rem',
                  fontWeight: '600',
                  color: isActive ? '#183626' : '#798C80',
                  borderBottom: isActive ? '2px solid #183626' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <div>
              <div style={{
                backgroundColor: '#FBF4E7',
                border: '1px solid rgba(162, 109, 36, 0.25)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#8E5A17', fontSize: '0.98rem', marginBottom: '6px' }}>
                  🥛 Production Mission &amp; Scope
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#4A5B50', margin: 0, lineHeight: 1.5 }}>
                  MilkMart delivers farm-to-table unadulterated milk and artisanal dairy in sanitized glass bottles before 7:30 AM every morning. This frontend operates with client-side state persistence and realistic cold-chain business logic, ready to connect cleanly to Django REST APIs.
                </p>
              </div>

              <h4 style={{ color: '#183626', marginBottom: '12px' }}>Core Ecosystem Portals</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E6DEC9', backgroundColor: '#FAF7F2' }}>
                  <div style={{ fontWeight: '700', color: '#183626', marginBottom: '4px' }}>1. Customer Storefront</div>
                  <div style={{ fontSize: '0.8rem', color: '#55685C' }}>
                    Catalog filtering, size selectors, recurring morning milk subscriptions (daily/alternate), cart drawer, address manager, and live visual order tracking.
                  </div>
                </div>
                <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E6DEC9', backgroundColor: '#FAF7F2' }}>
                  <div style={{ fontWeight: '700', color: '#183626', marginBottom: '4px' }}>2. Admin Operations Hub</div>
                  <div style={{ fontSize: '0.8rem', color: '#55685C' }}>
                    Chiller tank telemetry, procurement logs, batch manifests, catalog price/stock CRUD, and morning run bottle requirements calculator.
                  </div>
                </div>
                <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E6DEC9', backgroundColor: '#FAF7F2' }}>
                  <div style={{ fontWeight: '700', color: '#183626', marginBottom: '4px' }}>3. Morning Fleet Portal</div>
                  <div style={{ fontSize: '0.8rem', color: '#55685C' }}>
                    Driver route manifest (5:30 AM–7:30 AM), doorstep drop instructions, and glass bottle collection with automatic customer wallet credits.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'django' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#183626' }}>
                  Planned Django REST Framework API Endpoints &amp; Models
                </span>
                <button
                  onClick={() => copyCode(`
# Future Django models.py blueprint
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [('customer', 'Customer'), ('admin', 'Admin'), ('driver', 'Delivery Driver')]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    phone = models.CharField(max_length=15, blank=True)

class DairyProduct(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    brand = models.CharField(max_length=100)
    fat_content = models.CharField(max_length=50)
    snf_percentage = models.CharField(max_length=20)
    cold_chain_temp = models.DecimalField(max_digits=4, decimal_places=1, default=4.0)
    is_subscribable = models.BooleanField(default=True)

class Subscription(models.Model):
    FREQUENCY_CHOICES = [('daily', 'Daily'), ('alternate', 'Alternate Day'), ('weekly', 'Weekly')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(DairyProduct, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    status = models.CharField(max_length=20, default='active')
    time_slot = models.CharField(max_length=50, default='morning_run_530_730')
                  `)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#8E5A17',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  <Copy size={13} /> Copy Django Schema
                </button>
              </div>

              <pre style={{
                backgroundColor: '#0F2318',
                color: '#FAF7F2',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: 1.45
              }}>
{`// REST API Route Mapping:
GET    /api/v1/products/               -> List products with filters (fat, category, price)
POST   /api/v1/products/               -> Admin: Add dairy SKU
PATCH  /api/v1/products/:id/           -> Admin: Update price/stock
POST   /api/v1/subscriptions/          -> Create morning milk subscription
PATCH  /api/v1/subscriptions/:id/skip/ -> Skip tomorrow's doorstep run
POST   /api/v1/orders/checkout/        -> Place morning delivery order
POST   /api/v1/orders/:id/bottle-return/ -> Driver logs returned glass bottles (+₹10 credit)
GET    /api/v1/telemetry/chiller-vats/ -> Bulk Milk Cooler (BMC) temperature sensor feeds`}
              </pre>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div>
              <h4 style={{ color: '#183626', marginBottom: '8px' }}>Cold Chain 4°C IoT Telemetry</h4>
              <p style={{ fontSize: '0.85rem', color: '#55685C', marginBottom: '16px' }}>
                All MilkMart raw and pasteurized milk is maintained below 4°C through chilling vats, insulated van sensors, and doorstep delivery bag thermometers.
              </p>

              <pre style={{
                backgroundColor: '#0F2318',
                color: '#FAF7F2',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: 1.45
              }}>
{`{
  "hub_id": "BMC-HSR-01",
  "timestamp": "2026-09-18T04:30:00Z",
  "vats": [
    { "id": "BMC-01", "name": "A2 Gir Raw Vat", "temp_celsius": 3.6, "capacity": 5000, "current": 4250 },
    { "id": "BMC-02", "name": "Murrah Buffalo Vat", "temp_celsius": 3.9, "capacity": 4000, "current": 3100 }
  ],
  "van_cold_box_telemetry": {
    "van_id": "KA01-EK-4501",
    "driver": "Ramesh Kumar",
    "internal_temp": 3.8,
    "door_open_count": 14,
    "gps": { "lat": 12.9121, "lng": 77.6446 }
  }
}`}
              </pre>
            </div>
          )}

          {activeTab === 'storage' && (
            <div>
              <h4 style={{ color: '#183626', marginBottom: '8px' }}>LocalStorage State Persistence Keys</h4>
              <p style={{ fontSize: '0.85rem', color: '#55685C', marginBottom: '16px' }}>
                Client state automatically syncs with browser localStorage on changes:
              </p>
              <ul style={{ fontSize: '0.85rem', color: '#4A5B50', paddingLeft: '20px', lineHeight: 1.8 }}>
                <li><code>milkmart_cart</code>: Active cart items, selected pack sizes, and bottle deposits.</li>
                <li><code>milkmart_user</code>: Authenticated profile, saved addresses, and live wallet balance.</li>
                <li><code>milkmart_subscriptions</code>: Recurring daily milk schedules, pauses, and skipped dates.</li>
                <li><code>milkmart_orders</code>: Placed orders, tracking timelines, and bottle returns.</li>
                <li><code>milkmart_products</code>: Catalog modifications made in Admin Hub.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E6DEC9',
          backgroundColor: '#FAF7F2',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} className="btn btn-dark btn-sm">
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
