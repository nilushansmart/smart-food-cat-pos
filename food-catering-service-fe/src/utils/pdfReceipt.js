import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a crisp PDF receipt for an order
 */
export const generatePdfReceipt = (order, cateringConfig) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 180 + order.items.length * 10], // Thermal POS receipt format (80mm width)
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 12;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(249, 115, 22); // Orange primary
  doc.text(cateringConfig.name || 'Food Catering POS', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 113, 108);
  doc.text(cateringConfig.address || '124 Gourmet Boulevard', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text(`Tel: ${cateringConfig.phone || '+1 555-CATER-ME'}`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Separator
  doc.setDrawColor(220, 220, 220);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(6, y, pageWidth - 6, y);
  y += 6;

  // Order Details
  doc.setFontSize(9);
  doc.setTextColor(28, 25, 23);
  doc.setFont('helvetica', 'bold');
  doc.text(`BOOKING REF: #${order.id}`, 6, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  const formattedDate = new Date(order.createdAt).toLocaleDateString();
  doc.text(`Booked On: ${formattedDate}`, 6, y);
  y += 4;
  if (order.eventDate) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22);
    doc.text(`Event Date: ${order.eventDate} (${order.eventTime || 'Lunch'})`, 6, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
  }
  if (order.guestCount) {
    doc.text(`Guest Count: ${order.guestCount}`, 6, y);
    y += 4;
  }
  if (order.customerPhone) {
    doc.text(`Customer: ${order.customerPhone}`, 6, y);
    y += 4;
  }
  if (order.deliveryAddress) {
    const cleanAddr = order.deliveryAddress.length > 30 ? order.deliveryAddress.substring(0, 29) + '…' : order.deliveryAddress;
    doc.text(`Delivery: ${cleanAddr}`, 6, y);
    y += 4;
  }
  doc.text(`Service: ${order.orderType || 'Online Delivery'}`, 6, y);
  y += 6;

  // Items Header
  doc.line(6, y, pageWidth - 6, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(28, 25, 23);
  doc.text('Item', 6, y);
  doc.text('Qty', 46, y, { align: 'center' });
  doc.text('Price', pageWidth - 6, y, { align: 'right' });
  y += 4;
  doc.line(6, y, pageWidth - 6, y);
  y += 5;

  // Items List
  doc.setFont('helvetica', 'normal');
  order.items.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(28, 25, 23);
    const itemName = item.name.length > 20 ? item.name.substring(0, 19) + '…' : item.name;
    doc.text(itemName, 6, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${item.quantity}`, 46, y, { align: 'center' });
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, pageWidth - 6, y, { align: 'right' });
    y += 4;

    if (item.specialNote) {
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text(`*Note: ${item.specialNote}`, 8, y);
      y += 4;
    }
  });

  y += 2;
  doc.line(6, y, pageWidth - 6, y);
  y += 6;

  // Financials
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Subtotal:', 6, y);
  doc.text(`$${order.subtotal.toFixed(2)}`, pageWidth - 6, y, { align: 'right' });
  y += 4;

  doc.text(`Tax (${(cateringConfig.taxRate * 100).toFixed(0)}%):`, 6, y);
  doc.text(`$${order.tax.toFixed(2)}`, pageWidth - 6, y, { align: 'right' });
  y += 6;

  doc.setLineDashPattern([], 0);
  doc.line(6, y, pageWidth - 6, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(22, 163, 74); // Green secondary
  doc.text('TOTAL:', 6, y);
  doc.text(`$${order.total.toFixed(2)}`, pageWidth - 6, y, { align: 'right' });
  y += 9;

  // Footer / Barcode decoration
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 113, 108);
  doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Please retain this receipt for your records', pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Decorative barcode bars
  doc.setFillColor(28, 25, 23);
  const barStart = 16;
  const barWidth = pageWidth - 32;
  for (let i = 0; i < 36; i++) {
    const bw = (i % 3 === 0) ? 0.9 : 0.4;
    const bx = barStart + (i / 36) * barWidth;
    doc.rect(bx, y, bw, 6, 'F');
  }

  // Save the PDF
  doc.save(`Receipt_${order.id}.pdf`);
};

