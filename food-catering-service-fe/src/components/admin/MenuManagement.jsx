import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
  CardContent,
  useTheme,
  Chip,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useApp } from '../../context/AppContext';

export const MenuManagement = () => {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    toggleItemAvailability,
    deleteMenuItem,
    cateringSettings,
  } = useApp();

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dialog state (Add or Edit)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rice',
    price: '',
    description: '',
    image: '',
    prepTimeMinutes: 10,
  });

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleOpenAddDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Rice',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      prepTimeMinutes: 10,
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || '',
      image: item.image || '',
      prepTimeMinutes: item.prepTimeMinutes || 10,
    });
    setDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name.trim() || !formData.price) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        ...formData,
        price: parseFloat(formData.price) || 0,
        prepTimeMinutes: parseInt(formData.prepTimeMinutes, 10) || 10,
      });
    } else {
      addMenuItem({
        ...formData,
        price: parseFloat(formData.price) || 0,
        prepTimeMinutes: parseInt(formData.prepTimeMinutes, 10) || 10,
      });
    }
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Menu & Recipe Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Add, update dishes, modify pricing, toggle live availability in POS.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenAddDialog}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#F97316',
            minHeight: 46,
            px: 2.5,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#EA580C' },
          }}
        >
          Add New Dish
        </Button>
      </Box>

      {/* Filter & Search Bar */}
      <Card sx={{ p: 2, borderRadius: 3.5, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search recipes, ingredients, dish titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: selectedCategory === cat ? '#F97316' : 'transparent',
                    color: selectedCategory === cat ? '#FFFFFF' : theme.palette.text.primary,
                    border: `1px solid ${selectedCategory === cat ? '#F97316' : theme.palette.divider}`,
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Grid of Dishes */}
      <Grid container spacing={2.5}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                opacity: item.available ? 1 : 0.6,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ position: 'relative', height: 140 }}>
                <CardMedia
                  component="img"
                  height="140"
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
                {!item.available && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Chip
                      icon={<VisibilityOffIcon sx={{ color: '#FFFFFF !important' }} />}
                      label="Hidden / Out of Stock"
                      color="error"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                )}
              </Box>

              <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#F97316' }} className="tabular-nums">
                    {cateringSettings?.currency || 'Rs. '}{item.price.toLocaleString()}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.8rem',
                    mb: 2,
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.description}
                </Typography>

                {/* Footer Controls: Toggle availability, Edit, Delete */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Switch
                      size="small"
                      checked={item.available}
                      onChange={() => toggleItemAvailability(item.id)}
                      color="warning"
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {item.available ? 'Active' : 'Hidden'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit item">
                      <IconButton size="small" onClick={() => handleOpenEditDialog(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete dish">
                      <IconButton
                        size="small"
                        onClick={() => deleteMenuItem(item.id)}
                        sx={{ color: '#DC2626' }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add / Edit Dish Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingItem ? 'Edit Dish Details' : 'Add New Dish to Catalog'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Dish Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <MenuItem value="Rice">Rice</MenuItem>
                    <MenuItem value="Snacks">Snacks</MenuItem>
                    <MenuItem value="Desserts">Desserts</MenuItem>
                    <MenuItem value="Beverages">Beverages</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Price ($)"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Prep Time (Minutes)"
                  type="number"
                  fullWidth
                  value={formData.prepTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, prepTimeMinutes: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Image URL"
                  fullWidth
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </Grid>
            </Grid>

            <TextField
              label="Description / Ingredients"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: theme.palette.text.secondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            sx={{ backgroundColor: '#F97316', '&:hover': { backgroundColor: '#EA580C' } }}
          >
            {editingItem ? 'Save Changes' : 'Create Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
