package com.cateringpos.service.impl;

import com.cateringpos.config.CateringProperties;
import com.cateringpos.entity.Order;
import com.cateringpos.entity.OrderItem;
import com.cateringpos.entity.User;
import com.cateringpos.enums.Role;
import com.cateringpos.exception.ResourceNotFoundException;
import com.cateringpos.repository.OrderRepository;
import com.cateringpos.repository.UserRepository;
import com.cateringpos.security.JwtUtil;
import com.cateringpos.service.ReceiptService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private static final Logger log = LoggerFactory.getLogger(ReceiptServiceImpl.class);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CateringProperties cateringProperties;
    private final JwtUtil jwtUtil;

    // Palette constants
    private static final Color COLOR_PRIMARY = new Color(249, 115, 22);       // #F97316 Warm Orange
    private static final Color COLOR_DARK = new Color(28, 25, 23);           // #1C1917 Dark Neutral
    private static final Color COLOR_MUTED = new Color(120, 113, 108);       // #78716C Muted Gray
    private static final Color COLOR_BG_LIGHT = new Color(250, 250, 249);    // #FAFAF9 Soft Surface
    private static final Color COLOR_BORDER = new Color(229, 231, 235);      // #E5E7EB Divider

    @Override
    @Transactional(readOnly = true)
    public byte[] generateReceiptPdf(Long orderId) {
        Order order = orderRepository.findWithItemsById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 40, 40);
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, COLOR_PRIMARY);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, COLOR_DARK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, COLOR_DARK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, COLOR_DARK);
            Font mutedFont = FontFactory.getFont(FontFactory.HELVETICA, 9, COLOR_MUTED);
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, COLOR_PRIMARY);

            // 1. Header Banner
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            // Company info
            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.addElement(new Paragraph(cateringProperties.getName(), brandFont));
            companyCell.addElement(new Paragraph(cateringProperties.getAddress(), mutedFont));
            companyCell.addElement(new Paragraph(cateringProperties.getPhone() + " | " + cateringProperties.getEmail(), mutedFont));
            headerTable.addCell(companyCell);

            // Order & Invoice info
            PdfPCell orderMetaCell = new PdfPCell();
            orderMetaCell.setBorder(Rectangle.NO_BORDER);
            orderMetaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            Paragraph invoiceTitle = new Paragraph("CATERING RECEIPT", titleFont);
            invoiceTitle.setAlignment(Element.ALIGN_RIGHT);
            orderMetaCell.addElement(invoiceTitle);

            Paragraph orderNum = new Paragraph("Order #: " + order.getOrderNumber(), boldFont);
            orderNum.setAlignment(Element.ALIGN_RIGHT);
            orderMetaCell.addElement(orderNum);

            String formattedDate = order.getCreatedAt() != null
                    ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"))
                    : "";
            Paragraph datePara = new Paragraph("Date: " + formattedDate, mutedFont);
            datePara.setAlignment(Element.ALIGN_RIGHT);
            orderMetaCell.addElement(datePara);

            headerTable.addCell(orderMetaCell);
            document.add(headerTable);

            document.add(new Paragraph(" "));

            // 2. Event & Customer Details Box
            PdfPTable detailsTable = new PdfPTable(2);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{50, 50});

            PdfPCell customerCell = createCardCell();
            customerCell.addElement(new Paragraph("CUSTOMER DETAILS", boldFont));
            customerCell.addElement(new Paragraph("Name: " + order.getCustomerName(), bodyFont));
            customerCell.addElement(new Paragraph("Phone: " + order.getCustomerPhone(), bodyFont));
            customerCell.addElement(new Paragraph("Type: " + order.getOrderType(), bodyFont));
            if (StringUtils.hasText(order.getDeliveryAddress())) {
                customerCell.addElement(new Paragraph("Delivery Address: " + order.getDeliveryAddress(), bodyFont));
                if (StringUtils.hasText(order.getEstimatedDeliveryTime())) {
                    customerCell.addElement(new Paragraph("Est. Delivery: " + order.getEstimatedDeliveryTime(), mutedFont));
                }
            }
            detailsTable.addCell(customerCell);

            PdfPCell eventCell = createCardCell();
            eventCell.addElement(new Paragraph("EVENT RESERVATION", boldFont));
            eventCell.addElement(new Paragraph("Event Date: " + (order.getEventDate() != null ? order.getEventDate().toString() : "N/A"), bodyFont));
            eventCell.addElement(new Paragraph("Event Time: " + (order.getEventTime() != null ? order.getEventTime() : "N/A"), bodyFont));
            eventCell.addElement(new Paragraph("Occasion / Type: " + (order.getEventType() != null ? order.getEventType() : "General"), bodyFont));
            eventCell.addElement(new Paragraph("Guest Count: " + (order.getGuestCount() != null ? order.getGuestCount() : "Not specified"), bodyFont));
            eventCell.addElement(new Paragraph("Status: " + order.getStatus() + " | Payment: " + order.getPaymentStatus(), boldFont));
            detailsTable.addCell(eventCell);

            document.add(detailsTable);
            document.add(new Paragraph(" "));

            // 3. Items Table
            PdfPTable itemsTable = new PdfPTable(4);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{45, 15, 20, 20});

            // Table headers
            addTableHeader(itemsTable, "Item Description", Element.ALIGN_LEFT);
            addTableHeader(itemsTable, "Qty", Element.ALIGN_CENTER);
            addTableHeader(itemsTable, "Unit Price", Element.ALIGN_RIGHT);
            addTableHeader(itemsTable, "Subtotal", Element.ALIGN_RIGHT);

            // Table rows
            String currency = cateringProperties.getCurrency() != null ? cateringProperties.getCurrency() : "$";
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    PdfPCell nameCell = createCell(Element.ALIGN_LEFT, false);
                    nameCell.addElement(new Paragraph(item.getItemName(), boldFont));
                    if (StringUtils.hasText(item.getSpecialNote())) {
                        nameCell.addElement(new Paragraph("Note: " + item.getSpecialNote(), mutedFont));
                    }
                    itemsTable.addCell(nameCell);

                    itemsTable.addCell(createCell(String.valueOf(item.getQuantity()), Element.ALIGN_CENTER, false));
                    itemsTable.addCell(createCell(currency + item.getUnitPrice().setScale(2), Element.ALIGN_RIGHT, false));
                    itemsTable.addCell(createCell(currency + item.getSubtotal().setScale(2), Element.ALIGN_RIGHT, false));
                }
            }

            document.add(itemsTable);

            // 4. Financial Totals
            PdfPTable totalsTable = new PdfPTable(2);
            totalsTable.setWidthPercentage(100);
            totalsTable.setWidths(new float[]{65, 35});

            PdfPCell notesCell = new PdfPCell();
            notesCell.setBorder(Rectangle.NO_BORDER);
            if (StringUtils.hasText(order.getNotes())) {
                notesCell.addElement(new Paragraph("Special Instructions:", boldFont));
                notesCell.addElement(new Paragraph(order.getNotes(), mutedFont));
            }
            totalsTable.addCell(notesCell);

            PdfPCell summaryCell = new PdfPCell();
            summaryCell.setBorder(Rectangle.NO_BORDER);

            PdfPTable innerSummary = new PdfPTable(2);
            innerSummary.setWidthPercentage(100);
            innerSummary.setWidths(new float[]{60, 40});

            addSummaryRow(innerSummary, "Subtotal:", currency + order.getSubtotal().setScale(2), boldFont, bodyFont);
            addSummaryRow(innerSummary, "Tax (5%):", currency + order.getTaxAmount().setScale(2), boldFont, bodyFont);
            addSummaryRow(innerSummary, "Total Due:", currency + order.getTotalAmount().setScale(2), boldFont, totalFont);
            addSummaryRow(innerSummary, "Method:", order.getPaymentMethod().name().replace("_", " "), boldFont, mutedFont);

            summaryCell.addElement(innerSummary);
            totalsTable.addCell(summaryCell);

            document.add(new Paragraph(" "));
            document.add(totalsTable);

            // 5. Footer & Gratitude
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            Paragraph footer = new Paragraph("Thank you for choosing " + cateringProperties.getName() + " for your event!\n" +
                    "For inquiries or changes to your catering order, please contact " + cateringProperties.getPhone(), mutedFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF receipt for order {}: ", orderId, e);
            throw new RuntimeException("Error generating receipt PDF: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateSignedReceiptToken(Long orderId) {
        return jwtUtil.generateReceiptToken(orderId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateReceiptAccess(Long orderId, String signedToken, String username) {
        // 1. Signed expiring token check
        if (StringUtils.hasText(signedToken)) {
            return jwtUtil.validateReceiptToken(signedToken, orderId);
        }

        // 2. Authenticated user check
        if (StringUtils.hasText(username)) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return false;
            }

            // Staff and Admin can view any receipt
            if (user.getRole() == Role.ROLE_ADMIN || user.getRole() == Role.ROLE_STAFF || user.getRole() == Role.ROLE_KITCHEN) {
                return true;
            }

            // Customer can only view their own order
            Order order = orderRepository.findById(orderId).orElse(null);
            return order != null && order.getCreatedBy() != null && order.getCreatedBy().getId().equals(user.getId());
        }

        return false;
    }

    private PdfPCell createCardCell() {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(COLOR_BG_LIGHT);
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(1);
        cell.setPadding(10);
        return cell;
    }

    private void addTableHeader(PdfPTable table, String headerTitle, int alignment) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(COLOR_BG_LIGHT);
        header.setBorderColor(COLOR_BORDER);
        header.setBorderWidth(1);
        header.setPadding(8);
        header.setHorizontalAlignment(alignment);

        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, COLOR_DARK);
        header.setPhrase(new Phrase(headerTitle, font));
        table.addCell(header);
    }

    private PdfPCell createCell(String text, int alignment, boolean border) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10, COLOR_DARK);
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(8);
        if (!border) {
            cell.setBorderColor(COLOR_BORDER);
            cell.setBorderWidth(0.5f);
        }
        return cell;
    }

    private PdfPCell createCell(int alignment, boolean border) {
        PdfPCell cell = new PdfPCell();
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(8);
        if (!border) {
            cell.setBorderColor(COLOR_BORDER);
            cell.setBorderWidth(0.5f);
        }
        return cell;
    }

    private void addSummaryRow(PdfPTable table, String label, String value, Font labelFont, Font valFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(4);

        PdfPCell valCell = new PdfPCell(new Phrase(value, valFont));
        valCell.setBorder(Rectangle.NO_BORDER);
        valCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valCell.setPadding(4);

        table.addCell(labelCell);
        table.addCell(valCell);
    }
}

