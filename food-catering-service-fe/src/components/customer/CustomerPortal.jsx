import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Drawer,
  IconButton,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { NumberCounter } from '../common/NumberCounter';
import { generatePdfReceipt } from '../../utils/pdfReceipt';

export const CustomerPortal = () => {
  const {
    currentScreen,
    setCurrentScreen,
    menuItems,
    categories,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    createOrder,
    orders,
    cateringSettings,
    currentUser,
    openReceiptModal,
  } = useApp();

  const theme = useTheme();

  // Menu filtering
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Item Detail Bottom Sheet State
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailNote, setDetailNote] = useState('');

  // Checkout & Event Booking form state
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+1 (555) 902-1823');
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Kavindu Customer');
  const [orderType, setOrderType] = useState('Online Delivery');
  const [eventDate, setEventDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('12:30 PM - 01:30 PM (Lunch)');
  const [eventType, setEventType] = useState('Corporate Event');
  const [guestCount, setGuestCount] = useState('20 Guests');
  const [deliveryAddress, setDeliveryAddress] = useState('74 Silicon Boulevard, 4th Floor Tech Suite');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch && item.available;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * (cateringSettings.taxRate || 0.05);
  const cartTotal = cartSubtotal + cartTax;

  // Active tracking order (latest customer order)
  const activeTrackingOrder = orders[0] || null;

  const handleOpenDetail = (item) => {
    setSelectedItemForDetail(item);
    setDetailQuantity(1);
    setDetailNote('');
  };

  const handleAddToCartFromDetail = () => {
    if (selectedItemForDetail) {
      addToCart(selectedItemForDetail, detailQuantity, detailNote.trim());
      setSelectedItemForDetail(null);
    }
  };

  const handlePlaceOrder = () => {
    createOrder({
      customerPhone,
      customerName,
      orderType,
      eventDate,
      eventTime,
      eventType,
      guestCount,
      deliveryAddress: deliveryAddress.trim() || (orderType === 'Scheduled Pickup' ? 'Self Pickup at Central Kitchen' : 'Address confirmed via WhatsApp'),
      notes: `${eventType} (${guestCount})`,
    });
    setCurrentScreen('customer-tracking');
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item, item.quantity, item.specialNote || '');
    });
    setCurrentScreen('customer-cart');
  };

  // Determine active step index for tracking stepper
  const getTrackingStepIndex = (status) => {
    switch (status) {
      case 'Pending':
      case 'New':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, sm: 3 }, pb: { xs: 12, md: 4 } }}>
      {/* Tab 1: Customer Menu */}
      {currentScreen === 'customer-menu' && (
        <Box>
          {/* Welcome Hero Banner */}
          <Card
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 4,
              mb: 3,
              background: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
              color: '#FFFFFF',
              boxShadow: '0 10px 25px rgba(249, 115, 22, 0.35)',
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: '0.12em', fontWeight: 700, opacity: 0.9 }}>
              100% ONLINE CATERING & EVENT SERVICE • {cateringSettings.name.toUpperCase()}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Book Catering & Order Online
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 540, opacity: 0.95, mb: 2 }}>
              Book party feast trays, buffet sets & gourmet catering packages online. Delivered fresh directly to your event venue with real-time tracking & WhatsApp receipts.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="📅 Choose Event Date & Time"
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 600 }}
              />
              <Chip
                label="👥 10 to 100+ Guests / Pax"
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 600 }}
              />
              <Chip
                label="🚚 Contactless Event Delivery"
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 600 }}
              />
              <Chip
                label="🧾 Instant WhatsApp Confirmation"
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 600 }}
              />
            </Box>
          </Card>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search rice, snacks, desserts, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3.5,
              mb: 2,
            }}
          />

          {/* Category Chips */}
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1.5, mb: 2.5 }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  px: 1.5,
                  py: 2,
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  backgroundColor: selectedCategory === cat ? '#F97316' : theme.palette.background.paper,
                  color: selectedCategory === cat ? '#FFFFFF' : theme.palette.text.primary,
                  border: `1px solid ${selectedCategory === cat ? '#F97316' : theme.palette.divider}`,
                }}
              />
            ))}
          </Box>

          {/* Items Grid */}
          <Grid container spacing={2.5}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  onClick={() => handleOpenDetail(item)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 160 }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Chip
                      size="small"
                      label={item.category}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '0.72rem',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25, mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.8rem',
                        mb: 1.5,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#F97316' }} className="tabular-nums">
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1, '');
                        }}
                        sx={{
                          backgroundColor: '#F97316',
                          borderRadius: 2.5,
                          fontWeight: 700,
                          minHeight: 38,
                          '&:hover': { backgroundColor: '#EA580C' },
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Sticky Bottom Cart Bar */}
          {cartCount > 0 && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 74,
                left: 16,
                right: 16,
                maxWidth: 600,
                mx: 'auto',
                zIndex: 1050,
              }}
            >
              <Card
                onClick={() => setCurrentScreen('customer-cart')}
                sx={{
                  backgroundColor: '#1C1917',
                  color: '#FFFFFF',
                  borderRadius: 4,
                  p: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      backgroundColor: '#F97316',
                      color: '#FFFFFF',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    {cartCount}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                      Selected Items
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      <NumberCounter value={cartTotal} prefix="$" />
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: '#F97316',
                    borderRadius: 2.5,
                    fontWeight: 700,
                    minHeight: 40,
                    px: 2,
                    '&:hover': { backgroundColor: '#EA580C' },
                  }}
                >
                  View Cart
                </Button>
              </Card>
            </Box>
          )}
        </Box>
      )}

      {/* Tab 2: Customer Cart & Checkout */}
      {currentScreen === 'customer-cart' && (
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Cart & Checkout
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Review your catering dishes, enter contact details, and place your order.
          </Typography>

          {cart.length === 0 ? (
            <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                Browse our delicious menu dishes and add your favorites.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setCurrentScreen('customer-menu')}
                sx={{ backgroundColor: '#F97316', '&:hover': { backgroundColor: '#EA580C' } }}
              >
                Browse Menu
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {/* Left Column: Items */}
              <Grid item xs={12} md={7}>
                <Card sx={{ p: 2.5, borderRadius: 4, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Your Dishes ({cartCount})
                  </Typography>

                  <Stack spacing={2}>
                    {cart.map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FAFAF9',
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              ${item.price.toFixed(2)} each
                            </Typography>
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F97316' }} className="tabular-nums">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>

                        {item.specialNote && (
                          <Typography variant="caption" sx={{ color: '#EA580C', display: 'block', mb: 1 }}>
                            Note: {item.specialNote}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button
                            size="small"
                            onClick={() => removeFromCart(item.id, item.specialNote)}
                            sx={{ color: '#DC2626', fontSize: '0.75rem', p: 0 }}
                          >
                            Remove
                          </Button>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => updateCartQuantity(item.id, item.specialNote, -1)}
                              sx={{ border: `1px solid ${theme.palette.divider}`, width: 30, height: 30 }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateCartQuantity(item.id, item.specialNote, 1)}
                              sx={{ backgroundColor: '#F97316', color: '#FFFFFF', width: 30, height: 30, '&:hover': { backgroundColor: '#EA580C' } }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid>

              {/* Right Column: Checkout Details */}
              <Grid item xs={12} md={5}>
                <Card sx={{ p: 2.5, borderRadius: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Delivery & Contact
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      {['Online Delivery', 'Scheduled Pickup'].map((type) => (
                        <Button
                          key={type}
                          variant={orderType === type ? 'contained' : 'outlined'}
                          onClick={() => setOrderType(type)}
                          sx={{
                            backgroundColor: orderType === type ? '#F97316' : 'transparent',
                            color: orderType === type ? '#FFFFFF' : theme.palette.text.primary,
                            borderRadius: 2.5,
                            fontWeight: 700,
                          }}
                        >
                          {type}
                        </Button>
                      ))}
                    </Box>

                    {/* Event Date & Time Scheduler */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <TextField
                        size="small"
                        type="date"
                        label="Event / Delivery Date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        size="small"
                        label="Delivery Time Slot"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                      />
                    </Box>

                    {/* Event Type & Guest Count */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <TextField
                        size="small"
                        label="Event Type"
                        placeholder="e.g. Birthday, Corporate"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                      />
                      <TextField
                        size="small"
                        label="Guest Count / Pax"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                      />
                    </Box>

                    <TextField
                      label="Customer Phone (WhatsApp for Receipt)"
                      fullWidth
                      size="small"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />

                    <TextField
                      label="Contact Person Name"
                      fullWidth
                      size="small"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />

                    {orderType === 'Online Delivery' && (
                      <TextField
                        label="Event Venue / Delivery Address"
                        multiline
                        rows={2}
                        fullWidth
                        size="small"
                        placeholder="Venue name, building, floor, street address..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      />
                    )}

                    {/* Payment Placeholder */}
                    <Box sx={{ p: 1.5, borderRadius: 2.5, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F5F5F4' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                        Payment Method (Ready for Payment Gateway Integration)
                      </Typography>
                      <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <FormControlLabel value="cash" control={<Radio size="small" color="warning" />} label="Pay upon Catering Delivery / Setup" />
                        <FormControlLabel value="online" control={<Radio size="small" color="warning" />} label="Online Card Payment (Demo Gateway)" />
                        <FormControlLabel value="invoice" control={<Radio size="small" color="warning" />} label="Corporate Invoice / Bank Transfer" />
                      </RadioGroup>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Pricing breakdown */}
                  <Stack spacing={0.8} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Subtotal
                      </Typography>
                      <Typography variant="body2" className="tabular-nums" sx={{ fontWeight: 600 }}>
                        ${cartSubtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Tax ({(cateringSettings.taxRate * 100).toFixed(0)}%)
                      </Typography>
                      <Typography variant="body2" className="tabular-nums">
                        ${cartTax.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#F97316' }}>
                        <NumberCounter value={cartTotal} prefix="$" />
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handlePlaceOrder}
                    sx={{
                      minHeight: 56,
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      backgroundColor: '#F97316',
                      boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
                      '&:hover': { backgroundColor: '#EA580C' },
                    }}
                  >
                    Confirm & Book Catering Order
                  </Button>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      )}

      {/* Tab 3: Order Tracking */}
      {currentScreen === 'customer-tracking' && (
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Live Order Status
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Real-time kitchen progress updates from prep to packaging.
          </Typography>

          {!activeTrackingOrder ? (
            <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                No active orders found to track.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setCurrentScreen('customer-menu')}
                sx={{ mt: 2, backgroundColor: '#F97316' }}
              >
                Order Food
              </Button>
            </Card>
          ) : (
            <Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="overline" sx={{ color: theme.palette.text.secondary, fontWeight: 700 }}>
                    ACTIVE TICKET
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                    #{activeTrackingOrder.id}
                  </Typography>
                </Box>
                <StatusBadge status={activeTrackingOrder.status} size="medium" />
              </Box>

              {/* Animated Progress Stepper */}
              <Box sx={{ my: 4 }}>
                <Stepper
                  activeStep={getTrackingStepIndex(activeTrackingOrder.status)}
                  alternativeLabel
                  sx={{
                    '& .MuiStepIcon-root.Mui-active': {
                      color: '#F97316',
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                      color: '#16A34A',
                    },
                  }}
                >
                  {['Booking Confirmed', 'Kitchen Preparing', 'Packed & Out for Delivery', 'Delivered & Complete'].map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Scheduled Event & Delivery Highlights */}
              {activeTrackingOrder.eventDate && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: 'rgba(249, 115, 22, 0.08)',
                    border: '1px solid rgba(249, 115, 22, 0.25)',
                    mb: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: '#C2410C', letterSpacing: '0.08em' }}>
                      SCHEDULED CATERING EVENT TIME
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1C1917' }}>
                      📅 {activeTrackingOrder.eventDate} at {activeTrackingOrder.eventTime || '12:30 PM'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={activeTrackingOrder.orderType || 'Online Delivery'} color="primary" sx={{ fontWeight: 700 }} />
                    {activeTrackingOrder.guestCount && (
                      <Chip label={`👥 ${activeTrackingOrder.guestCount}`} sx={{ fontWeight: 700 }} />
                    )}
                  </Box>
                </Box>
              )}

              {/* Order summary info */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Catering Dishes & Trays
                  </Typography>
                  {activeTrackingOrder.items.map((i, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                      • {i.quantity}x {i.name} (${(i.price * i.quantity).toFixed(2)})
                    </Typography>
                  ))}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#16A34A', mt: 1 }}>
                    Total: ${activeTrackingOrder.total.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Event Venue & Delivery Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                    {activeTrackingOrder.deliveryAddress || 'Delivery Address on file'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                    Customer Contact: {activeTrackingOrder.customerName} ({activeTrackingOrder.customerPhone})
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                    Catering Kitchen Helpline: {cateringSettings.phone}
                  </Typography>
                </Grid>
              </Grid>

              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => openReceiptModal(activeTrackingOrder)}
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    backgroundColor: '#25D366',
                    '&:hover': { backgroundColor: '#1EBE5D' },
                    minHeight: 44,
                    fontWeight: 700,
                  }}
                >
                  WhatsApp Receipt
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => generatePdfReceipt(activeTrackingOrder, cateringSettings)}
                  startIcon={<PictureAsPdfIcon sx={{ color: '#DC2626' }} />}
                  sx={{ minHeight: 44, borderRadius: 2.5 }}
                >
                  Download PDF
                </Button>
              </Box>
            </Card>
          )}
        </Box>
      )}

      {/* Tab 4: Customer Order History & Receipts */}
      {currentScreen === 'customer-history' && (
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Past Orders & Receipts
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Download digital receipts or 1-tap reorder your favorite meals.
          </Typography>

          <Stack spacing={2}>
            {orders.map((ord) => (
              <Card key={ord.id} sx={{ p: 2.5, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      #{ord.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  <StatusBadge status={ord.status} size="small" />
                </Box>

                <Box sx={{ mb: 2 }}>
                  {ord.items.map((i, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      • {i.quantity}x {i.name}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#16A34A' }} className="tabular-nums">
                    ${ord.total.toFixed(2)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => generatePdfReceipt(ord, cateringSettings)}
                      startIcon={<PictureAsPdfIcon sx={{ color: '#DC2626' }} />}
                      sx={{ borderRadius: 2, minHeight: 36 }}
                    >
                      PDF
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleReorder(ord)}
                      startIcon={<RefreshIcon />}
                      sx={{
                        backgroundColor: '#F97316',
                        borderRadius: 2,
                        minHeight: 36,
                        fontWeight: 700,
                        '&:hover': { backgroundColor: '#EA580C' },
                      }}
                    >
                      Reorder
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* Item Detail Bottom Sheet Drawer */}
      <Drawer
        anchor="bottom"
        open={Boolean(selectedItemForDetail)}
        onClose={() => setSelectedItemForDetail(null)}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            overflow: 'hidden',
          },
        }}
      >
        {selectedItemForDetail && (
          <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', width: '100%' }}>
            <Box sx={{ width: 44, height: 5, backgroundColor: 'rgba(120, 113, 108, 0.3)', borderRadius: 9999, mx: 'auto', mb: 2 }} />

            <Box sx={{ height: 200, borderRadius: 4, overflow: 'hidden', mb: 2 }}>
              <img
                src={selectedItemForDetail.image}
                alt={selectedItemForDetail.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {selectedItemForDetail.name}
                </Typography>
                <Chip size="small" label={selectedItemForDetail.category} sx={{ mt: 0.5, fontWeight: 600 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#F97316' }} className="tabular-nums">
                ${selectedItemForDetail.price.toFixed(2)}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2.5 }}>
              {selectedItemForDetail.description}
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Special instructions (e.g. less spicy, sauce on the side)..."
              value={detailNote}
              onChange={(e) => setDetailNote(e.target.value)}
              sx={{ mb: 2.5 }}
            />

            {/* Quantity Stepper & Add Button */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  p: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                  sx={{ width: 36, height: 36 }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, width: 36, textAlign: 'center' }} className="tabular-nums">
                  {detailQuantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setDetailQuantity((q) => q + 1)}
                  sx={{ width: 36, height: 36, backgroundColor: '#F97316', color: '#FFFFFF', '&:hover': { backgroundColor: '#EA580C' } }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={handleAddToCartFromDetail}
                sx={{
                  minHeight: 48,
                  fontSize: '1rem',
                  fontWeight: 800,
                  backgroundColor: '#F97316',
                  '&:hover': { backgroundColor: '#EA580C' },
                }}
              >
                Add • ${(selectedItemForDetail.price * detailQuantity).toFixed(2)}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};
