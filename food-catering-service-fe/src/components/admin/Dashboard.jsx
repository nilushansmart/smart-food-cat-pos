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
  Paper,
  useTheme,
  Fab,
  Tooltip,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { NumberCounter } from '../common/NumberCounter';
import { PAST_DAYS_INCOME } from '../../data/mockData';

export const Dashboard = () => {
  const { orders, setCurrentScreen, openReceiptModal } = useApp();
  const theme = useTheme();

  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Compute live KPIs
  const todayOrders = orders; // For demo purpose, all current session orders count as recent
  const todayIncome = todayOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing');
  const avgOrderValue = todayOrders.length > 0 ? todayIncome / todayOrders.length : 0;

  // 7-day chart data
  const chartData = [...PAST_DAYS_INCOME];
  // Replace "Today" with computed live today income
  chartData[chartData.length - 1] = {
    day: 'Today',
    date: '2026-11-08',
    income: todayIncome > 0 ? todayIncome : 204.49,
    orders: todayOrders.length,
  };

  const maxIncome = Math.max(...chartData.map((d) => d.income), 100);

  const kpis = [
    {
      title: "Today's Income",
      value: todayIncome,
      prefix: '$',
      decimals: 2,
      icon: AttachMoneyIcon,
      color: '#16A34A', // Success / income color
      bg: 'rgba(22, 163, 74, 0.12)',
      trend: '+18.4% vs last week',
    },
    {
      title: 'Orders Today',
      value: todayOrders.length,
      prefix: '',
      decimals: 0,
      icon: ShoppingBagIcon,
      color: '#F97316', // Primary warm orange
      bg: 'rgba(249, 115, 22, 0.12)',
      trend: `${todayOrders.length} tickets placed`,
    },
    {
      title: 'Active / Pending',
      value: pendingOrders.length,
      prefix: '',
      decimals: 0,
      icon: PendingActionsIcon,
      color: '#EAB308', // Accent amber
      bg: 'rgba(234, 179, 8, 0.15)',
      trend: 'In kitchen prep queue',
    },
    {
      title: 'Avg Order Value',
      value: avgOrderValue,
      prefix: '$',
      decimals: 2,
      icon: TrendingUpIcon,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.12)',
      trend: 'Per customer ticket',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Top Header */}
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
            Online Catering Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Real-time online catering bookings, scheduled kitchen deliveries, and gross income stream.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setCurrentScreen('pos')}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#F97316',
            minHeight: 48,
            px: 2.8,
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: '0 6px 16px rgba(249, 115, 22, 0.3)',
            '&:hover': {
              backgroundColor: '#EA580C',
            },
          }}
        >
          Book Catering Order (POS)
        </Button>
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ p: 2.5, borderRadius: 3.5, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                    {kpi.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2.5,
                      backgroundColor: kpi.bg,
                      color: kpi.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.8 }} className="tabular-nums">
                  <NumberCounter value={kpi.value} prefix={kpi.prefix} decimals={kpi.decimals} />
                </Typography>
                <Typography variant="caption" sx={{ color: kpi.color, fontWeight: 600 }}>
                  {kpi.trend}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 7-Day Income Mini Bar Chart */}
      <Card sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 4, mb: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Last 7 Days Revenue Stream
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Daily income generated across catering orders
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => setCurrentScreen('monthly-analytics')}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{ color: '#F97316', fontWeight: 600 }}
          >
            Full Analytics
          </Button>
        </Box>

        {/* SVG Bar Chart with Growth & Hover states */}
        <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'flex-end', gap: { xs: 1.5, sm: 3 }, pt: 3 }}>
          {chartData.map((d, index) => {
            const heightPercent = Math.max((d.income / maxIncome) * 100, 8);
            const isHovered = hoveredBarIndex === index;
            const isToday = d.day === 'Today';

            return (
              <Box
                key={d.date}
                onMouseEnter={() => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      backgroundColor: '#1C1917',
                      color: '#FFFFFF',
                      py: 0.5,
                      px: 1,
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    ${d.income.toFixed(2)} ({d.orders} orders)
                  </Box>
                )}

                {/* Animated Growing Bar */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 48,
                    height: `${heightPercent}%`,
                    borderRadius: '8px 8px 4px 4px',
                    backgroundColor: isToday
                      ? '#F97316'
                      : isHovered
                      ? '#FB923C'
                      : theme.palette.mode === 'dark'
                      ? 'rgba(249, 115, 22, 0.4)'
                      : 'rgba(249, 115, 22, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'scaleY(1.04)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? '#F97316' : theme.palette.text.secondary,
                    fontSize: '0.78rem',
                  }}
                >
                  {d.day}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Card>

      {/* Recent Orders List */}
      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Live Recent Orders
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Click any order to view details, print, or share WhatsApp receipt
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => setCurrentScreen('orders')}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{ color: '#F97316', fontWeight: 600 }}
          >
            View All ({orders.length})
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                  }}
                  onClick={() => openReceiptModal(order)}
                >
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.customerName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {order.customerPhone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#16A34A' }} className="tabular-nums">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Receipt">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReceiptModal(order);
                        }}
                        sx={{ color: '#F97316' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Floating Action Button for New Order */}
      <Fab
        color="primary"
        onClick={() => setCurrentScreen('pos')}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 32 },
          right: { xs: 20, md: 32 },
          backgroundColor: '#F97316',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
          '&:hover': { backgroundColor: '#EA580C' },
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
