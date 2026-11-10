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
  Stack,
  Slider,
  Divider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  useTheme,
  Alert,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useApp } from '../../context/AppContext';

export const CustomOrderPage = () => {
  const { addToCart, setCurrentScreen } = useApp();
  const theme = useTheme();

  // Step 1: Pax
  const [pax, setPax] = useState(25);

  // Step 2: Base Selection
  const [selectedBases, setSelectedBases] = useState(['Aged Basmati Biryani Rice']);
  // Step 3: Main Meat / Seafood Selection
  const [selectedMains, setSelectedMains] = useState(['Ceylon Slow-Roast Butter Chicken']);
  // Step 4: Vegetables & Dhal
  const [selectedVeg, setSelectedVeg] = useState(['Creamy Cashew Nut & Green Pea Curry', 'Tempered Yellow Dhal']);
  // Step 5: Accompaniments
  const [selectedSides, setSelectedSides] = useState(['Sweet & Tangy Eggplant Moju', 'Crispy Papadam & Fried Chillies']);
  // Step 6: Desserts
  const [selectedDessert, setSelectedDessert] = useState('Royal Cardamom Watalappan Pot');
  // Step 7: Beverage
  const [selectedBeverage, setSelectedBeverage] = useState('Fresh King Coconut & Mint Refresher (Urn)');

  // Base Options (with add-on rate in LKR)
  const baseOptions = [
    { name: 'Aged Basmati Biryani Rice', extra: 0 },
    { name: 'Fragrant Ceylon Ghee Rice', extra: 0 },
    { name: 'Sri Lankan Red Kakulu Village Rice', extra: 0 },
    { name: 'Chinese Wok-Fried Chicken & Egg Rice', extra: 150 },
    { name: 'Traditional Roast Paan & Katta Sambol', extra: 0 },
  ];

  // Main Options
  const mainOptions = [
    { name: 'Ceylon Slow-Roast Butter Chicken', extra: 450 },
    { name: 'Jaffna Spiced Mutton Curry', extra: 850 },
    { name: 'Negombo Fiery Chili Lagoon Prawns', extra: 750 },
    { name: 'Southern Fish Ambul Thiyal', extra: 500 },
    { name: 'Crispy Hot Butter Cuttlefish', extra: 650 },
    { name: 'Devilled Chicken Supreme', extra: 400 },
  ];

  // Veg Options
  const vegOptions = [
    { name: 'Creamy Cashew Nut & Green Pea Curry', extra: 350 },
    { name: 'Traditional Polos (Young Jackfruit) Curry', extra: 250 },
    { name: 'Tempered Yellow Dhal with Garlic', extra: 150 },
    { name: 'Creamy Potato White Curry', extra: 150 },
    { name: 'Wok-Tossed Seasonal Greens (Kang Kung)', extra: 150 },
  ];

  // Sides Options
  const sideOptions = [
    { name: 'Sweet & Tangy Eggplant Moju', extra: 120 },
    { name: 'Crispy Papadam & Fried Chillies', extra: 80 },
    { name: 'Pineapple Malay Pickle', extra: 120 },
    { name: 'Fresh Gotukola Sambol', extra: 100 },
    { name: 'Mint Cucumber Raita', extra: 80 },
  ];

  // Dessert Options
  const dessertOptions = [
    { name: 'Royal Cardamom Watalappan Pot', extra: 350 },
    { name: 'Silky Ceylon Caramel Pudding Cups', extra: 280 },
    { name: 'Double Chocolate Fudge Brownies', extra: 300 },
    { name: 'Curd & Kithul Treacle Pots', extra: 250 },
  ];

  // Beverage Options
  const beverageOptions = [
    { name: 'Fresh King Coconut & Mint Refresher (Urn)', extra: 220 },
    { name: 'Artisan Ceylon Spiced Milk Tea Dispenser', extra: 200 },
    { name: 'Tropical Mango Passionfruit Punch', extra: 180 },
    { name: 'Chilled Rose Falooda Jars', extra: 250 },
  ];

  // Base price calculation per pax in LKR
  const baseRate = 850; // Starting base fee for rice, culinary crew & packaging
  const mainsExtra = selectedMains.reduce((sum, m) => {
    const item = mainOptions.find((x) => x.name === m);
    return sum + (item ? item.extra : 0);
  }, 0);
  const vegExtra = selectedVeg.reduce((sum, v) => {
    const item = vegOptions.find((x) => x.name === v);
    return sum + (item ? item.extra : 0);
  }, 0);
  const sidesExtra = selectedSides.reduce((sum, s) => {
    const item = sideOptions.find((x) => x.name === s);
    return sum + (item ? item.extra : 0);
  }, 0);

  const dessertExtra = dessertOptions.find((d) => d.name === selectedDessert)?.extra || 0;
  const beverageExtra = beverageOptions.find((b) => b.name === selectedBeverage)?.extra || 0;

  const pricePerPax = baseRate + mainsExtra + vegExtra + sidesExtra + dessertExtra + beverageExtra;
  const grandTotal = pricePerPax * pax;

  const toggleSelection = (list, setList, item, maxAllowed = 3) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((x) => x !== item));
      }
    } else {
      if (list.length < maxAllowed) {
        setList([...list, item]);
      }
    }
  };

  const handleAddCustomToCart = () => {
    const customItem = {
      id: `custom-pkg-${Date.now()}`,
      name: `Custom Sri Lankan Catering Feast (${pax} Pax)`,
      category: 'Catering Packages',
      price: pricePerPax,
      quantity: pax,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      pax: `${pax} Guests`,
      specialNote: `Bases: ${selectedBases.join(', ')} | Mains: ${selectedMains.join(', ')} | Veg: ${selectedVeg.join(', ')} | Sides: ${selectedSides.join(', ')} | Dessert: ${selectedDessert} | Drink: ${selectedBeverage}`,
    };

    addToCart(customItem, pax, customItem.specialNote);
    setCurrentScreen('cart');
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Title */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="INTERACTIVE CATERING BUILDER"
            size="small"
            sx={{ fontWeight: 800, mb: 1.5, bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Customize Your Dream Catering Menu
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Build your personalized buffet or tray spread. Select your favorite Sri Lankan bases,
            curries, short eats, desserts, and drinks with instant real-time pricing.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Builder Steps Left */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {/* Step 1: Guest Count */}
              <Card sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#F97316', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    1
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Number of Guests / Portions
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  Adjust the slider for your gathering (Min 10 guests for custom catering packages):
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={pax}
                    min={10}
                    max={250}
                    step={5}
                    onChange={(_, val) => setPax(val)}
                    sx={{ color: '#F97316' }}
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>10 Pax</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#EA580C' }}>{pax} Guests</Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>250+ Pax</Typography>
                  </Stack>
                </Box>
              </Card>

              {/* Step 2: Bases */}
              <Card sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#F97316', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    2
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Choose Base Rice or Bread (Select 1-2)
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
                  Selected: {selectedBases.join(', ')}
                </Typography>

                <Grid container spacing={1.5}>
                  {baseOptions.map((opt) => {
                    const isSelected = selectedBases.includes(opt.name);
                    return (
                      <Grid item xs={12} sm={6} key={opt.name}>
                        <Button
                          fullWidth
                          onClick={() => toggleSelection(selectedBases, setSelectedBases, opt.name, 2)}
                          sx={{
                            justifyContent: 'space-between',
                            p: 1.6,
                            borderRadius: '14px',
                            border: `1.5px solid ${isSelected ? '#F97316' : theme.palette.divider}`,
                            bgcolor: isSelected ? 'rgba(249,115,22,0.06)' : 'transparent',
                            color: theme.palette.text.primary,
                            textAlign: 'left',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: isSelected ? 800 : 500 }}>
                            {opt.name}
                          </Typography>
                          {opt.extra > 0 && (
                            <Chip label={`+Rs.${opt.extra}`} size="small" sx={{ fontSize: '0.7rem' }} />
                          )}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>

              {/* Step 3: Main Meats & Seafood */}
              <Card sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#F97316', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    3
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Main Meat & Seafood Dishes (Select 1-2)
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
                  Selected: {selectedMains.join(', ')}
                </Typography>

                <Grid container spacing={1.5}>
                  {mainOptions.map((opt) => {
                    const isSelected = selectedMains.includes(opt.name);
                    return (
                      <Grid item xs={12} sm={6} key={opt.name}>
                        <Button
                          fullWidth
                          onClick={() => toggleSelection(selectedMains, setSelectedMains, opt.name, 2)}
                          sx={{
                            justifyContent: 'space-between',
                            p: 1.6,
                            borderRadius: '14px',
                            border: `1.5px solid ${isSelected ? '#F97316' : theme.palette.divider}`,
                            bgcolor: isSelected ? 'rgba(249,115,22,0.06)' : 'transparent',
                            color: theme.palette.text.primary,
                            textAlign: 'left',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: isSelected ? 800 : 500 }}>
                            {opt.name}
                          </Typography>
                          <Chip label={`+Rs.${opt.extra}`} size="small" sx={{ fontSize: '0.7rem', bgcolor: '#F9731615', color: '#EA580C', fontWeight: 700 }} />
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>

              {/* Step 4: Vegetables & Dhal */}
              <Card sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#16A34A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    4
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Vegetable & Dhal Curries (Select 2)
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
                  Selected: {selectedVeg.join(', ')}
                </Typography>

                <Grid container spacing={1.5}>
                  {vegOptions.map((opt) => {
                    const isSelected = selectedVeg.includes(opt.name);
                    return (
                      <Grid item xs={12} sm={6} key={opt.name}>
                        <Button
                          fullWidth
                          onClick={() => toggleSelection(selectedVeg, setSelectedVeg, opt.name, 2)}
                          sx={{
                            justifyContent: 'space-between',
                            p: 1.6,
                            borderRadius: '14px',
                            border: `1.5px solid ${isSelected ? '#16A34A' : theme.palette.divider}`,
                            bgcolor: isSelected ? 'rgba(22,163,74,0.06)' : 'transparent',
                            color: theme.palette.text.primary,
                            textAlign: 'left',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: isSelected ? 800 : 500 }}>
                            {opt.name}
                          </Typography>
                          <Chip label={`+Rs.${opt.extra}`} size="small" sx={{ fontSize: '0.7rem' }} />
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>

              {/* Step 5: Accompaniments & Sides */}
              <Card sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#EAB308', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    5
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Sri Lankan Accompaniments (Select 2)
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
                  Selected: {selectedSides.join(', ')}
                </Typography>

                <Grid container spacing={1.5}>
                  {sideOptions.map((opt) => {
                    const isSelected = selectedSides.includes(opt.name);
                    return (
                      <Grid item xs={12} sm={6} key={opt.name}>
                        <Button
                          fullWidth
                          onClick={() => toggleSelection(selectedSides, setSelectedSides, opt.name, 2)}
                          sx={{
                            justifyContent: 'space-between',
                            p: 1.6,
                            borderRadius: '14px',
                            border: `1.5px solid ${isSelected ? '#EAB308' : theme.palette.divider}`,
                            bgcolor: isSelected ? 'rgba(234,179,8,0.06)' : 'transparent',
                            color: theme.palette.text.primary,
                            textAlign: 'left',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: isSelected ? 800 : 500 }}>
                            {opt.name}
                          </Typography>
                          <Chip label={`+Rs.${opt.extra}`} size="small" sx={{ fontSize: '0.7rem' }} />
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>

              {/* Step 6 & 7: Dessert & Beverage */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                      6. Traditional Dessert (Choose 1)
                    </Typography>
                    <Stack spacing={1}>
                      {dessertOptions.map((d) => (
                        <Button
                          key={d.name}
                          fullWidth
                          onClick={() => setSelectedDessert(d.name)}
                          sx={{
                            justifyContent: 'space-between',
                            p: 1.2,
                            borderRadius: '12px',
                            border: `1.5px solid ${selectedDessert === d.name ? '#F97316' : theme.palette.divider}`,
                            bgcolor: selectedDessert === d.name ? 'rgba(249,115,22,0.08)' : 'transparent',
                            color: theme.palette.text.primary,
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{d.name}</Typography>
                          <Chip label={`+Rs.${d.extra}`} size="small" sx={{ fontSize: '0.68rem' }} />
                        </Button>
                      ))}
                    </Stack>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                      7. Party Beverage (Choose 1)
                    </Typography>
                    <Stack spacing={1}>
                      {beverageOptions.map((b) => (
                        <Button
                          key={b.name}
                          fullWidth
                          onClick={() => setSelectedBeverage(b.name)}
                          sx={{
                            justifyContent: 'space-between',
                            p: 1.2,
                            borderRadius: '12px',
                            border: `1.5px solid ${selectedBeverage === b.name ? '#3B82F6' : theme.palette.divider}`,
                            bgcolor: selectedBeverage === b.name ? 'rgba(59,130,246,0.08)' : 'transparent',
                            color: theme.palette.text.primary,
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{b.name}</Typography>
                          <Chip label={`+Rs.${b.extra}`} size="small" sx={{ fontSize: '0.68rem' }} />
                        </Button>
                      ))}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* Sticky Live Price Summary Right */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3.5,
                borderRadius: '24px',
                border: `1px solid ${theme.palette.divider}`,
                position: 'sticky',
                top: 90,
                boxShadow: '0 16px 32px rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Custom Package Summary
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2.5, display: 'block' }}>
                Instant live calculation based on selected dishes & guest count:
              </Typography>

              <Box sx={{ p: 2, borderRadius: '14px', bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#FFF7ED', mb: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Guest Count:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#EA580C' }}>{pax} Pax</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Rate Per Person:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Rs. {pricePerPax.toLocaleString()} / pax</Typography>
                </Stack>
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, mb: 1, display: 'block' }}>
                CUSTOM MENU SUMMARY:
              </Typography>
              <Box sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, mb: 3 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • <b>Bases:</b> {selectedBases.join(', ')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • <b>Mains:</b> {selectedMains.join(', ')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • <b>Vegetables:</b> {selectedVeg.join(', ')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • <b>Sides:</b> {selectedSides.join(', ')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • <b>Dessert:</b> {selectedDessert}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  • <b>Beverage:</b> {selectedBeverage}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Package Cost:</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#16A34A' }}>
                  Rs. {grandTotal.toLocaleString()}
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShoppingBagIcon />}
                onClick={handleAddCustomToCart}
                sx={{
                  backgroundColor: '#F97316',
                  '&:hover': { backgroundColor: '#EA580C' },
                  py: 1.6,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                }}
              >
                Add Custom Menu to Cart
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

