import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Stack,
  Divider,
  TextField,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../../context/AppContext';

export const CartPage = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cateringSettings,
    createOrder,
    setCurrentScreen,
    currentUser,
  } = useApp();
  const theme = useTheme();

  // Checkout Fields
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Kavindu Perera');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+94 77 902 1823');
  const [deliveryAddress, setDeliveryAddress] = useState('Level 18, World Trade Center, Echelon Square, Colombo 01');
  const [deliveryZone, setDeliveryZone] = useState('Colombo 01-03 (Fort / Kollupitiya)');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('12:00 PM - 01:30 PM (Lunch)');
  const [paymentMethod, setPaymentMethod] = useState('payhere'); // 'payhere', 'card', 'bank', 'cash'
  const [orderNotes, setOrderNotes] = useState('');

  // PayHere Modal Simulation State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPayHereModal, setShowPayHereModal] = useState(false);

  // Cart Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (cateringSettings.taxRate || 0.05); // 5% SSCL/VAT
  const deliveryFee = subtotal >= 15000 ? 0 : 750; // Free delivery over Rs. 15,000 in Colombo
  const total = subtotal + tax + deliveryFee;

  const handleOpenPayHere = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (paymentMethod === 'payhere' || paymentMethod === 'card') {
      setShowPayHereModal(true);
    } else {
      executeOrderPlacement(paymentMethod === 'bank' ? 'Bank Transfer (Slip Verified)' : 'Cash on Delivery');
    }
  };

  const executeOrderPlacement = async (verifiedPaymentMethod) => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      const orderData = {
        customerName,
        customerPhone,
        orderType: 'Online Delivery',
        eventDate,
        eventTime,
        eventType: 'Online Catering Order',
        guestCount: `${cart.reduce((s, i) => s + i.quantity, 0)} Portions`,
        deliveryAddress: `${deliveryAddress} (${deliveryZone})`,
        paymentMethod: verifiedPaymentMethod || 'PayHere Online (LKR)',
        paymentStatus: verifiedPaymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        notes: orderNotes,
        items: cart,
      };

      const newOrder = await createOrder(orderData);
      setIsProcessingPayment(false);
      setShowPayHereModal(false);
      if (newOrder) {
        setCurrentScreen('tracking');
      }
    }, 1800);
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <ShoppingBagIcon sx={{ fontSize: 72, color: theme.palette.text.secondary, mb: 2, opacity: 0.5 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
          Your Catering Cart is Empty
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          Browse our curated Sri Lankan catering packages, biryani trays, lamprais, and short eats to get started.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => setCurrentScreen('packages')}
            sx={{ backgroundColor: '#F97316', borderRadius: '14px', px: 4, fontWeight: 700 }}
          >
            Explore Packages
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setCurrentScreen('menu')}
            sx={{ borderRadius: '14px', px: 3.5, borderColor: theme.palette.divider }}
          >
            Browse A La Carte Menu
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: 12 }}>
      {/* Banner */}
      <Box
        sx={{
          py: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #F8FAFC 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 5,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
            Shopping Cart & Checkout
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Review catering items, schedule delivery time in Colombo, and pay securely via PayHere.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <form onSubmit={handleOpenPayHere}>
          <Grid container spacing={4}>
            {/* Left Column: Cart Items & Delivery Information */}
            <Grid item xs={12} md={7}>
              {/* Cart Items List */}
              <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Catering Order Items ({cart.length})
                  </Typography>
                  <Button size="small" onClick={clearCart} sx={{ color: theme.palette.error.main, textTransform: 'none' }}>
                    Clear All
                  </Button>
                </Stack>

                <Stack spacing={2} divider={<Divider />}>
                  {cart.map((item, idx) => (
                    <Stack direction="row" spacing={2} alignItems="center" key={`${item.id}-${idx}`}>
                      <CardMedia
                        component="img"
                        image={item.image || item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                        alt={item.name}
                        sx={{ width: 68, height: 68, borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {item.name}
                        </Typography>
                        {item.specialNote && (
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                            {item.specialNote}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#EA580C', mt: 0.3 }}>
                          Rs. {item.price.toLocaleString()}
                        </Typography>
                      </Box>

                      {/* Quantity Controls */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => updateCartQuantity(item.id, item.specialNote, -1)}
                          sx={{ border: `1px solid ${theme.palette.divider}` }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 24, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateCartQuantity(item.id, item.specialNote, 1)}
                          sx={{ border: `1px solid ${theme.palette.divider}` }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id, item.specialNote)}
                          sx={{ color: theme.palette.text.secondary, ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Card>

              {/* Delivery Schedule & Address Form */}
              <Card sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Delivery Address & Event Timing (Sri Lanka)
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Customer / Company Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Mobile (WhatsApp +94)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Delivery Date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Time Window"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value="11:30 AM - 01:00 PM (Lunch Dispatch)">11:30 AM - 01:00 PM (Lunch Dispatch)</option>
                      <option value="01:00 PM - 02:30 PM (Afternoon)">01:00 PM - 02:30 PM (Afternoon)</option>
                      <option value="06:30 PM - 08:30 PM (Dinner Dispatch)">06:30 PM - 08:30 PM (Dinner Dispatch)</option>
                      <option value="Morning 08:00 AM - 10:00 AM (Breakfast)">Morning 08:00 AM - 10:00 AM (Breakfast)</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Delivery District / City"
                      value={deliveryZone}
                      onChange={(e) => setDeliveryZone(e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value="Colombo 01-03 (Fort / Kollupitiya)">Colombo 01-03 (Fort / Slave Island / Kollupitiya)</option>
                      <option value="Colombo 04-06 (Bambalapitiya / Havelock / Wellawatte)">Colombo 04-06 (Bambalapitiya / Havelock / Wellawatte)</option>
                      <option value="Colombo 07 (Cinnamon Gardens / Independence Square)">Colombo 07 (Cinnamon Gardens)</option>
                      <option value="Colombo 08-10 (Borella / Dematagoda / Maradana)">Colombo 08-10 (Borella / Maradana)</option>
                      <option value="Dehiwala / Mount Lavinia / Ratmalana">Dehiwala / Mount Lavinia / Ratmalana</option>
                      <option value="Rajagiriya / Battaramulla / Pelawatta">Rajagiriya / Battaramulla / Pelawatta</option>
                      <option value="Nugegoda / Maharagama / Kottawa">Nugegoda / Maharagama / Kottawa</option>
                      <option value="Kandy & Outstation Event Delivery">Kandy & Outstation Event Delivery</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Street Address & Landmark"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="E.g., Floor, Building Name, Street, Landmark"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Special Kitchen or Delivery Instructions"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="E.g., Ring bell, security check at front gate, deliver in thermal bag..."
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Payment Methods */}
              <Card sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Payment Method (Sri Lanka)
                </Typography>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {/* PayHere */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      border: `1.5px solid ${paymentMethod === 'payhere' ? '#F97316' : theme.palette.divider}`,
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <FormControlLabel
                      value="payhere"
                      control={<Radio sx={{ color: '#F97316', '&.Mui-checked': { color: '#F97316' } }} />}
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            PayHere Sri Lanka (Online Gateway)
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Visa, MasterCard, AMEX, eZ Cash, mCash, FriMi, Genie
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip label="Recommended" size="small" sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16A34A', fontWeight: 700 }} />
                  </Box>

                  {/* Bank Transfer */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      border: `1.5px solid ${paymentMethod === 'bank' ? '#F97316' : theme.palette.divider}`,
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <FormControlLabel
                      value="bank"
                      control={<Radio sx={{ color: '#F97316', '&.Mui-checked': { color: '#F97316' } }} />}
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Direct Bank Transfer (Commercial Bank / BOC / Sampath)
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Upload or WhatsApp transfer receipt for corporate orders
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>

                  {/* Cash on Delivery */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      border: `1.5px solid ${paymentMethod === 'cash' ? '#F97316' : theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <FormControlLabel
                      value="cash"
                      control={<Radio sx={{ color: '#F97316', '&.Mui-checked': { color: '#F97316' } }} />}
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Cash on Delivery / Event Arrival
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Pay our delivery rider upon temperature-checked handover
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </RadioGroup>
              </Card>
            </Grid>

            {/* Right Column: Order Summary & Place Order Button */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  p: 3.5,
                  borderRadius: '24px',
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'sticky',
                  top: 90,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Order Summary
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Food & Catering Subtotal:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rs. {subtotal.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Government Taxes (SSCL & VAT 5%):
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rs. {tax.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Insulated Delivery Dispatch:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: deliveryFee === 0 ? '#16A34A' : 'inherit' }}>
                      {deliveryFee === 0 ? 'FREE (Orders > Rs. 15,000)' : `Rs. ${deliveryFee}`}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Grand Total (LKR):
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#EA580C' }}>
                    Rs. {total.toLocaleString()}
                  </Typography>
                </Stack>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<LockIcon />}
                  sx={{
                    backgroundColor: '#16A34A',
                    '&:hover': { backgroundColor: '#15803D' },
                    py: 1.6,
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  Confirm & Pay with PayHere
                </Button>

                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textAlign: 'center', display: 'block', mt: 2 }}>
                  🔒 256-Bit Encrypted PayHere Local Sri Lankan Payment Processing
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>

      {/* PayHere Sri Lanka Simulation Modal */}
      <Dialog
        open={showPayHereModal}
        onClose={() => !isProcessingPayment && setShowPayHereModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: '#0284C7', fontWeight: 800 }}>
            <LockIcon fontSize="small" /> PayHere Checkout
          </Box>
          <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary }}>
            Merchant: Ceylon Feast Smart Catering (Pvt) Ltd
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'rgba(2, 132, 199, 0.08)', mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#0369A1', fontWeight: 700, display: 'block' }}>
              AMOUNT TO PAY IN SRI LANKAN RUPEES
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0369A1' }}>
              Rs. {total.toLocaleString()}
            </Typography>
          </Box>

          {isProcessingPayment ? (
            <Box sx={{ py: 4 }}>
              <CircularProgress size={48} sx={{ color: '#0284C7', mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Authorizing with Sri Lanka PayHere Gateway...
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Verifying bank authentication & placing kitchen ticket.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Simulating PayHere Sandbox transaction for <b>{customerName}</b> ({customerPhone}).
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => executeOrderPlacement('PayHere (Online Visa/MasterCard)')}
                sx={{
                  backgroundColor: '#0284C7',
                  '&:hover': { backgroundColor: '#0369A1' },
                  py: 1.4,
                  borderRadius: '12px',
                  fontWeight: 700,
                }}
              >
                Approve Payment (Demo Instant Success)
              </Button>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
