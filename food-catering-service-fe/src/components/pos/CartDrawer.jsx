import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Drawer,
  useTheme,
  Stack,
  InputAdornment,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { useApp } from '../../context/AppContext';
import { NumberCounter } from '../common/NumberCounter';

export const CartContent = ({ onCloseMobile }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    cateringSettings,
  } = useApp();

  const theme = useTheme();

  const [customerName, setCustomerName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderType, setOrderType] = useState('Online Delivery');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('12:30 PM (Lunch)');
  const [guestCount, setGuestCount] = useState('15-20 Guests');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (cateringSettings.taxRate || 0.05);
  const total = subtotal + tax;

  const handleConfirmOrder = () => {
    const fullPhone = phoneNumber.trim() ? `${countryCode} ${phoneNumber.trim()}` : '';
    createOrder({
      customerPhone: fullPhone,
      customerName: customerName.trim(),
      orderType,
      eventDate,
      eventTime,
      guestCount,
      deliveryAddress: deliveryAddress.trim() || (orderType === 'Scheduled Pickup' ? 'Self Pickup at Kitchen' : 'Address to be confirmed via WhatsApp'),
    });
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Cart Title & Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingBagOutlinedIcon sx={{ color: '#F97316' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Current Order
          </Typography>
          <Box
            sx={{
              backgroundColor: 'rgba(249, 115, 22, 0.12)',
              color: '#F97316',
              px: 1,
              py: 0.2,
              borderRadius: 9999,
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {cart.reduce((s, i) => s + i.quantity, 0)} items
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {cart.length > 0 && (
            <Button
              size="small"
              onClick={clearCart}
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                minHeight: 32,
                px: 1,
              }}
            >
              Clear
            </Button>
          )}
          {onCloseMobile && (
            <IconButton size="small" onClick={onCloseMobile}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Cart Items List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {cart.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              my: 'auto',
              py: 6,
              color: theme.palette.text.secondary,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F5F5F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 32, opacity: 0.4 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 220, fontSize: '0.85rem' }}>
              Tap any food item from the menu to start building the order.
            </Typography>
          </Box>
        ) : (
          cart.map((item, index) => (
            <Box
              key={`${item.id}-${index}-${item.specialNote}`}
              sx={{
                p: 1.5,
                borderRadius: 3,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FAFAF9',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ pr: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
                    className="tabular-nums"
                  >
                    ${item.price.toFixed(2)} each
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: '#F97316' }}
                  className="tabular-nums"
                >
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>

              {item.specialNote && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#EA580C',
                    backgroundColor: 'rgba(249, 115, 22, 0.08)',
                    px: 1,
                    py: 0.3,
                    borderRadius: 1.5,
                    fontSize: '0.72rem',
                    fontStyle: 'italic',
                  }}
                >
                  Note: {item.specialNote}
                </Typography>
              )}

              {/* Stepper & Delete */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => removeFromCart(item.id, item.specialNote)}
                  sx={{ color: '#DC2626', p: 0.5 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>

                {/* Quantity Stepper */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 9999,
                    backgroundColor: theme.palette.background.paper,
                    p: 0.3,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => updateCartQuantity(item.id, item.specialNote, -1)}
                    sx={{
                      width: 28,
                      height: 28,
                      color: theme.palette.text.primary,
                      p: 0.2,
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </IconButton>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      width: 26,
                      textAlign: 'center',
                    }}
                    className="tabular-nums"
                  >
                    {item.quantity}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => updateCartQuantity(item.id, item.specialNote, 1)}
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      color: '#F97316',
                      p: 0.2,
                      '&:hover': {
                        backgroundColor: '#F97316',
                        color: '#FFFFFF',
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Customer Info & Checkout Zone */}
      {cart.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#FAFAF9',
          }}
        >
          {/* Catering Service Type Selector */}
          <Box sx={{ mb: 1.5, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
            {['Online Delivery', 'Scheduled Pickup'].map((type) => (
              <Button
                key={type}
                size="small"
                variant={orderType === type ? 'contained' : 'outlined'}
                onClick={() => setOrderType(type)}
                sx={{
                  borderRadius: 2.5,
                  minHeight: 38,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  py: 0.5,
                  px: 1,
                  backgroundColor: orderType === type ? '#F97316' : 'transparent',
                  color: orderType === type ? '#FFFFFF' : theme.palette.text.primary,
                  borderColor: orderType === type ? '#F97316' : theme.palette.divider,
                }}
              >
                {type}
              </Button>
            ))}
          </Box>

          {/* Scheduled Catering Date, Time, & Guest Count */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.2 }}>
            <TextField
              size="small"
              type="date"
              label="Event / Delivery Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl size="small">
              <Select
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                sx={{ borderRadius: 2.5, fontSize: '0.82rem' }}
              >
                <MenuItem value="12:00 PM (Lunch)">12:00 PM (Lunch)</MenuItem>
                <MenuItem value="12:30 PM (Lunch)">12:30 PM (Lunch)</MenuItem>
                <MenuItem value="01:30 PM (Lunch)">01:30 PM (Lunch)</MenuItem>
                <MenuItem value="06:30 PM (Dinner)">06:30 PM (Dinner)</MenuItem>
                <MenuItem value="07:30 PM (Dinner)">07:30 PM (Dinner)</MenuItem>
                <MenuItem value="08:30 PM (Dinner)">08:30 PM (Dinner)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Customer Phone & Name */}
          <Stack spacing={1.2} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ width: 80 }}>
                <Select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  sx={{ borderRadius: 2.5, fontSize: '0.85rem' }}
                >
                  <MenuItem value="+1">+1</MenuItem>
                  <MenuItem value="+94">+94</MenuItem>
                  <MenuItem value="+44">+44</MenuItem>
                  <MenuItem value="+91">+91</MenuItem>
                  <MenuItem value="+61">+61</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                fullWidth
                placeholder="Phone (WhatsApp for Receipt)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                size="small"
                placeholder="Guests / Pax (e.g. 20)"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
            </Box>

            {orderType === 'Online Delivery' && (
              <TextField
                size="small"
                fullWidth
                placeholder="Event Venue / Delivery Address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            )}
          </Stack>

          {/* Totals Summary */}
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Subtotal
              </Typography>
              <Typography variant="body2" className="tabular-nums" sx={{ fontWeight: 600 }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Tax ({(cateringSettings.taxRate * 100).toFixed(0)}%)
              </Typography>
              <Typography variant="body2" className="tabular-nums">
                ${tax.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#F97316' }}>
                <NumberCounter value={total} prefix="$" />
              </Typography>
            </Box>
          </Stack>

          {/* Primary Action Button (Large touch target >= 56px) */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmOrder}
            endIcon={<ArrowForwardIcon />}
            sx={{
              minHeight: 56, // Touch friendly POS button 56px or larger
              fontSize: '1.05rem',
              fontWeight: 700,
              backgroundColor: '#F97316',
              boxShadow: '0 8px 20px rgba(249, 115, 22, 0.35)',
              '&:hover': {
                backgroundColor: '#EA580C',
              },
            }}
          >
            Confirm & Book Catering Order
          </Button>
        </Box>
      )}
    </Box>
  );
};

export const MobileCartDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxHeight: '85vh',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ width: 44, height: 5, backgroundColor: 'rgba(120, 113, 108, 0.3)', borderRadius: 9999, mx: 'auto', mt: 1.5, mb: 0.5 }} />
      <CartContent onCloseMobile={onClose} />
    </Drawer>
  );
};
