/**
 * MilkMart WhatsApp Notification Utility
 * Formats rich order confirmation, sunrise dispatch, and invoice messages
 * Generates direct wa.me deep links for WhatsApp Web and WhatsApp Mobile.
 */

export const buildOrderWhatsAppMessage = (order, customer = {}) => {
  const customerName = customer.name || order.deliveryAddress?.name || 'Valued Patron';
  const orderId = order.id || 'MM-ORDER';
  const timeSlot = order.timeSlot || 'Morning Run: 5:30 AM – 7:30 AM';
  const total = order.total || 0;
  const paymentMethod = order.paymentMethod || 'Online Gateway';

  const address = order.deliveryAddress 
    ? `${order.deliveryAddress.house || ''}, ${order.deliveryAddress.street || ''}, ${order.deliveryAddress.city || 'Bengaluru'}`
    : 'Doorstep Delivery';

  const itemsList = (order.items || [])
    .map((item, idx) => `  ${idx + 1}. *${item.name}* (${item.size || '1L'}) × ${item.quantity} = ₹${item.price * item.quantity}`)
    .join('\n');

  return `🥛 *MILKMART FRESH DAIRY DISPATCH* 🌿
━━━━━━━━━━━━━━━━━━━━━━━━
Namaste *${customerName}*! Your order *#${orderId}* is confirmed and allocated to our early morning milking batch.

📦 *YOUR BASKET:*
${itemsList || '  1. Farm Fresh Pure A2 Milk (1L) × 2'}

💰 *Total Paid:* ₹${total} via *${paymentMethod}*
🌅 *Delivery Window:* ${timeSlot}
📍 *Delivery Address:* ${address}

🧪 *PURITY & COLD CHAIN ASSURANCE:*
• Chilled at 3.6°C within 45 mins of milking
• Tested: 0% adulterants, 0% antibiotics, 0% urea
• Cold-chain EV Van: KA01-EK-4501 (Partner: Ramesh Kumar)

♻️ *BOTTLE LOOP REWARD:*
Please rinse and place your empty glass bottles in your doorstep pouch tonight. Our morning partner will collect them and credit *₹10 per bottle* instantly to your MilkMart Wallet!

📲 *Live Order Tracking & Lab Certificate:*
https://milkmart.farm/orders/${orderId}

Need to change morning instructions? Simply reply to this WhatsApp message! 🥛`;
};

export const getWhatsAppUrl = (phone, text) => {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  if (cleanPhone.length >= 10) {
    // If phone has 10 digits without country code, prepend 91 for India
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${fullPhone}?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
};

export const openWhatsApp = (phone, text) => {
  const url = getWhatsAppUrl(phone, text);
  window.open(url, '_blank', 'noopener,noreferrer');
};
