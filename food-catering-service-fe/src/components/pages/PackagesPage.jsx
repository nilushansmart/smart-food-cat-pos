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
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CalculateIcon from '@mui/icons-material/Calculate';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useApp } from '../../context/AppContext';

export const PackagesPage = () => {
  const { menuItems, addToCart, setCurrentScreen } = useApp();
  const theme = useTheme();

  // Package booking dialog state
  const [activePackage, setActivePackage] = useState(null);
  const [selectedPax, setSelectedPax] = useState(20);

  // Filter packages from menuItems
  const packagesList = [
    {
      id: 'pkg-boardroom',
      title: 'Boardroom Executive Lunch Package',
      subtitle: 'Premium corporate executive lunches for board meetings & VIP clients',
      pricePerPax: 1850,
      minPax: 8,
      defaultPax: 15,
      maxPax: 100,
      targetAudience: 'Corporate Customers',
      tagColor: '#3B82F6',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Aromatic basmati ghee rice infused with whole Ceylon spices',
        'Choice of Slow-roasted Ceylon Butter Chicken OR Grilled Seer Fish',
        'Buttered seasonal vegetable medley & tempered dhal curry',
        'Crispy Ceylon spiced mutton or fish cutlet',
        'Individual royal cardamom watalappan or silky caramel pudding cup',
        'Chilled Ceylon iced peach tea in dispenser or individual bottles',
        'Complete executive biodegradable cutlery, napkins & wet wipes',
      ],
    },
    {
      id: 'pkg-wedding',
      title: 'Royal Ceylon Wedding Banquet Package',
      subtitle: 'Opulent multi-course Sri Lankan & international spread for grand receptions',
      pricePerPax: 3850,
      minPax: 50,
      defaultPax: 150,
      maxPax: 800,
      targetAudience: 'Event Organizers & Weddings',
      tagColor: '#9333EA',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Welcome fresh king coconut (thambili) mint refresher on arrival',
        'Aged Basmati Chicken Dum Biryani & fragrant yellow ghee rice',
        'Negombo fiery chili garlic prawns & Jaffna style mutton curry',
        'Creamy cashew nut and green pea curry & young jackfruit (polos) curry',
        'Eggplant moju, pineapple Malay pickle, gotukola sambol & papadam',
        'Dessert Grand Table: Cardamom watalappan, caramel pudding, fruit tarts',
        'Optional live hopper / kottu station chefs on request',
      ],
    },
    {
      id: 'pkg-birthday',
      title: 'Celebration & Birthday Party Feast',
      subtitle: 'Lively, delicious party platters for birthdays, anniversaries & home gatherings',
      pricePerPax: 2200,
      minPax: 15,
      defaultPax: 30,
      maxPax: 150,
      targetAudience: 'Individuals & Families',
      tagColor: '#EA580C',
      image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Cocktail short eats platter: Mutton cutlets, chicken rolls & samosas',
        'Wok-tossed Sri Lankan chicken fried rice with chilli paste',
        'Crispy hot butter cuttlefish tray & devilled chicken bites',
        'Tempered spicy potato wedges and coleslaw salad',
        'Party dessert tray: Silky caramel pudding cups & double fudge brownies',
        'Party beverage dispenser (5L fruit punch or lime soda)',
      ],
    },
    {
      id: 'pkg-subscription',
      title: 'Weekly Corporate Meal Subscription (5 Days)',
      subtitle: 'Nutritious rotational chef lunches delivered hot to your office Mon–Fri',
      pricePerPax: 6250, // Rs. 1,250/day * 5 days
      minPax: 5,
      defaultPax: 10,
      maxPax: 200,
      targetAudience: 'Regular Corporate Subscribers',
      tagColor: '#16A34A',
      image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&auto=format&fit=crop&q=80',
      highlights: [
        '5 days of rotational chef menus across Monday to Friday',
        'Mon: Authentic banana leaf wrapped Ceylon Lamprais',
        'Tue: Ghee rice, devilled chicken, egg & tempered dhal',
        'Wed: Wok-fried seafood nasi goreng & satay skewers',
        'Thu: Village yellow rice & Negombo fish ambul thiyal',
        'Fri: Grand chicken dum biryani & mint raita',
        'Free doorstep delivery before 12:30 PM daily in Colombo 1-15',
      ],
    },
  ];

  const handleOpenBooking = (pkg) => {
    setActivePackage(pkg);
    setSelectedPax(pkg.defaultPax);
  };

  const handleConfirmAdd = () => {
    if (activePackage) {
      const packageCartItem = {
        id: activePackage.id,
        name: activePackage.title,
        category: 'Catering Packages',
        price: activePackage.pricePerPax,
        quantity: selectedPax,
        image: activePackage.image,
        specialNote: `Catering Package for ${selectedPax} Guests (${activePackage.targetAudience})`,
      };
      addToCart(packageCartItem, selectedPax, packageCartItem.specialNote);
      setActivePackage(null);
      setCurrentScreen('cart');
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Banner */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #F0FDF4 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="SRI LANKAN CATERING PACKAGES"
            size="small"
            sx={{ fontWeight: 800, mb: 1.5, bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Curated Packages for Any Event
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            All-inclusive transparent pricing in Sri Lankan Rupees (LKR) with portion scaling,
            HACCP kitchen preparation, and full insulated delivery.
          </Typography>
        </Container>
      </Box>

      {/* Packages List */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {packagesList.map((pkg) => (
            <Grid item xs={12} md={6} key={pkg.id}>
              <Card
                sx={{
                  borderRadius: '24px',
                  border: `1.5px solid ${theme.palette.divider}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'all 0.25s',
                  '&:hover': {
                    borderColor: '#F97316',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={pkg.image}
                    alt={pkg.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label={pkg.targetAudience}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      bgcolor: pkg.tagColor,
                      color: '#FFF',
                      fontWeight: 800,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 14,
                      bgcolor: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFF',
                      px: 2,
                      py: 0.8,
                      borderRadius: '12px',
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                      Min. {pkg.minPax} Pax
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#FDBA74' }}>
                      Rs. {pkg.pricePerPax.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#FFF' }}>/ pax</span>
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    {pkg.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2.5 }}>
                    {pkg.subtitle}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.06em', color: theme.palette.text.secondary, mb: 1, display: 'block' }}>
                    INCLUDED IN THIS PACKAGE:
                  </Typography>

                  <List dense sx={{ mb: 3, flex: 1 }}>
                    {pkg.highlights.map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.4 }}>
                        <ListItemIcon sx={{ minWidth: 28, color: '#16A34A' }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{ variant: 'body2', color: theme.palette.text.primary, fontSize: '0.85rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleOpenBooking(pkg)}
                      startIcon={<ShoppingBagIcon />}
                      sx={{
                        backgroundColor: '#F97316',
                        '&:hover': { backgroundColor: '#EA580C' },
                        py: 1.3,
                        borderRadius: '14px',
                        fontWeight: 700,
                      }}
                    >
                      Book & Customize Pax
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentScreen('custom-order')}
                      sx={{
                        borderColor: theme.palette.divider,
                        borderRadius: '14px',
                        px: 2,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Build Custom
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Package Pax Customizer Dialog */}
      <Dialog
        open={Boolean(activePackage)}
        onClose={() => setActivePackage(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        {activePackage && (
          <>
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
              Configure {activePackage.title}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                Adjust the number of guests/meals for this booking. Price updates in real time.
              </Typography>

              <Box sx={{ p: 3, borderRadius: '18px', bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#FFF7ED', mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Number of Guests:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#EA580C' }}>
                    {selectedPax} Pax
                  </Typography>
                </Stack>
                <Slider
                  value={selectedPax}
                  min={activePackage.minPax}
                  max={activePackage.maxPax}
                  step={5}
                  onChange={(_, val) => setSelectedPax(val)}
                  sx={{ color: '#F97316' }}
                />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Min: {activePackage.minPax}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Max: {activePackage.maxPax}+
                  </Typography>
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Rate Per Person:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {activePackage.pricePerPax.toLocaleString()}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Standard Kitchen Prep Time:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>30-60 Mins</Typography>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Package Cost:</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#16A34A' }}>
                  Rs. {(activePackage.pricePerPax * selectedPax).toLocaleString()}
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button onClick={() => setActivePackage(null)} sx={{ color: theme.palette.text.secondary }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmAdd}
                sx={{
                  backgroundColor: '#16A34A',
                  '&:hover': { backgroundColor: '#15803D' },
                  borderRadius: '14px',
                  px: 3.5,
                  fontWeight: 700,
                }}
              >
                Add {selectedPax} Pax to Cart
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
