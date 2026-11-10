import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../../context/AppContext';

export const MenuPage = () => {
  const { menuItems, categories, addToCart, setCurrentScreen } = useApp();
  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'Halal', 'Vegetarian', 'Vegan', 'Spicy'

  // Modal Item Detail State
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet =
      dietaryFilter === 'All' ||
      (item.dietary && item.dietary.some((d) => d.toLowerCase().includes(dietaryFilter.toLowerCase())));
    return matchesCat && matchesSearch && matchesDiet && item.available;
  });

  const handleOpenItem = (item) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setSpecialNote('');
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart(selectedItem, itemQuantity, specialNote);
      setSelectedItem(null);
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Page Title Banner */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #F8FAFC 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2}>
            <Box>
              <Chip
                label="COLOMBO ONLINE FOOD ORDERING"
                size="small"
                sx={{ bgcolor: 'rgba(249, 115, 22, 0.1)', color: '#EA580C', fontWeight: 800, mb: 1 }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Our Catering & A La Carte Menu
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Freshly prepared party trays, Ceylon rice feasts, short eats, curries, and traditional desserts.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<ShoppingBagIcon />}
              onClick={() => setCurrentScreen('cart')}
              sx={{
                backgroundColor: '#16A34A',
                '&:hover': { backgroundColor: '#15803D' },
                borderRadius: '14px',
                px: 3,
                fontWeight: 700,
              }}
            >
              View Cart & Checkout
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Filter and Search Bar */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search dishes, biryani, lamprais, short eats, watalappan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '14px', bgcolor: theme.palette.background.paper },
              }}
            />
          </Grid>

          {/* Dietary Quick Filter Pills */}
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
              {['All', 'Halal', 'Vegetarian', 'Vegan', 'Spicy'].map((d) => (
                <Chip
                  key={d}
                  label={d}
                  clickable
                  onClick={() => setDietaryFilter(d)}
                  variant={dietaryFilter === d ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 700,
                    borderRadius: '10px',
                    borderColor: dietaryFilter === d ? '#F97316' : theme.palette.divider,
                    bgcolor: dietaryFilter === d ? '#F97316' : 'transparent',
                    color: dietaryFilter === d ? '#FFF' : theme.palette.text.primary,
                  }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Category Horizontal Scroll Pills */}
        <Box sx={{ display: 'flex', gap: 1.2, overflowX: 'auto', pb: 2, mb: 4 }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  px: 1.5,
                  py: 2.2,
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundColor: isSelected ? '#16A34A' : theme.palette.background.paper,
                  color: isSelected ? '#FFFFFF' : theme.palette.text.primary,
                  border: `1px solid ${isSelected ? '#16A34A' : theme.palette.divider}`,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: isSelected ? '#15803D' : 'rgba(0,0,0,0.04)',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
              No dishes found matching your criteria.
            </Typography>
            <Button variant="text" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setDietaryFilter('All'); }}>
              Reset Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleOpenItem(item)}>
                    <CardMedia
                      component="img"
                      height="170"
                      image={item.image || item.imageUrl}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    {item.pax && (
                      <Chip
                        label={item.pax}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: '#FFF',
                          backdropFilter: 'blur(4px)',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                        }}
                      />
                    )}
                    {item.dietary && item.dietary.length > 0 && (
                      <Chip
                        label={item.dietary[0]}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 10,
                          left: 10,
                          bgcolor: 'rgba(22, 163, 74, 0.9)',
                          color: '#FFF',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ p: 2.2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.98rem',
                        lineHeight: 1.3,
                        mb: 0.8,
                        cursor: 'pointer',
                        '&:hover': { color: '#F97316' },
                      }}
                      onClick={() => handleOpenItem(item)}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                        flex: 1,
                      }}
                    >
                      {item.description}
                    </Typography>

                    <Divider sx={{ my: 1.2 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                          Price (LKR)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#EA580C', fontSize: '1.05rem' }}>
                          Rs. {item.price.toLocaleString()}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => addToCart(item, 1)}
                        sx={{
                          backgroundColor: '#F97316',
                          '&:hover': { backgroundColor: '#EA580C' },
                          borderRadius: '12px',
                          px: 2,
                          py: 0.8,
                          fontWeight: 700,
                        }}
                      >
                        + Add
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Item Detail & Portion Customization Dialog */}
      <Dialog
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
      >
        {selectedItem && (
          <>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="240"
                image={selectedItem.image || selectedItem.imageUrl}
                alt={selectedItem.name}
                sx={{ objectFit: 'cover' }}
              />
              <IconButton
                onClick={() => setSelectedItem(null)}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: '#FFF',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: 3.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {selectedItem.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>
                    {selectedItem.pax || 'Standard Portion'} • {selectedItem.category}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#EA580C' }}>
                  Rs. {selectedItem.price.toLocaleString()}
                </Typography>
              </Stack>

              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3, lineHeight: 1.6 }}>
                {selectedItem.description}
              </Typography>

              {/* Portion Quantity Selector */}
              <Box sx={{ p: 2, borderRadius: '16px', bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC', mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Select Order Quantity
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Portions or Trays
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <IconButton
                      size="small"
                      disabled={itemQuantity <= 1}
                      onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                      sx={{ border: `1px solid ${theme.palette.divider}` }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 800, minWidth: 28, textAlign: 'center' }}>
                      {itemQuantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setItemQuantity((q) => q + 1)}
                      sx={{ border: `1px solid ${theme.palette.divider}` }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>

              {/* Special Instructions Note */}
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Kitchen Special Notes (Optional)"
                placeholder="E.g., Less spicy, no coriander, extra gravy or cutlery packs needed..."
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Total Calculation */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Item Subtotal ({itemQuantity} portions):
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#EA580C' }}>
                  Rs. {(selectedItem.price * itemQuantity).toLocaleString()}
                </Typography>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={() => setSelectedItem(null)} sx={{ color: theme.palette.text.secondary }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddToCart}
                startIcon={<ShoppingBagIcon />}
                sx={{
                  backgroundColor: '#F97316',
                  '&:hover': { backgroundColor: '#EA580C' },
                  borderRadius: '14px',
                  px: 4,
                  fontWeight: 700,
                }}
              >
                Add to Cart • Rs. {(selectedItem.price * itemQuantity).toLocaleString()}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

