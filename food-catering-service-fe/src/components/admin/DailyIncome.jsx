import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PrintIcon from '@mui/icons-material/Print';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { NumberCounter } from '../common/NumberCounter';

export const DailyIncome = () => {
  const { orders, openReceiptModal } = useApp();
  const theme = useTheme();

  // Selected date formatted as YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Filter orders matching selected date
  const dayOrders = orders.filter((order) => {
    const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
    return orderDateStr === selectedDate;
  });

  const validDayOrders = dayOrders.filter((o) => o.status !== 'Cancelled');
  const dayTotalIncome = validDayOrders.reduce((sum, o) => sum + o.total, 0);
  const daySubtotal = validDayOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const dayTax = validDayOrders.reduce((sum, o) => sum + o.tax, 0);
  const avgOrderValue = validDayOrders.length > 0 ? dayTotalIncome / validDayOrders.length : 0;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header & Date Picker */}
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
            Daily Income Report
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Real-time daily catering revenue breakdown and order verification.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputProps={{
              startAdornment: <CalendarMonthIcon sx={{ color: '#F97316', mr: 1, fontSize: 20 }} />,
            }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handlePrintReport}
            startIcon={<PrintIcon />}
            sx={{ borderRadius: 3, minHeight: 40 }}
          >
            Print Report
          </Button>
        </Box>
      </Box>

      {/* Day KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Total Income ({new Date(selectedDate).toLocaleDateString()})
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: 'rgba(22, 163, 74, 0.12)',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AttachMoneyIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#16A34A' }} className="tabular-nums">
              <NumberCounter value={dayTotalIncome} prefix="$" />
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Subtotal: ${daySubtotal.toFixed(2)} | Tax: ${dayTax.toFixed(2)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Total Orders Processed
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: 'rgba(249, 115, 22, 0.12)',
                  color: '#F97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ReceiptIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }} className="tabular-nums">
              <NumberCounter value={dayOrders.length} decimals={0} />
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {validDayOrders.length} valid tickets, {dayOrders.length - validDayOrders.length} cancelled
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Average Order Value
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUpIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }} className="tabular-nums">
              <NumberCounter value={avgOrderValue} prefix="$" />
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Average basket per catering transaction
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Breakdown Table for Selected Day */}
      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Transactions for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2.5 }}>
          Live order log for this date. Click on any record to view or reprint receipt.
        </Typography>

        {dayOrders.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              No orders recorded for this date.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FAFAF9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tax</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Paid</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dayOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => openReceiptModal(order)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {order.customerPhone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="body2" noWrap>
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </Typography>
                    </TableCell>
                    <TableCell className="tabular-nums">${order.subtotal.toFixed(2)}</TableCell>
                    <TableCell className="tabular-nums">${order.tax.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#16A34A' }} className="tabular-nums">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};
