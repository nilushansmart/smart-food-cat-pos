import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useApp } from '../../context/AppContext';

export const PaymentsManagement = () => {
  const { orders, showToast } = useApp();
  const theme = useTheme();

  const [filter, setFilter] = useState('All');

  const paymentList = orders.map((o) => ({
    id: `TXN-${o.id.replace('ORD-', '')}`,
    orderId: o.id,
    customerName: o.customerName,
    amount: o.total,
    method: o.paymentMethod || 'PayHere (Online)',
    status: o.paymentStatus || (o.status === 'Cancelled' ? 'Refunded' : 'Paid'),
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Today',
  }));

  const filteredPayments = paymentList.filter((p) => {
    if (filter === 'All') return true;
    return p.status === filter;
  });

  const totalCollected = paymentList
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: theme.palette.mode === 'dark' ? '#0F0F10' : '#F4F7FC', minHeight: '100%' }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Payments & Gateway Logs
            </Typography>
            <Chip
              label="PayHere Sri Lanka / Bank Transfer"
              size="small"
              sx={{ bgcolor: 'rgba(2,132,199,0.1)', color: '#0284C7', fontWeight: 800 }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Real-time transaction tracking, online PayHere settlements, and direct bank transfer slips.
          </Typography>
        </Box>
      </Stack>

      {/* Summary KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: 'block' }}>
              TOTAL COLLECTED (LKR)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#16A34A', my: 0.5 }}>
              Rs. {totalCollected.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Via PayHere & Verified Bank Transfers
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: 'block' }}>
              GATEWAY PARTNER
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0284C7', my: 0.5 }}>
              PayHere Sri Lanka
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Instant Settlement Merchant Account
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: 'block' }}>
              PENDING VERIFICATION
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#EAB308', my: 0.5 }}>
              {paymentList.filter((p) => p.status === 'Pending').length} Orders
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Awaiting cash handover or bank slip check
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Card sx={{ p: 3.5, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {['All', 'Paid', 'Pending', 'Refunded'].map((f) => (
            <Chip
              key={f}
              label={f}
              clickable
              onClick={() => setFilter(f)}
              sx={{
                fontWeight: 700,
                borderRadius: '12px',
                bgcolor: filter === f ? '#0284C7' : 'transparent',
                color: filter === f ? '#FFF' : theme.palette.text.primary,
                border: `1px solid ${filter === f ? '#0284C7' : theme.palette.divider}`,
              }}
            />
          ))}
        </Stack>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Amount (LKR)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{p.id}</TableCell>
                  <TableCell>{p.orderId}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{p.customerName}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.method}
                      size="small"
                      sx={{ bgcolor: 'rgba(2,132,199,0.08)', color: '#0284C7', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#EA580C' }}>
                    Rs. {p.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.status}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor:
                          p.status === 'Paid'
                            ? 'rgba(22,163,74,0.1)'
                            : p.status === 'Pending'
                            ? 'rgba(234,179,8,0.1)'
                            : 'rgba(220,38,38,0.1)',
                        color:
                          p.status === 'Paid'
                            ? '#16A34A'
                            : p.status === 'Pending'
                            ? '#CA8A04'
                            : '#DC2626',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Button
                      size="small"
                      onClick={() => showToast(`Payment receipt for ${p.id} downloaded`, 'info')}
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

