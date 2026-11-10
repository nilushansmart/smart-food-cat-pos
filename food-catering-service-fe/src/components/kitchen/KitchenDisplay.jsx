import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  useTheme,
  Stack,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CalculateIcon from '@mui/icons-material/Calculate';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/audio';

// Elapsed timer helper component
const ElapsedTimer = ({ createdAt }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(() => {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeFormatted = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  let color = '#16A34A';
  let bg = 'rgba(22, 163, 74, 0.12)';
  let label = timeFormatted;

  if (minutes >= 20) {
    color = '#DC2626';
    bg = 'rgba(220, 38, 38, 0.2)';
    label = `${timeFormatted} 🚨 URGENT`;
  } else if (minutes >= 10) {
    color = '#D97706';
    bg = 'rgba(217, 119, 6, 0.18)';
    label = `${timeFormatted} ⚠️ DELAY`;
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        backgroundColor: bg,
        color: color,
        px: 1.2,
        py: 0.4,
        borderRadius: 2,
        fontWeight: 700,
        fontSize: '0.8rem',
      }}
    >
      <AccessTimeIcon sx={{ fontSize: 14 }} />
      <span>{label}</span>
    </Box>
  );
};

export const KitchenDisplay = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    toggleItemAvailability,
    ingredients,
    updateIngredientStock,
  } = useApp();
  const theme = useTheme();

  // Tab State: 0 = Live KDS, 1 = Batch Prep Calculator, 2 = Ingredients & Stock, 3 = Daily Menus
  const [activeTab, setActiveTab] = useState(0);

  const handleTestChime = () => {
    sound.playKitchenChime();
  };

  const newOrders = orders.filter((o) => o.status === 'Pending');
  const cookingOrders = orders.filter((o) => o.status === 'Cooking' || o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');

  // Compute batch total quantities for today's orders
  const batchPrepSummary = {};
  orders
    .filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .forEach((ord) => {
      (ord.items || []).forEach((item) => {
        if (!batchPrepSummary[item.name]) {
          batchPrepSummary[item.name] = {
            name: item.name,
            totalQuantity: 0,
            specialNotes: [],
            orderIds: [],
          };
        }
        batchPrepSummary[item.name].totalQuantity += item.quantity || 1;
        batchPrepSummary[item.name].orderIds.push(ord.id);
        if (item.specialNote) {
          batchPrepSummary[item.name].specialNotes.push(item.specialNote);
        }
      });
    });

  const batchPrepList = Object.values(batchPrepSummary);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: theme.palette.mode === 'dark' ? '#0F0F10' : '#F4F7FC', minHeight: '100%' }}>
      {/* Top Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Kitchen Management Suite
            </Typography>
            <Chip
              label="Colombo Cloud Kitchen"
              size="small"
              sx={{ bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C', fontWeight: 800 }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Real-time incoming orders, batch cooking calculator, ingredient inventory, and daily menu availability.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            startIcon={<VolumeUpIcon />}
            onClick={handleTestChime}
            sx={{ borderRadius: '12px', borderColor: theme.palette.divider }}
          >
            Test Chime
          </Button>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Card sx={{ borderRadius: '18px', mb: 3.5, border: `1px solid ${theme.palette.divider}` }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            px: 2,
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minHeight: 52 },
            '& .Mui-selected': { color: '#F97316' },
            '& .MuiTabs-indicator': { backgroundColor: '#F97316' },
          }}
        >
          <Tab
            label={`Live KDS Tickets (${newOrders.length + cookingOrders.length})`}
            icon={<SoupKitchenIcon fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            label={`Batch Prep Calculator (${batchPrepList.length} Dishes)`}
            icon={<CalculateIcon fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            label={`Ingredients & Stock (${ingredients.length})`}
            icon={<Inventory2Icon fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            label="Manage Daily Menus"
            icon={<RestaurantMenuIcon fontSize="small" />}
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* TAB 0: LIVE KDS ORDER BOARD */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Column 1: New Incoming Orders (Pending) */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                border: '2px solid #EAB308',
                bgcolor: theme.palette.background.paper,
                minHeight: '65vh',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#CA8A04' }}>
                  ⏳ Incoming Tickets ({newOrders.length})
                </Typography>
                <Chip label="Awaiting Prep" size="small" sx={{ bgcolor: 'rgba(234,179,8,0.1)', color: '#CA8A04', fontWeight: 700 }} />
              </Stack>

              <Stack spacing={2}>
                {newOrders.map((ord) => (
                  <Card
                    key={ord.id}
                    sx={{
                      p: 2.2,
                      borderRadius: '16px',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {ord.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {ord.customerName} • {ord.guestCount || 'Catering'}
                        </Typography>
                      </Box>
                      <ElapsedTimer createdAt={ord.createdAt} />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Stack spacing={0.8} sx={{ mb: 2 }}>
                      {ord.items?.map((item, idx) => (
                        <Box key={idx}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {item.quantity}x {item.name}
                            </Typography>
                          </Stack>
                          {item.specialNote && (
                            <Typography variant="caption" sx={{ color: '#EA580C', fontWeight: 600, display: 'block' }}>
                              ⚠️ Note: {item.specialNote}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => updateOrderStatus(ord.id, 'Cooking')}
                      sx={{
                        backgroundColor: '#2563EB',
                        '&:hover': { backgroundColor: '#1D4ED8' },
                        borderRadius: '12px',
                        fontWeight: 700,
                      }}
                    >
                      Start Cooking
                    </Button>
                  </Card>
                ))}
                {newOrders.length === 0 && (
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center', py: 4 }}>
                    No pending incoming tickets.
                  </Typography>
                )}
              </Stack>
            </Card>
          </Grid>

          {/* Column 2: Currently Cooking */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                border: '2px solid #2563EB',
                bgcolor: theme.palette.background.paper,
                minHeight: '65vh',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB' }}>
                  🔥 In Prep & Wok ({cookingOrders.length})
                </Typography>
                <Chip label="Cooking Now" size="small" sx={{ bgcolor: 'rgba(37,99,235,0.1)', color: '#2563EB', fontWeight: 700 }} />
              </Stack>

              <Stack spacing={2}>
                {cookingOrders.map((ord) => (
                  <Card
                    key={ord.id}
                    sx={{
                      p: 2.2,
                      borderRadius: '16px',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {ord.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {ord.customerName} • {ord.deliveryZone || 'Colombo'}
                        </Typography>
                      </Box>
                      <ElapsedTimer createdAt={ord.createdAt} />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Stack spacing={0.8} sx={{ mb: 2 }}>
                      {ord.items?.map((item, idx) => (
                        <Box key={idx}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {item.quantity}x {item.name}
                            </Typography>
                          </Stack>
                          {item.specialNote && (
                            <Typography variant="caption" sx={{ color: '#EA580C', fontWeight: 600, display: 'block' }}>
                              ⚠️ Note: {item.specialNote}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => updateOrderStatus(ord.id, 'Ready')}
                      sx={{
                        backgroundColor: '#16A34A',
                        '&:hover': { backgroundColor: '#15803D' },
                        borderRadius: '12px',
                        fontWeight: 700,
                      }}
                    >
                      Mark Ready for Dispatch
                    </Button>
                  </Card>
                ))}
                {cookingOrders.length === 0 && (
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center', py: 4 }}>
                    No orders currently cooking.
                  </Typography>
                )}
              </Stack>
            </Card>
          </Grid>

          {/* Column 3: Ready for Courier Dispatch */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                border: '2px solid #16A34A',
                bgcolor: theme.palette.background.paper,
                minHeight: '65vh',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#16A34A' }}>
                  ✅ Ready for Dispatch ({readyOrders.length})
                </Typography>
                <Chip label="Packed & Sealed" size="small" sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16A34A', fontWeight: 700 }} />
              </Stack>

              <Stack spacing={2}>
                {readyOrders.map((ord) => (
                  <Card
                    key={ord.id}
                    sx={{
                      p: 2.2,
                      borderRadius: '16px',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {ord.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Assigned: {ord.assignedDriver || 'Awaiting Rider'}
                        </Typography>
                      </Box>
                      <Chip label="Ready" size="small" sx={{ bgcolor: '#16A34A', color: '#FFF', fontWeight: 700 }} />
                    </Stack>

                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1.5 }}>
                      Delivery To: <b>{ord.deliveryAddress}</b>
                    </Typography>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                      sx={{ borderRadius: '12px', fontWeight: 700, borderColor: '#16A34A', color: '#16A34A' }}
                    >
                      Handover Complete (Delivered)
                    </Button>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* TAB 1: BATCH FOOD QUANTITY PREP CALCULATOR */}
      {activeTab === 1 && (
        <Card sx={{ p: 4, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Aggregated Batch Prep Calculator
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Total food portions calculated automatically across all active scheduled orders today.
              </Typography>
            </Box>
            <Chip
              label="Live Batch Sum"
              size="small"
              sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16A34A', fontWeight: 700 }}
            />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Menu Dish / Item</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Total Portions Needed Today</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Orders Count</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Special Dietary Customizations</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Kitchen Prep Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchPrepList.map((dish, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{dish.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${dish.totalQuantity} Portions`}
                        sx={{ fontWeight: 800, bgcolor: '#EA580C15', color: '#EA580C' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {dish.orderIds.join(', ')}
                    </TableCell>
                    <TableCell>
                      {dish.specialNotes.length > 0 ? (
                        <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700 }}>
                          {dish.specialNotes.join(' | ')}
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Standard recipe
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Chip label="In Batch Prep" size="small" sx={{ bgcolor: 'rgba(37,99,235,0.1)', color: '#2563EB', fontWeight: 700 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* TAB 2: INGREDIENTS & STOCK MANAGEMENT */}
      {activeTab === 2 && (
        <Card sx={{ p: 4, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Ingredients & Stock Inventory (Sri Lanka)
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Monitor essential catering ingredients, spices, and packaging with low-stock alerts.
              </Typography>
            </Box>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Ingredient Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Current Stock</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Safety Minimum</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Stock Level</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'center' }}>Adjust Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ing) => (
                  <TableRow key={ing.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{ing.name}</TableCell>
                    <TableCell>{ing.category}</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }}>
                      {ing.currentStock} {ing.unit}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {ing.minThreshold} {ing.unit}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ing.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: ing.status === 'Good' ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                          color: ing.status === 'Good' ? '#16A34A' : '#DC2626',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => updateIngredientStock(ing.id, -5)}
                          sx={{ border: `1px solid ${theme.palette.divider}` }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => updateIngredientStock(ing.id, 10)}
                          sx={{ border: `1px solid ${theme.palette.divider}`, color: '#16A34A' }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* TAB 3: MANAGE DAILY MENUS */}
      {activeTab === 3 && (
        <Card sx={{ p: 4, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Daily Menu Availability Toggle
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Enable or disable menu dishes and catering trays in real-time based on today’s fresh market supply.
          </Typography>

          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    p: 2.2,
                    borderRadius: '16px',
                    border: `1.5px solid ${item.available ? theme.palette.divider : '#DC2626'}`,
                    bgcolor: item.available ? theme.palette.background.paper : 'rgba(220,38,38,0.03)',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ flex: 1, pr: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, textDecoration: item.available ? 'none' : 'line-through' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Rs. {item.price.toLocaleString()} • {item.category}
                      </Typography>
                    </Box>
                    <Switch
                      checked={item.available}
                      onChange={() => toggleItemAvailability(item.id)}
                      color="success"
                    />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
    </Box>
  );
};
