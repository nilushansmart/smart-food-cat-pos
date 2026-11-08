import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  useTheme,
  Chip,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useApp } from '../../context/AppContext';

export const KitchenHistory = () => {
  const { orders, openReceiptModal } = useApp();
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const completedOrders = orders.filter((o) => o.status === 'Completed');

  const filteredOrders = completedOrders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Kitchen Completed Archive
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Read-only history of dishes successfully prepared and dispatched today.
        </Typography>
      </Box>

      <Card sx={{ p: 2, borderRadius: 3.5, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search completed tickets by ID or dish name..."
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
      </Card>

      <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FAFAF9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Ticket ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Placed</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Dispatched</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Dishes Prepared</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Service Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: theme.palette.text.secondary }}>
                    No completed tickets found in today's kitchen log.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
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
                      {order.completedAt
                        ? new Date(order.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Completed'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.orderType || 'Standard'}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14, color: 'inherit !important' }} />}
                        label="Done"
                        size="small"
                        sx={{
                          backgroundColor: '#DCFCE7',
                          color: '#15803D',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ color: '#F97316' }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
