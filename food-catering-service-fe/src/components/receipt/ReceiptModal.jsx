import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  useTheme,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useApp } from '../../context/AppContext';
import { generatePdfReceipt } from '../../utils/pdfReceipt';
import { formatWhatsAppReceipt } from '../../utils/whatsapp';
import { StatusBadge } from '../common/StatusBadge';

export const ReceiptModal = () => {
  const {
    isReceiptOpen,
    closeReceiptModal,
    activeReceiptOrder,
    cateringSettings,
    setCurrentScreen,
    currentUser,
  } = useApp();

  const theme = useTheme();

  if (!activeReceiptOrder) return null;

  const handleWhatsAppShare = () => {
    const url = formatWhatsAppReceipt(activeReceiptOrder, cateringSettings);
    window.open(url, '_blank');
  };

  const handleDownloadPdf = () => {
    generatePdfReceipt(activeReceiptOrder, cateringSettings);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewOrder = () => {
    closeReceiptModal();
    if (currentUser?.role === 'Customer') {
      setCurrentScreen('customer-menu');
    } else {
      setCurrentScreen('pos');
    }
  };

  return (
    <Dialog
      open={isReceiptOpen}
      onClose={closeReceiptModal}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {/* Header bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 2.5,
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Order Confirmed!
        </Typography>
        <IconButton size="small" onClick={closeReceiptModal} sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, pt: 0, pb: 3 }}>
        {/* Animated Success Checkmark */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 1.5 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#16A34A" strokeWidth="2.5" />
              <path
                d="M7 12.5L10.5 16L17 8.5"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 20,
                  animation: 'checkmark 0.6s ease-in-out forwards',
                }}
              />
            </svg>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#16A34A' }}>
            Ready for Preparation
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            A copy of this digital receipt has been registered.
          </Typography>
        </Box>

        {/* Realistic Receipt Paper Style Card */}
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#F5F5F4',
            borderRadius: 3,
            p: 2.5,
            border: `1px dashed ${theme.palette.divider}`,
            position: 'relative',
            mb: 2.5,
          }}
        >
          {/* Brand info on receipt */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
              <RestaurantIcon sx={{ color: '#F97316', fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {cateringSettings.name}
              </Typography>
            </Box>
            <Typography variant="caption" display="block" sx={{ color: theme.palette.text.secondary }}>
              {cateringSettings.address} • {cateringSettings.phone}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

          {/* Order meta */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Booking Reference
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                #{activeReceiptOrder.id}
              </Typography>
            </Box>
            <StatusBadge status={activeReceiptOrder.status} size="small" />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Booked: {new Date(activeReceiptOrder.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {activeReceiptOrder.orderType || 'Online Delivery'}
            </Typography>
          </Box>

          {activeReceiptOrder.eventDate && (
            <Box sx={{ backgroundColor: 'rgba(249, 115, 22, 0.08)', p: 1, borderRadius: 2, mb: 1, border: '1px solid rgba(249, 115, 22, 0.2)' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#C2410C', display: 'block' }}>
                📅 Scheduled: {activeReceiptOrder.eventDate} ({activeReceiptOrder.eventTime || 'Lunch'})
              </Typography>
              {activeReceiptOrder.guestCount && (
                <Typography variant="caption" sx={{ color: '#1C1917', fontWeight: 600, display: 'block' }}>
                  👥 Guests / Pax: {activeReceiptOrder.guestCount}
                </Typography>
              )}
              {activeReceiptOrder.deliveryAddress && (
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                  📍 Delivery: {activeReceiptOrder.deliveryAddress}
                </Typography>
              )}
            </Box>
          )}

          {activeReceiptOrder.customerPhone && (
            <Typography variant="caption" display="block" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
              Customer: {activeReceiptOrder.customerName} ({activeReceiptOrder.customerPhone})
            </Typography>
          )}

          <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

          {/* Itemized breakdown */}
          <Box sx={{ mb: 1.5 }}>
            {activeReceiptOrder.items.map((item, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.quantity}x {item.name}
                  </Typography>
                  <Typography variant="body2" className="tabular-nums" sx={{ fontWeight: 600 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                {item.specialNote && (
                  <Typography variant="caption" sx={{ color: '#F97316', fontStyle: 'italic', display: 'block', pl: 1 }}>
                    ↳ Note: {item.specialNote}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

          {/* Subtotal, tax, total */}
          <Stack spacing={0.6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Subtotal
              </Typography>
              <Typography variant="caption" className="tabular-nums">
                ${activeReceiptOrder.subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Tax ({(cateringSettings.taxRate * 100).toFixed(0)}%)
              </Typography>
              <Typography variant="caption" className="tabular-nums">
                ${activeReceiptOrder.tax.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Total Paid
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#16A34A' }} className="tabular-nums">
                ${activeReceiptOrder.total.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack spacing={1.5}>
          {/* Primary Action: Send via WhatsApp */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleWhatsAppShare}
            startIcon={<WhatsAppIcon sx={{ color: '#FFFFFF' }} />}
            sx={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              minHeight: 48,
              fontSize: '0.95rem',
              '&:hover': {
                backgroundColor: '#1EBE5D',
              },
            }}
          >
            Send Receipt via WhatsApp
          </Button>

          {/* Secondary Actions */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
            <Button
              variant="outlined"
              onClick={handleDownloadPdf}
              startIcon={<PictureAsPdfIcon sx={{ color: '#DC2626' }} />}
              sx={{
                borderRadius: 3,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                '&:hover': {
                  borderColor: '#DC2626',
                  backgroundColor: 'rgba(220, 38, 38, 0.04)',
                },
              }}
            >
              PDF
            </Button>
            <Button
              variant="outlined"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
              sx={{
                borderRadius: 3,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
              }}
            >
              Print
            </Button>
          </Box>

          <Button
            variant="text"
            onClick={handleNewOrder}
            startIcon={<AddShoppingCartIcon />}
            sx={{
              color: '#F97316',
              fontWeight: 600,
              mt: 0.5,
            }}
          >
            Place Another Order
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
