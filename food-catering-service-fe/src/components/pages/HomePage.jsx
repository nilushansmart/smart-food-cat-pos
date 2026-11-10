import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Slider,
  Stack,
  useTheme,
  IconButton,
  Rating,
  Avatar,
  Divider,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RepeatIcon from '@mui/icons-material/Repeat';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalculateIcon from '@mui/icons-material/Calculate';
import StarIcon from '@mui/icons-material/Star';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useApp } from '../../context/AppContext';

export const HomePage = () => {
  const { setCurrentScreen, menuItems, addToCart, reviews, cateringSettings } = useApp();
  const theme = useTheme();

  // Instant Quote Estimator State
  const [quotePax, setQuotePax] = useState(30);
  const [quoteType, setQuoteType] = useState('Corporate'); // Corporate, Wedding, Gathering, Subscription

  // Pricing formula in Sri Lankan Rupees (LKR)
  const getEstimatedRate = (type) => {
    switch (type) {
      case 'Corporate':
        return 1850; // Boardroom executive lunch rate
      case 'Wedding':
        return 3850; // Grand wedding buffet rate
      case 'Gathering':
        return 2200; // Birthday & party feast rate
      case 'Subscription':
        return 1250; // Daily corporate lunch box rate
      default:
        return 1850;
    }
  };

  const currentRate = getEstimatedRate(quoteType);
  const estimatedTotal = quotePax * currentRate;

  // Filter 4 featured catering packages
  const featuredPackages = menuItems.filter(
    (item) => item.category === 'Catering Packages' || item.popular
  ).slice(0, 4);

  return (
    <Box sx={{ pb: 10 }}>
      {/* Hero Section with Modern Animated Gradient & Badge */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 50%, #F0FDF4 100%)',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background glow circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, rgba(22,163,74,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              {/* Country Badge */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Chip
                  label="🇱🇰 Colombo Central Cloud Kitchen"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                    color: '#EA580C',
                    fontWeight: 700,
                    borderRadius: '20px',
                    px: 1,
                  }}
                />
                <Chip
                  label="HACCP Certified Hygiene"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(22, 163, 74, 0.1)',
                    color: '#16A34A',
                    fontWeight: 700,
                    borderRadius: '20px',
                  }}
                />
              </Stack>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  mb: 2.5,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.03em',
                }}
              >
                Smart Food Catering <br />
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #F97316 0%, #EA580C 50%, #16A34A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Crafted for Sri Lanka
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  color: theme.palette.text.secondary,
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 600,
                }}
              >
                From premium corporate boardroom lunch packages to grand wedding banquets
                and daily office meal subscriptions. Authentic Ceylon spices, certified cloud
                kitchen hygiene, and on-time temperature-controlled delivery.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setCurrentScreen('packages')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: '#F97316',
                    '&:hover': { backgroundColor: '#EA580C' },
                    px: 4,
                    py: 1.6,
                    fontSize: '1rem',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(249, 115, 22, 0.3)',
                  }}
                >
                  Explore Catering Packages
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setCurrentScreen('custom-order')}
                  startIcon={<CalculateIcon />}
                  sx={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    '&:hover': { borderColor: '#F97316', backgroundColor: 'rgba(249,115,22,0.05)' },
                    px: 3.5,
                    py: 1.6,
                    fontSize: '1rem',
                    borderRadius: '16px',
                  }}
                >
                  Customize Your Order
                </Button>
              </Stack>

              {/* Trust Metrics Pill */}
              <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={4}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#F97316' }}>
                    10,000+
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Meals Served Monthly
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#16A34A' }}>
                    99.8%
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    On-Time Delivery
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#EAB308' }}>
                    4.9 / 5.0
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Client Satisfaction
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Instant Interactive Catering Cost Calculator Card */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: '24px',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'relative',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Instant Cost Estimator
                  </Typography>
                  <Chip
                    label="Live LKR Rate"
                    size="small"
                    sx={{ bgcolor: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                  Select your event scale & receive instant per-guest pricing for Colombo & suburbs:
                </Typography>

                {/* Event Type Selector Buttons */}
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, mb: 1, display: 'block' }}>
                  1. EVENT CATEGORY
                </Typography>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {[
                    { id: 'Corporate', label: 'Corporate Lunch', icon: BusinessIcon },
                    { id: 'Wedding', label: 'Wedding Banquet', icon: CelebrationIcon },
                    { id: 'Gathering', label: 'Home Party', icon: GroupsIcon },
                    { id: 'Subscription', label: 'Meal Subscriptions', icon: RepeatIcon },
                  ].map((cat) => {
                    const isSelected = quoteType === cat.id;
                    const IconComponent = cat.icon;
                    return (
                      <Grid item xs={6} key={cat.id}>
                        <Button
                          fullWidth
                          onClick={() => setQuoteType(cat.id)}
                          sx={{
                            p: 1.2,
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                            border: `1.5px solid ${isSelected ? '#F97316' : theme.palette.divider}`,
                            backgroundColor: isSelected
                              ? 'rgba(249, 115, 22, 0.08)'
                              : theme.palette.background.default,
                            color: isSelected ? '#EA580C' : theme.palette.text.primary,
                            '&:hover': {
                              backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.12)' : 'rgba(0,0,0,0.02)',
                            },
                          }}
                        >
                          <IconComponent fontSize="small" />
                          <Typography variant="caption" sx={{ fontWeight: 700, textAlign: 'center' }}>
                            {cat.label}
                          </Typography>
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Pax Slider */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>
                      2. NUMBER OF GUESTS / MEALS
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F97316' }}>
                      {quotePax} {quoteType === 'Subscription' ? 'Meals' : 'Guests'}
                    </Typography>
                  </Stack>
                  <Slider
                    value={quotePax}
                    min={10}
                    max={250}
                    step={5}
                    onChange={(_, val) => setQuotePax(val)}
                    sx={{
                      color: '#F97316',
                      '& .MuiSlider-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#FFFFFF',
                        border: '3px solid #F97316',
                      },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>10 Pax</Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>250+ Pax</Typography>
                  </Stack>
                </Box>

                {/* Live Cost Computation Display */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    backgroundColor: theme.palette.mode === 'dark' ? '#27272A' : '#FFF7ED',
                    border: '1px dashed #F97316',
                    mb: 3,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Per Person Rate:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rs. {currentRate.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Estimated Budget:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#EA580C' }}>
                      Rs. {estimatedTotal.toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setCurrentScreen('packages')}
                  sx={{
                    backgroundColor: '#16A34A',
                    '&:hover': { backgroundColor: '#15803D' },
                    py: 1.4,
                    borderRadius: '14px',
                    fontWeight: 700,
                  }}
                >
                  Book This Package Now
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4 Client Verticals Section (Business Concept) */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="WHO WE SERVE"
            size="small"
            sx={{ fontWeight: 800, letterSpacing: '0.08em', mb: 1.5, bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C' }}
          />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, mb: 1.5 }}>
            Tailored Catering For Every Occasion
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: 650, mx: 'auto' }}>
            We specialize in 4 distinct catering sectors across Colombo and Western Province:
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              title: 'Individuals & Families',
              icon: GroupsIcon,
              color: '#3B82F6',
              bg: 'rgba(59, 130, 246, 0.1)',
              description: 'Birthday celebrations, home functions, almsgivings (Dane), and private housewarmings with traditional Sri Lankan party platters.',
              examples: 'Biryani Trays • Lamprais Packs • Cocktail Platters',
              action: () => setCurrentScreen('menu'),
            },
            {
              title: 'Corporate Customers',
              icon: BusinessIcon,
              color: '#F97316',
              bg: 'rgba(249, 115, 22, 0.1)',
              description: 'Executive boardroom lunch boxes, client meetings, annual AGMs, tech hackathons, and corporate VIP gatherings.',
              examples: 'Boardroom Bento Sets • Gourmet Coffee Breaks • Buffet',
              action: () => setCurrentScreen('packages'),
            },
            {
              title: 'Event Organizers',
              icon: CelebrationIcon,
              color: '#9333EA',
              bg: 'rgba(147, 51, 234, 0.1)',
              description: 'Grand weddings, milestone anniversary dinners, product launches, gala evenings, and high-volume conferences.',
              examples: 'Full Banquet Buffet • Live Cooking Stations • Canapés',
              action: () => setCurrentScreen('events'),
            },
            {
              title: 'Regular Meal Subscribers',
              icon: RepeatIcon,
              color: '#16A34A',
              bg: 'rgba(22, 163, 74, 0.1)',
              description: 'Daily or weekly curated chef meal plans delivered hot to corporate offices and residences Monday to Friday.',
              examples: '5-Day Lunch Subscriptions • Healthy Diet Meals',
              action: () => setCurrentScreen('packages'),
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.06)',
                      borderColor: item.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: '16px',
                      backgroundColor: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      mb: 2.5,
                    }}
                  >
                    <Icon fontSize="medium" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, flex: 1 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F4F4F5', mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>
                      {item.examples}
                    </Typography>
                  </Box>
                  <Button
                    variant="text"
                    onClick={item.action}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: item.color, fontWeight: 700, alignSelf: 'flex-start', p: 0 }}
                  >
                    Explore Menus
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Featured Catering Packages Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 5 }}>
          <Box>
            <Chip
              label="SIGNATURE PACKAGES"
              size="small"
              sx={{ fontWeight: 800, mb: 1, bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C' }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800 }}>
              Popular Catering Packages
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setCurrentScreen('packages')}
            endIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: '12px', mt: { xs: 2, sm: 0 }, borderColor: theme.palette.divider }}
          >
            View All Packages
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {featuredPackages.map((pkg) => (
            <Grid item xs={12} sm={6} md={3} key={pkg.id}>
              <Card
                sx={{
                  borderRadius: '20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="170"
                    image={pkg.image}
                    alt={pkg.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label={pkg.pax || 'Catering Pack'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: '#FFF',
                      backdropFilter: 'blur(4px)',
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>
                    {pkg.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                    }}
                  >
                    {pkg.description}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                        Starting from
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#EA580C' }}>
                        Rs. {pkg.price.toLocaleString()}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => addToCart(pkg, 1)}
                      sx={{
                        backgroundColor: '#F97316',
                        '&:hover': { backgroundColor: '#EA580C' },
                        borderRadius: '10px',
                        px: 2,
                        fontWeight: 700,
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Cloud Kitchen Safety & Standards Banner */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '24px',
            backgroundColor: theme.palette.mode === 'dark' ? '#18181B' : '#F8FAFC',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="SAFETY & RELIABILITY"
                size="small"
                sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16A34A', fontWeight: 800, mb: 1.5 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Central Cloud Kitchen Facility in Colombo 03
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                Our 4,500 sq.ft centralized culinary facility features food-grade stainless steel prep stations,
                HACCP hygiene protocols, and an insulated temperature-monitored delivery fleet ensuring your food
                arrives steaming hot and pristine.
              </Typography>

              <Stack spacing={2}>
                {[
                  { title: 'Temperature Insulated Fleet', desc: 'Meals kept above 65°C during transit across Colombo 1-15.' },
                  { title: 'PayHere & Card Payments', desc: 'Safe local payment processing via Visa, MasterCard, and PayHere.' },
                  { title: 'Real-Time Order Tracking', desc: 'Live kitchen status updates and delivery rider tracking.' },
                ].map((feat, i) => (
                  <Stack direction="row" spacing={2} key={i}>
                    <VerifiedUserIcon sx={{ color: '#16A34A', mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {feat.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {feat.desc}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            {/* Client Reviews Carousel / Cards */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Verified Customer Testimonials
              </Typography>
              <Stack spacing={2}>
                {reviews.map((rev) => (
                  <Card
                    key={rev.id}
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                      <Avatar src={rev.reviewerAvatar} alt={rev.reviewerName} sx={{ width: 44, height: 44 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {rev.reviewerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {rev.eventType} • {rev.dishName}
                        </Typography>
                      </Box>
                      <Rating value={rev.rating} size="small" readOnly />
                    </Stack>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                      "{rev.reviewQuote}"
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Bottom CTA Banner */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(234, 88, 12, 0.3)',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Planning a Corporate Lunch or Special Event?
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4, opacity: 0.95 }}>
            Speak directly with our Executive Catering Coordinator for custom Sri Lankan menus,
            live cooking station setups, and corporate invoicing.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneInTalkIcon />}
              href="tel:+94112345678"
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#EA580C',
                '&:hover': { backgroundColor: '#F8FAFC' },
                borderRadius: '16px',
                fontWeight: 800,
                px: 3.5,
              }}
            >
              Call Hotline: +94 11 234 5678
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<WhatsAppIcon />}
              href="https://wa.me/94778901234"
              target="_blank"
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' },
                borderRadius: '16px',
                fontWeight: 700,
                px: 3.5,
              }}
            >
              Chat on WhatsApp
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

