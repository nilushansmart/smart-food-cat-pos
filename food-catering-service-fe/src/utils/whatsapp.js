/**
 * Formats a clean WhatsApp deep link with an appetizing online catering booking receipt message
 */
export const formatWhatsAppReceipt = (order, cateringConfig) => {
  const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
  
  const header = `*🧾 ${cateringConfig.name.toUpperCase()}*`;
  const subheader = `_Online Catering Booking Confirmation_\n`;
  
  let orderDetails = `*Booking ID:* #${order.id}\n*Status:* ${order.status}\n*Service:* ${order.orderType || 'Online Delivery'}\n`;
  if (order.eventDate) {
    orderDetails += `*📅 Scheduled Date:* ${order.eventDate}\n`;
  }
  if (order.eventTime) {
    orderDetails += `*⏰ Delivery Time:* ${order.eventTime}\n`;
  }
  if (order.guestCount) {
    orderDetails += `*👥 Guest Count / Pax:* ${order.guestCount}\n`;
  }
  if (order.deliveryAddress) {
    orderDetails += `*📍 Delivery Address:* ${order.deliveryAddress}\n`;
  }
  
  const currency = cateringConfig.currency || 'Rs. ';
  const itemsSection = order.items
    .map(
      (item) =>
        `▪ ${item.quantity}x ${item.name} - ${currency}${(item.price * item.quantity).toLocaleString()}${
          item.specialNote ? `\n   ↳ _Note: ${item.specialNote}_` : ''
        }`
    )
    .join('\n');

  const totals = `\n─────────────────────\n*Subtotal:* ${currency}${order.subtotal?.toLocaleString()}\n*Tax (${(cateringConfig.taxRate * 100).toFixed(0)}%):* ${currency}${order.tax?.toLocaleString()}\n*Total Paid:* *${currency}${order.total?.toLocaleString()}*`;

  const footer = `\n─────────────────────\nThank you for booking with ${cateringConfig.name}!\nOur online catering team will prepare your dishes fresh on schedule.\nSupport Helpline: ${cateringConfig.phone}.`;

  const fullText = `${header}\n${subheader}\n${orderDetails}\n*Catering Menu Selection:*\n${itemsSection}\n${totals}\n${footer}`;
 
  const encoded = encodeURIComponent(fullText);
  if (cleanPhone && cleanPhone.length >= 7) {
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
};

