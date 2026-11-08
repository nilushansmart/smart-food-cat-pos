import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Chip,
  InputAdornment,
  useTheme,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import { useApp } from '../../context/AppContext';
import { CartContent, MobileCartDrawer } from './CartDrawer';
import { NumberCounter } from '../common/NumberCounter';

export const POSScreen = () => {
  const { menuItems, categories, addToCart, cart } = useApp();
  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Note dialog state for custom item notes
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [itemForNote, setItemForNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Animated clicked card ID for pulse animation
  const [pulsingCardId, setPulsingCardId] = useState(null);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const handleQuickAdd = (item) => {
    setPulsingCardId(item.id);
    addToCart(item, 1, '');
    setTimeout(() => setPulsingCardId(null), 300);
  };

  const handleOpenNoteDialog = (item) => {
    setItemForNote(item);
    setNoteText('');
    setNoteDialogOpen(true);
  };

  const handleAddWithNote = () => {
    if (itemForNote) {
      addToCart(itemForNote, 1, noteText.trim());
      setNoteDialogOpen(false);
      setItemForNote(null);
      setNoteText('');
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left/Center Area: Menu & Items (Zone 1 & 2) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
          p: { xs: 2, sm: 3 },
          pb: { xs: 12, md: 3 }, // extra padding on mobile for sticky cart bar & bottom nav
        }}
      >
        {/* Header with Search */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Catering Booking & POS Terminal
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Select catering trays, meal packages & party platters to schedule online bookings
              </Typography>
            </Box>
          </Box>

          {/* Search Field */}
          <TextField
            fullWidth
            placeholder="Search delicious dishes, snacks, or drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3.5,
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
            }}
          />
        </Box>

        {/* Pill-shaped Category Chips (Horizontal Scroll) */}
        <Box
          className="no-scrollbar"
          sx={{
            display: 'flex',
            gap: 1.2,
            overflowX: 'auto',
            pb: 1.5,
            mb: 2,
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
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
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  minHeight: 42,
                  backgroundColor: isSelected
                    ? '#F97316'
                    : theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.06)'
                    : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : theme.palette.text.primary,
                  border: isSelected ? 'none' : `1px solid ${theme.palette.divider}`,
                  boxShadow: isSelected ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none',
                  '&:hover': {
                    backgroundColor: isSelected ? '#EA580C' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F5F4',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Food Items Grid */}
        {filteredItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              No dishes found matching "{searchQuery}"
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              sx={{ mt: 1, color: '#F97316' }}
            >
              Clear filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2.5 }}>
            {filteredItems.map((item) => {
              const isPulsing = pulsingCardId === item.id;
              const cartItem = cart.find((c) => c.id === item.id);

              return (
                <Grid item xs={12} sm={6} md={6} lg={4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      border: cartItem
                        ? '2px solid #F97316'
                        : `1px solid ${theme.palette.divider}`,
                      transform: isPulsing ? 'scale(0.97)' : 'scale(1)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    {/* Food Image (rounded food imagery principle) */}
                    <Box sx={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt={item.name}
                        sx={{
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      {/* Category & Pax Pill */}
                      <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 0.5 }}>
                        <Chip
                          size="small"
                          label={item.category}
                          sx={{
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            color: '#FFFFFF',
                            backdropFilter: 'blur(4px)',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        />
                        {item.pax && (
                          <Chip
                            size="small"
                            label={item.pax}
                            sx={{
                              backgroundColor: 'rgba(249, 115, 22, 0.85)',
                              color: '#FFFFFF',
                              backdropFilter: 'blur(4px)',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                            }}
                          />
                        )}
                      </Box>
                      {/* Prep time chip */}
                      {item.prepTimeMinutes && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.92)',
                            color: '#1C1917',
                            borderRadius: 2,
                            px: 0.8,
                            py: 0.2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.4,
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 13, color: '#F97316' }} />
                          {item.prepTimeMinutes}m
                        </Box>
                      )}
                    </Box>

                    {/* Content */}
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

                      {/* Price and Add Buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, color: theme.palette.text.primary }}
                          className="tabular-nums"
                        >
                          ${item.price.toFixed(2)}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 0.8 }}>
                          {/* Add Note Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleOpenNoteDialog(item)}
                            sx={{
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2.5,
                              p: 0.8,
                              color: theme.palette.text.secondary,
                            }}
                            title="Add special instructions note"
                          >
                            <EditNoteIcon fontSize="small" />
                          </IconButton>

                          {/* Quick Add Button */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleQuickAdd(item)}
                            startIcon={<AddIcon />}
                            sx={{
                              minHeight: 40,
                              borderRadius: 2.5,
                              px: 1.8,
                              backgroundColor: '#F97316',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              '&:hover': {
                                backgroundColor: '#EA580C',
                              },
                            }}
                          >
                            Add
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Right Side: Persistent Cart Panel on Tablet/Desktop (Zone 3) */}
      <Box
        sx={{
          width: { md: 360, lg: 390 },
          display: { xs: 'none', md: 'block' },
          borderLeft: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          height: '100%',
        }}
      >
        <CartContent />
      </Box>

      {/* Mobile Sticky Cart Bar (Shown on small screens when cart has items) */}
      {cart.length > 0 && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            bottom: 70, // right above bottom nav
            left: 16,
            right: 16,
            zIndex: 1050,
          }}
        >
          <Box
            onClick={() => setMobileCartOpen(true)}
            sx={{
              backgroundColor: '#1C1917',
              color: '#FFFFFF',
              borderRadius: 4,
              p: 1.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              '&:active': { transform: 'scale(0.98)' },
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
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {totalCartCount}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  View Cart
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  <NumberCounter value={totalCartPrice * 1.05} prefix="$" />
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#F97316',
                borderRadius: 2.5,
                fontWeight: 700,
                '&:hover': { backgroundColor: '#EA580C' },
              }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      )}

      {/* Mobile Bottom Sheet Cart Drawer */}
      <MobileCartDrawer open={mobileCartOpen} onClose={() => setMobileCartOpen(false)} />

      {/* Item Note Modal Dialog */}
      <Dialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Special Instructions
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1.5 }}>
            Adding note for <strong>{itemForNote?.name}</strong>:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. Extra spicy, no onions, sauce on the side..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setNoteDialogOpen(false)} sx={{ color: theme.palette.text.secondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddWithNote}
            sx={{ backgroundColor: '#F97316', '&:hover': { backgroundColor: '#EA580C' } }}
          >
            Add to Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
