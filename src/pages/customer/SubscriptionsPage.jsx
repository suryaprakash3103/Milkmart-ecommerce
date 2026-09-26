import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';
import { SubscriptionModal } from '../../components/subscription/SubscriptionModal';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { 
  Calendar, Pause, Play, SkipForward, Trash2, 
  Plus, Sparkles, Clock, CheckCircle2, AlertCircle, RefreshCcw, 
  Palmtree, ArrowRight, X, ArrowLeftRight 
} from 'lucide-react';

export const SubscriptionsPage = () => {
  const {
    subscriptions,
    pauseSubscription,
    resumeSubscription,
    skipNextDelivery,
    modifyQuantity,
    modifyFrequency,
    cancelSubscription
  } = useSubscription();

  const { products } = useProducts();
  const { showToast } = useToast();

  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [selectedProductForNewSub, setSelectedProductForNewSub] = useState(null);

  // Vacation Mode state
  const [vacationModalSub, setVacationModalSub] = useState(null);
  const [vacationStart, setVacationStart] = useState('2026-09-28');
  const [vacationEnd, setVacationEnd] = useState('2026-10-05');
  const [vacationSchedules, setVacationSchedules] = useState({});

  // Switch Milk Modal state
  const [switchMilkSub, setSwitchMilkSub] = useState(null);
  const [selectedTargetProduct, setSelectedTargetProduct] = useState(null);

  const subscribableProducts = products.filter((p) => p.isSubscribable);
  const activeSubscriptions = subscriptions.filter((s) => s.status !== 'Cancelled');

  const handleApplyVacation = (e) => {
    e.preventDefault();
    if (!vacationModalSub) return;
    setVacationSchedules(prev => ({
      ...prev,
      [vacationModalSub.id]: {
        start: vacationStart,
        end: vacationEnd
      }
    }));
    pauseSubscription(vacationModalSub.id);
    showToast(`Vacation pause scheduled from ${vacationStart} to ${vacationEnd}! Automatic resumption set.`);
    setVacationModalSub(null);
  };

  const handleEndVacationEarly = (subId) => {
    setVacationSchedules(prev => {
      const copy = { ...prev };
      delete copy[subId];
      return copy;
    });
    resumeSubscription(subId);
    showToast("Vacation ended early! Deliveries resumed for tomorrow's sunrise run.");
  };

  const handleConfirmMilkSwitch = (e) => {
    e.preventDefault();
    if (!switchMilkSub || !selectedTargetProduct) return;
    // Update subscription with new product name, image, and price
    switchMilkSub.productName = selectedTargetProduct.name;
    switchMilkSub.image = selectedTargetProduct.image;
    switchMilkSub.pricePerDay = Math.round(selectedTargetProduct.price * 0.9 * 10) / 10;
    showToast(`Switched morning subscription to '${selectedTargetProduct.name}'!`);
    setSwitchMilkSub(null);
  };

  return (
    <div style={{ padding: '36px 0 70px 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FDF4E3', color: '#8E5A17', padding: '3px 10px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Calendar size={13} /> Morning Habit
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Morning Milk Subscriptions
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#55685C', marginTop: '4px' }}>
              Never run out of pure pasture milk. Chilled glass bottles delivered before 7:30 AM every day.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedProductForNewSub(subscribableProducts[0]);
              setIsNewSubModalOpen(true);
            }}
            className="btn btn-primary btn-lg"
          >
            <Plus size={18} /> Start New Daily Plan
          </button>
        </div>

        {/* Value Callout Card */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          borderRadius: '20px',
          padding: '24px 28px',
          marginBottom: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          border: '1px solid rgba(232, 197, 130, 0.3)'
        }}>
          <div>
            <div style={{ color: '#E8C582', fontWeight: '700', fontSize: '1.2rem' }}>10% Daily Discount</div>
            <div style={{ fontSize: '0.82rem', color: '#D5DFC8' }}>Permanent discount on all subscribed milk &amp; curd</div>
          </div>
          <div>
            <div style={{ color: '#E8C582', fontWeight: '700', fontSize: '1.2rem' }}>Silent Doorstep Drop</div>
            <div style={{ fontSize: '0.82rem', color: '#D5DFC8' }}>Quiet morning drop inside your insulated bag before 7:30 AM</div>
          </div>
          <div>
            <div style={{ color: '#E8C582', fontWeight: '700', fontSize: '1.2rem' }}>Pause or Vacation Mode</div>
            <div style={{ fontSize: '0.82rem', color: '#D5DFC8' }}>Zero penalties, zero lock-in contracts. Resume on return</div>
          </div>
        </div>

        {/* Active Subscriptions List */}
        {activeSubscriptions.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E6DEC9',
            padding: '60px 24px',
            textAlign: 'center'
          }}>
            <Calendar size={48} color="#798C80" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ color: '#183626', fontSize: '1.4rem', marginBottom: '8px' }}>
              No Active Milk Subscriptions
            </h3>
            <p style={{ color: '#798C80', fontSize: '0.9rem', marginBottom: '20px' }}>
              Subscribe to fresh A2 Gir cow milk or probiotic curd for seamless morning deliveries.
            </p>
            <button
              onClick={() => {
                setSelectedProductForNewSub(subscribableProducts[0]);
                setIsNewSubModalOpen(true);
              }}
              className="btn btn-primary"
            >
              Start Morning Subscription
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {activeSubscriptions.map((sub) => {
              const isPaused = sub.status === 'Paused';
              const vacation = vacationSchedules[sub.id];

              return (
                <div
                  key={sub.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: isPaused ? '1.5px dashed #A26D24' : '1.5px solid #E6DEC9',
                    padding: '24px 28px',
                    boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)',
                    position: 'relative'
                  }}
                >
                  {/* Vacation Mode Banner if active */}
                  {vacation && (
                    <div style={{
                      backgroundColor: '#FDF4E3',
                      border: '1px solid #E8C582',
                      borderRadius: '10px',
                      padding: '10px 16px',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#8E5A17', fontWeight: '700' }}>
                        <Palmtree size={18} />
                        <span>Vacation Mode Active: Paused {vacation.start} to {vacation.end}</span>
                      </div>
                      <button
                        onClick={() => handleEndVacationEarly(sub.id)}
                        className="btn btn-outline-dark btn-sm"
                        style={{ fontSize: '0.76rem', padding: '4px 10px' }}
                      >
                        End Vacation Early &amp; Resume
                      </button>
                    </div>
                  )}

                  {/* Top line with ID & status */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    borderBottom: '1px solid #F1EDE3',
                    paddingBottom: '14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: '700', fontSize: '1.15rem', color: '#183626' }}>
                        Subscription #{sub.id}
                      </span>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        backgroundColor: isPaused ? '#FDF4E3' : '#E8F5EE',
                        color: isPaused ? '#8E5A17' : '#196D3D'
                      }}>
                        {isPaused ? (vacation ? 'On Vacation' : 'Paused') : sub.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: '#55685C' }}>
                      Next Morning Run: <strong style={{ color: '#183626' }}>{isPaused ? 'Resuming on schedule' : sub.nextDeliveryDate}</strong>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    {/* Product visual & details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={sub.image}
                        alt={sub.productName}
                        style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.1rem', color: '#183626', margin: '0 0 4px 0' }}>
                          {sub.productName}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: '#798C80' }}>
                          Pack: <strong>{sub.size}</strong> • {sub.brand}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#A26D24', marginTop: '4px' }}>
                          ₹{sub.pricePerDay} / delivery
                        </div>
                      </div>
                    </div>

                    {/* Frequency & Quantity Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.84rem', color: '#798C80', fontWeight: '600' }}>Frequency:</span>
                        <select
                          value={sub.frequency}
                          onChange={(e) => modifyFrequency(sub.id, e.target.value)}
                          style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: '600' }}
                        >
                          <option value="Daily">Daily Morning</option>
                          <option value="Alternate Day">Alternate Days</option>
                          <option value="Weekly">Weekly Once</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.84rem', color: '#798C80', fontWeight: '600' }}>Daily Bottles:</span>
                        <QuantitySelector
                          quantity={sub.quantity}
                          onDecrease={() => modifyQuantity(sub.id, sub.quantity - 1)}
                          onIncrease={() => modifyQuantity(sub.id, sub.quantity + 1)}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Address snippet */}
                    <div style={{ fontSize: '0.82rem', color: '#55685C' }}>
                      <div style={{ fontWeight: '700', color: '#183626', marginBottom: '2px' }}>
                        Doorstep Drop:
                      </div>
                      <div>{sub.deliveryAddress}</div>
                      <div style={{ color: '#798C80', marginTop: '2px', fontStyle: 'italic' }}>
                        "{sub.doorstepInstructions}"
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Controls */}
                  <div style={{
                    borderTop: '1px solid #F1EDE3',
                    paddingTop: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {isPaused ? (
                        <button
                          onClick={() => {
                            if (vacation) handleEndVacationEarly(sub.id);
                            else resumeSubscription(sub.id);
                          }}
                          className="btn btn-dark btn-sm"
                        >
                          <Play size={14} /> Resume Deliveries
                        </button>
                      ) : (
                        <button
                          onClick={() => pauseSubscription(sub.id)}
                          className="btn btn-ghost btn-sm"
                        >
                          <Pause size={14} /> Pause Plan
                        </button>
                      )}

                      {!isPaused && (
                        <button
                          onClick={() => skipNextDelivery(sub.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#8E5A17' }}
                        >
                          <SkipForward size={14} /> Skip Tomorrow's Run
                        </button>
                      )}

                      {/* Vacation Mode Button */}
                      <button
                        onClick={() => setVacationModalSub(sub)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#196D3D' }}
                      >
                        <Palmtree size={14} /> Set Vacation Mode
                      </button>

                      {/* Switch Milk Type Button */}
                      <button
                        onClick={() => {
                          setSwitchMilkSub(sub);
                          setSelectedTargetProduct(subscribableProducts.find(p => p.name !== sub.productName) || subscribableProducts[0]);
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#0E587B' }}
                      >
                        <ArrowLeftRight size={14} /> Switch Milk Type
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this subscription?")) {
                          cancelSubscription(sub.id);
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        color: '#B2341A',
                        fontWeight: '600',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none'
                      }}
                    >
                      <Trash2 size={13} /> Cancel Subscription
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: Vacation Mode Date Picker */}
      {vacationModalSub && (
        <div className="modal-backdrop" onClick={() => setVacationModalSub(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <form onSubmit={handleApplyVacation} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FDF4E3', color: '#8E5A17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Palmtree size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
                    Vacation Mode (Pause Dates)
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#798C80' }}>
                    {vacationModalSub.productName}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#55685C', lineHeight: 1.5, marginBottom: '18px' }}>
                Traveling or away from home? Select your holiday dates to pause doorstep runs. Your wallet will not be charged, and bottles will resume automatically upon return!
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Vacation Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={vacationStart}
                    onChange={(e) => setVacationStart(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E6DEC9' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Resume Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    value={vacationEnd}
                    onChange={(e) => setVacationEnd(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E6DEC9' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Confirm Vacation Pause
                </button>
                <button type="button" onClick={() => setVacationModalSub(null)} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Switch Milk Type */}
      {switchMilkSub && (
        <div className="modal-backdrop" onClick={() => setSwitchMilkSub(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <form onSubmit={handleConfirmMilkSwitch} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#EBF4F9', color: '#0E587B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeftRight size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
                    Switch Dairy Subscription SKU
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#798C80' }}>
                    Current: {switchMilkSub.productName}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {subscribableProducts.map((p) => {
                  const isSelected = selectedTargetProduct?.id === p.id;
                  const discountedPrice = Math.round(p.price * 0.9 * 10) / 10;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedTargetProduct(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #183626' : '1px solid #E6DEC9',
                        backgroundColor: isSelected ? '#FAF5EE' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <img src={p.image} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#798C80' }}>{p.size} • {p.fatContent}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', color: '#A26D24', fontSize: '0.92rem' }}>₹{discountedPrice}</div>
                        <div style={{ fontSize: '0.72rem', color: '#196D3D' }}>10% Sub Discount</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Confirm Switch
                </button>
                <button type="button" onClick={() => setSwitchMilkSub(null)} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Subscription Modal */}
      {selectedProductForNewSub && (
        <SubscriptionModal
          product={selectedProductForNewSub}
          isOpen={isNewSubModalOpen}
          onClose={() => setIsNewSubModalOpen(false)}
        />
      )}
    </div>
  );
};
