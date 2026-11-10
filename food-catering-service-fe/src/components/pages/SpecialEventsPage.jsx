import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  MenuItem,
  Stack,
  Slider,
  FormControlLabel,
  Checkbox,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import SendIcon from '@mui/icons-material/Send';
import { useApp } from '../../context/AppContext';

export const SpecialEventsPage = () => {
  const { createOrder, showToast, setCurrentScreen } = useApp();
  const theme = useTheme();

  // Booking Form State
  const [eventType, setEventType] = useState('Grand Wedding Banquet');
  const [serviceStyle, setServiceStyle] = useState('Full Buffet Spread');
  const [guestCount, setGuestCount] = useState(100);
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('06:30 PM - 10:30 PM (Dinner)');
  const [venueDistrict, setVenueDistrict] = useState('Colombo 07 (Cinnamon Gardens)');
  const [venueAddress, setVenueAddress] = useState('BMICH Hall B, Bauddhaloka Mawatha, Colombo 07');
  const [clientName, setClientName] = useState('Priyantha & Shenali Wedding');
  const [clientPhone, setClientPhone] = useState('+94 77 555 1234');
  const [budgetPerHead, setBudgetPerHead] = useState(3850);

  // Add-on options
  const [addOns, setAddOns] = useState({
    liveHoppers: true,
    uniformedStaff: true,
    chafingDishes: true,
    customDessertTable: false,
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Total computation in LKR
  const addOnsTotal =
    (addOns.liveHoppers ? 35000 : 0) +
    (addOns.uniformedStaff ? 25000 : 0) +
    (addOns.chafingDishes ? 15000 : 0) +
    (addOns.customDessertTable ? 40000 : 0);

  const foodSubtotal = guestCount * budgetPerHead;
  const grandTotal = foodSubtotal + addOnsTotal;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const eventOrder = {
      customerName: clientName,
      customerPhone: clientPhone,
      orderType: 'Online Delivery',
      eventDate,
      eventTime,
      eventType: `${eventType} (${serviceStyle})`,
      guestCount: `${guestCount} Guests`,
      deliveryAddress: `${venueAddress}, ${venueDistrict}`,
      notes: `Add-ons: ${Object.keys(addOns).filter((k) => addOns[k]).join(', ')}`,
      items: [
        {
          id: 'event-booking-custom',
          name: `${eventType} - ${serviceStyle}`,
          price: budgetPerHead,
          quantity: guestCount,
          specialNote: `Venue: ${venueAddress} | District: ${venueDistrict}`,
        },
      ],
    };

    const res = await createOrder(eventOrder);
    if (res) {
      setBookingSuccess(true);
      showToast('Event booking inquiry submitted successfully!', 'success');
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #FAF5FF 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="SPECIAL EVENTS & WEDDINGS"
            size="small"
            sx={{ fontWeight: 800, mb: 1.5, bgcolor: 'rgba(147, 51, 234, 0.1)', color: '#9333EA' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Reserve Your Special Event Catering
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Weddings, corporate annual conferences, gala evenings, milestone birthdays, and private parties
            with optional live cooking stations and uniformed banquet waitstaff.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {bookingSuccess ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: '24px', maxWidth: 650, mx: 'auto' }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: '#16A34A', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Event Booking Reserved!
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
              Our Senior Event Catering Manager has received your reservation for {clientName} ({guestCount} guests).
              We will contact you at {clientPhone} to confirm customized tasting menus and banquet setup.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" onClick={() => setCurrentScreen('tracking')} sx={{ bgcolor: '#F97316', borderRadius: '12px' }}>
                Track Live Status
              </Button>
              <Button variant="outlined" onClick={() => setBookingSuccess(false)} sx={{ borderRadius: '12px' }}>
                Book Another Event
              </Button>
            </Stack>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {/* Booking Form Left */}
            <Grid item xs={12} md={7}>
              <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  Event Details & Requirements
                </Typography>

                <form onSubmit={handleSubmitBooking}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Event Category"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        <MenuItem value="Grand Wedding Banquet">Grand Wedding Banquet</MenuItem>
                        <MenuItem value="Corporate Annual Conference / AGM">Corporate Conference / AGM</MenuItem>
                        <MenuItem value="Milestone Birthday & Party">Milestone Birthday & Party</MenuItem>
                        <MenuItem value="Almsgiving (Dane) / Religious Function">Almsgiving (Dane)</MenuItem>
                        <MenuItem value="Cocktail Evening & Canapés">Cocktail Evening & Canapés</MenuItem>
                        <MenuItem value="Private Villa / Home Dinner">Private Villa Dinner</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Service Style"
                        value={serviceStyle}
                        onChange={(e) => setServiceStyle(e.target.value)}
                      >
                        <MenuItem value="Full Buffet Spread">Full Buffet Spread</MenuItem>
                        <MenuItem value="Live Hoppers & Kottu Stations">Live Cooking Stations</MenuItem>
                        <MenuItem value="Executive Boxed Lunch">Executive Boxed Bento Packs</MenuItem>
                        <MenuItem value="Cocktail Canapés & Finger Foods">Cocktail Canapés & Drinks</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Guest Count Slider */}
                    <Grid item xs={12}>
                      <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC' }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Expected Guest Count
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#EA580C' }}>
                            {guestCount} Guests
                          </Typography>
                        </Stack>
                        <Slider
                          value={guestCount}
                          min={25}
                          max={500}
                          step={10}
                          onChange={(_, val) => setGuestCount(val)}
                          sx={{ color: '#F97316' }}
                        />
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>25 Pax</Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>500+ Pax</Typography>
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Event Date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Time Slot"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                      >
                        <MenuItem value="11:30 AM - 02:30 PM (Lunch)">11:30 AM - 02:30 PM (Lunch)</MenuItem>
                        <MenuItem value="06:30 PM - 10:30 PM (Dinner)">06:30 PM - 10:30 PM (Dinner)</MenuItem>
                        <MenuItem value="04:00 PM - 07:00 PM (Cocktail / High Tea)">04:00 PM - 07:00 PM (High Tea)</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Sri Lanka District / Zone"
                        value={venueDistrict}
                        onChange={(e) => setVenueDistrict(e.target.value)}
                      >
                        <MenuItem value="Colombo 01-15 (City Limits)">Colombo 01-15 (City Limits)</MenuItem>
                        <MenuItem value="Colombo 07 (Cinnamon Gardens)">Colombo 07 (Cinnamon Gardens)</MenuItem>
                        <MenuItem value="Dehiwala / Mount Lavinia">Dehiwala / Mount Lavinia</MenuItem>
                        <MenuItem value="Rajagiriya / Battaramulla">Rajagiriya / Battaramulla</MenuItem>
                        <MenuItem value="Nugegoda / Maharagama">Nugegoda / Maharagama</MenuItem>
                        <MenuItem value="Gampaha / Negombo">Gampaha / Negombo</MenuItem>
                        <MenuItem value="Kandy / Central Hills">Kandy / Central Hills</MenuItem>
                        <MenuItem value="Galle / Southern Coast">Galle / Southern Coast</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Venue Name / Address"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Host / Contact Person"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone (Sri Lanka +94)"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        required
                      />
                    </Grid>

                    {/* Add-ons Checkboxes */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                        BANQUET EQUIPMENT & LIVE STATION ADD-ONS:
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" gap={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={addOns.liveHoppers}
                              onChange={(e) => setAddOns({ ...addOns, liveHoppers: e.target.checked })}
                              sx={{ color: '#F97316', '&.Mui-checked': { color: '#F97316' } }}
                            />
                          }
                          label="Live Egg Hoppers Chef Station (+Rs. 35,000)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={addOns.uniformedStaff}
                              onChange={(e) => setAddOns({ ...addOns, uniformedStaff: e.target.checked })}
                              sx={{ color: '#F97316', '&.Mui-checked': { color: '#F97316' } }}
                            />
                          }
                          label="Uniformed Banquet Waitstaff (+Rs. 25,000)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={addOns.chafingDishes}
                              onChange={(e) => setAddOns({ ...addOns, chafingDishes: e.target.checked })}
                              sx={{ color: '#F97316', '&.Mui-checked': { color: '#F97316' } }}
                            />
                          }
                          label="Stainless Chafing Dishes & Warmers (+Rs. 15,000)"
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<SendIcon />}
                        sx={{
                          backgroundColor: '#9333EA',
                          '&:hover': { backgroundColor: '#7E22CE' },
                          py: 1.6,
                          borderRadius: '16px',
                          fontWeight: 800,
                          fontSize: '1rem',
                        }}
                      >
                        Submit Event Reservation (Rs. {grandTotal.toLocaleString()})
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Grid>

            {/* Price Summary Right Card */}
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
                  Estimated Event Quote Breakdown
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Event Type:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {eventType}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Total Pax:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {guestCount} Guests
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Per Pax Rate:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rs. {budgetPerHead.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Food & Beverage Subtotal:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rs. {foodSubtotal.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Banquet Add-ons & Equipment:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rs. {addOnsTotal.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Estimated Grand Total:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#9333EA' }}>
                    Rs. {grandTotal.toLocaleString()}
                  </Typography>
                </Stack>

                <Alert severity="info" sx={{ borderRadius: '14px', fontSize: '0.8rem' }}>
                  Includes free food tasting session for 2 guests prior to the wedding / event for bookings above 50 pax.
                </Alert>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

