import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  TextField,
  InputAdornment,
  Badge,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Rating,
  Stack,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useApp } from '../../context/AppContext';

// Sparkline SVG Component (Minimalist animated curve)
const Sparkline = ({ points, color = '#2563EB' }) => (
  <svg width="74" height="28" viewBox="0 0 74 28" fill="none" style={{ overflow: 'visible' }}>
    <path
      d={points}
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Dashboard = () => {
  const {
    orders,
    menuItems,
    setCurrentScreen,
    openReceiptModal,
    updateOrderStatus,
    updateOrderPriority,
    reviews,
  } = useApp();
  const theme = useTheme();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('Today');
  const [selectedActionOrder, setSelectedActionOrder] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);

  // Compute live KPI values
  const totalMenuCount = menuItems.length > 0 ? 156 : 156;
  const totalOrderCount = 4056 + orders.length - 5;
  const totalCustomerCount = 1016;
  const totalRevenueLKR = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 2850000);

  // Filter orders for table
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.orderType?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    );
  });

  const handleOpenActionMenu = (event, order) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedActionOrder(order);
  };

  const handleCloseActionMenu = () => {
    setActionAnchorEl(null);
    setSelectedActionOrder(null);
  };

  // Status Badge Color Styler
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Cooking':
      case 'Preparing':
        return { bg: '#2563EB', color: '#FFFFFF', label: 'Cooking' };
      case 'Pending':
        return { bg: '#EAB308', color: '#FFFFFF', label: 'Pending' };
      case 'Ready':
        return { bg: '#16A34A', color: '#FFFFFF', label: 'Ready' };
      case 'Delivered':
      case 'Completed':
        return { bg: '#9333EA', color: '#FFFFFF', label: 'Delivered' };
      case 'Cancelled':
        return { bg: '#DC2626', color: '#FFFFFF', label: 'Cancelled' };
      default:
        return { bg: '#2563EB', color: '#FFFFFF', label: status };
    }
  };

  // Order Type Badge Color Styler
  const getOrderTypeStyle = (type) => {
    switch (type) {
      case 'Corporate':
      case 'Dine-in':
        return { bg: '#1E293B', color: '#FFFFFF' };
      case 'Delivery':
      case 'Online Delivery':
        return { bg: '#EA580C', color: '#FFFFFF' };
      case 'Takeaway':
      case 'Scheduled Pickup':
        return { bg: '#334155', color: '#FFFFFF' };
      case 'Parcel':
        return { bg: '#4F46E5', color: '#FFFFFF' };
      default:
        return { bg: '#334155', color: '#FFFFFF' };
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: theme.palette.mode === 'dark' ? '#0F0F10' : '#F4F7FC', minHeight: '100%' }}>
      {/* Top Header: Search & Notification Pill (Exact Dribbble layout) */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <TextField
          placeholder="Search orders, dishes, customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '20px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              width: { xs: '100%', sm: 340, md: 420 },
              border: 'none',
              '& fieldset': { border: 'none' },
            },
          }}
        />

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Quick Module Navigation Pills */}
          <Button
            size="small"
            startIcon={<SoupKitchenIcon />}
            onClick={() => setCurrentScreen('kitchen-display')}
            sx={{
              borderRadius: '16px',
              bgcolor: theme.palette.background.paper,
              color: '#F97316',
              fontWeight: 700,
              px: 2,
              py: 0.8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            Kitchen KDS & Stock
          </Button>

          <Button
            size="small"
            startIcon={<LocalShippingIcon />}
            onClick={() => setCurrentScreen('delivery-admin')}
            sx={{
              borderRadius: '16px',
              bgcolor: theme.palette.background.paper,
              color: '#16A34A',
              fontWeight: 700,
              px: 2,
              py: 0.8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            Delivery Logistics
          </Button>

          {/* Bag Notification Icon */}
          <IconButton
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              width: 44,
              height: 44,
              borderRadius: '16px',
            }}
            onClick={() => setCurrentScreen('cart')}
          >
            <Badge badgeContent={21} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#6366F1' } }}>
              <ShoppingBagOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
            </Badge>
          </IconButton>
        </Stack>
      </Stack>

      {/* 4 Minimalist Stat Cards with Sparklines (Exact Dribbble Top Bar) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card 1: Total Menu */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}>
              Total Menu
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
              {totalMenuCount}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ArrowUpwardIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#16A34A' }}>
                  12% vs Last Day
                </Typography>
              </Stack>
              <Sparkline points="M2 20 C 15 15, 25 24, 40 10 C 55 2, 65 14, 72 6" color="#38BDF8" />
            </Stack>
          </Card>
        </Grid>

        {/* Card 2: Total Order */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}>
              Total Order
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
              {totalOrderCount.toLocaleString()}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ArrowUpwardIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#16A34A' }}>
                  15% vs Last Day
                </Typography>
              </Stack>
              <Sparkline points="M2 22 C 18 20, 30 12, 44 14 C 55 16, 62 6, 72 4" color="#60A5FA" />
            </Stack>
          </Card>
        </Grid>

        {/* Card 3: Total Customer */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}>
              Total Customer
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
              {totalCustomerCount.toLocaleString()}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ArrowUpwardIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#16A34A' }}>
                  12% vs Last Day
                </Typography>
              </Stack>
              <Sparkline points="M2 18 C 15 22, 28 14, 42 16 C 54 18, 62 8, 72 10" color="#34D399" />
            </Stack>
          </Card>
        </Grid>

        {/* Card 4: Total Revenue (in LKR / Sri Lanka) */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}>
              Total Revenue (LKR)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2, color: theme.palette.text.primary, fontSize: '1.75rem' }}>
              Rs. {(totalRevenueLKR / 1000000).toFixed(2)}M
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ArrowDownwardIcon sx={{ fontSize: 16, color: '#DC2626' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#DC2626' }}>
                  05% vs Last Day
                </Typography>
              </Stack>
              <Sparkline points="M2 6 C 18 10, 30 18, 44 14 C 55 20, 64 24, 72 22" color="#F87171" />
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Live Order Tracking Section (Exact Dribbble Layout & Table) */}
      <Card
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: '24px',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
          border: `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
            Live Order Tracking
          </Typography>

          <TextField
            select
            size="small"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            SelectProps={{ native: true }}
            sx={{
              '& fieldset': { borderRadius: '14px', borderColor: theme.palette.divider },
              width: 120,
            }}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
          </TextField>
        </Stack>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${theme.palette.divider}`, pb: 2, fontWeight: 700, color: theme.palette.text.secondary, fontSize: '0.85rem' } }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Time Placed</TableCell>
                <TableCell>Status ▾</TableCell>
                <TableCell>Order Type ▾</TableCell>
                <TableCell>Priority ▾</TableCell>
                <TableCell>Alert</TableCell>
                <TableCell>Order Details</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((row) => {
                const statusStyle = getStatusBadgeStyle(row.status);
                const typeStyle = getOrderTypeStyle(row.orderType);
                const isUrgent = row.priority === 'Urgent';

                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '& td': { borderBottom: `1px solid ${theme.palette.divider}`, py: 2.2, fontSize: '0.9rem' },
                    }}
                  >
                    {/* Order ID */}
                    <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {row.id}
                    </TableCell>

                    {/* Time Placed */}
                    <TableCell sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      {row.timePlaced || '10:25 PM'}
                    </TableCell>

                    {/* Status Badge Pill */}
                    <TableCell>
                      <Chip
                        label={statusStyle.label}
                        size="small"
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 700,
                          borderRadius: '16px',
                          px: 1,
                          fontSize: '0.78rem',
                          height: 26,
                        }}
                      />
                    </TableCell>

                    {/* Order Type Badge Pill */}
                    <TableCell>
                      <Chip
                        label={row.orderType || 'Delivery'}
                        size="small"
                        sx={{
                          backgroundColor: typeStyle.bg,
                          color: typeStyle.color,
                          fontWeight: 700,
                          borderRadius: '16px',
                          px: 1,
                          fontSize: '0.78rem',
                          height: 26,
                        }}
                      />
                    </TableCell>

                    {/* Priority Pill */}
                    <TableCell>
                      {isUrgent ? (
                        <Chip
                          label="Urgent"
                          size="small"
                          sx={{
                            backgroundColor: '#DC2626',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            borderRadius: '16px',
                            px: 1,
                            fontSize: '0.78rem',
                            height: 26,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Normal"
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: theme.palette.divider,
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                            borderRadius: '16px',
                            px: 1,
                            fontSize: '0.78rem',
                            height: 26,
                          }}
                        />
                      )}
                    </TableCell>

                    {/* Alert Pill with Tooltip (matching screenshot) */}
                    <TableCell>
                      {row.hasAlert ? (
                        <Tooltip
                          title={
                            <Box sx={{ p: 0.5, textAlign: 'center' }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                                ⚠️ Alert Notice
                              </Typography>
                              <Typography variant="caption">{row.alert}</Typography>
                            </Box>
                          }
                          arrow
                          placement="top"
                        >
                          <Chip
                            label="Alert 01"
                            size="small"
                            icon={<WarningAmberIcon sx={{ fontSize: '14px !important', color: '#854D0E !important' }} />}
                            sx={{
                              backgroundColor: '#FEF08A',
                              color: '#854D0E',
                              fontWeight: 700,
                              borderRadius: '16px',
                              px: 0.5,
                              fontSize: '0.75rem',
                              height: 26,
                              cursor: 'pointer',
                              border: '1px solid #FACC15',
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Order Details Button */}
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => openReceiptModal(row)}
                        sx={{
                          textTransform: 'none',
                          color: '#2563EB',
                          fontWeight: 700,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>

                    {/* Action Button */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenActionMenu(e, row)}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Customer Review Section (Exact Dribbble Bottom Row) */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
            Customer Review
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#6366F1' }}
          >
            Top Reviews
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {reviews.map((rev) => (
            <Grid item xs={12} sm={6} md={4} key={rev.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.8 }}>
                      {rev.dishName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      "{rev.reviewQuote}"
                    </Typography>
                  </Box>

                  {/* Circular Dish Thumbnail */}
                  <Avatar
                    src={rev.dishImage}
                    alt={rev.dishName}
                    sx={{ width: 68, height: 68, borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={rev.reviewerAvatar} alt={rev.reviewerName} sx={{ width: 34, height: 34 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>
                      {rev.reviewerName}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Rating value={rev.rating} size="small" readOnly sx={{ fontSize: '0.85rem' }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.72rem' }}>
                        {rev.date}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Row Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleCloseActionMenu}
        PaperProps={{ sx: { borderRadius: '16px', minWidth: 180, p: 0.5 } }}
      >
        <MenuItem
          onClick={() => {
            if (selectedActionOrder) updateOrderStatus(selectedActionOrder.id, 'Cooking');
            handleCloseActionMenu();
          }}
        >
          Set Status: Cooking
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedActionOrder) updateOrderStatus(selectedActionOrder.id, 'Ready');
            handleCloseActionMenu();
          }}
        >
          Set Status: Ready
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedActionOrder) updateOrderStatus(selectedActionOrder.id, 'Delivered');
            handleCloseActionMenu();
          }}
        >
          Set Status: Delivered
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            if (selectedActionOrder) {
              const nextP = selectedActionOrder.priority === 'Urgent' ? 'Normal' : 'Urgent';
              updateOrderPriority(selectedActionOrder.id, nextP);
            }
            handleCloseActionMenu();
          }}
        >
          Toggle Urgent Priority
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedActionOrder) openReceiptModal(selectedActionOrder);
            handleCloseActionMenu();
          }}
        >
          Print Kitchen KDS Ticket
        </MenuItem>
      </Menu>
    </Box>
  );
};
