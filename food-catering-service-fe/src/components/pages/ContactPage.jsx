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
  Stack,
  useTheme,
} from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../../context/AppContext';

export const ContactPage = () => {
  const { showToast } = useApp();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Corporate Catering Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry received! Our catering coordinator will contact you shortly.', 'success');
  };

  return (
    <Box sx={{ pb: 12 }}>
      {/* Header Banner */}
      <Box
        sx={{
          py: 6,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #F8FAFC 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="SRI LANKA CATERING HOTLINE"
            size="small"
            sx={{ fontWeight: 800, mb: 1.5, bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Get in Touch With Our Catering Team
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Have a custom event inquiry, boardroom recurring order, or wedding consultation in mind?
            We are here to assist you 7 days a week.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Contact Details Cards Left */}
          <Grid item xs={12} md={5}>
            <Stack spacing={2.5}>
              <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocationOnIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: 'block' }}>
                      CENTRAL CLOUD KITCHEN
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      No. 48, Galle Road, Colombo 03, Sri Lanka
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Adjacent to Kollupitiya Junction
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(22,163,74,0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneInTalkIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: 'block' }}>
                      COLOMBO HOTLINES
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      +94 11 234 5678 / +94 77 890 1234
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Available 07:00 AM - 10:00 PM Daily
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(37,99,235,0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: 'block' }}>
                      EMAIL INQUIRIES
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      orders@ceylonfeast.lk
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Quotes answered within 2 hours
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <WhatsAppIcon sx={{ fontSize: 36, color: '#16A34A' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Instant WhatsApp Catering Assistance
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      Connect with our catering coordinator for urgent orders.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    href="https://wa.me/94778901234"
                    target="_blank"
                    sx={{ bgcolor: '#16A34A', '&:hover': { bgcolor: '#15803D' }, borderRadius: '10px' }}
                  >
                    Chat
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Grid>

          {/* Inquiry Form Right */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 4, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                Fill out the form below and we will prepare a customized proposal for your event.
              </Typography>

              {submitted ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#16A34A', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    Thank You, {name || 'Customer'}!
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                    Your catering inquiry has been assigned to our corporate catering desk.
                  </Typography>
                  <Button variant="outlined" onClick={() => setSubmitted(false)} sx={{ borderRadius: '12px' }}>
                    Send Another Message
                  </Button>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number (+94)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Inquiry Type"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        SelectProps={{ native: true }}
                      >
                        <option value="Corporate Catering Inquiry">Corporate Catering Inquiry</option>
                        <option value="Wedding Banquet Consultation">Wedding Banquet Consultation</option>
                        <option value="Daily Meal Subscriptions">Daily Meal Subscriptions</option>
                        <option value="Home Gathering / Party">Home Gathering / Party</option>
                        <option value="General Question">General Question</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Tell us about your event (Date, Pax, Preferences)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<SendIcon />}
                        sx={{
                          backgroundColor: '#F97316',
                          '&:hover': { backgroundColor: '#EA580C' },
                          py: 1.5,
                          borderRadius: '14px',
                          fontWeight: 800,
                        }}
                      >
                        Submit Catering Inquiry
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

