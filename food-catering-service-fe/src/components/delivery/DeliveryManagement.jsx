import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
  Alert,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import { useApp } from '../../context/AppContext';

export const DeliveryManagement = () => {
  const { orders, drivers, assignDriverToOrder, updateOrderStatus, showToast } = useApp();
  const theme = useTheme();

  // Dialog State for Assigning Driver
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  // Notification dialog simulation
  const [notifyOrder, setNotifyOrder] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Delivery filter
  const [zoneFilter, setZoneFilter] = useState('All');

  const handleOpenAssign = (order) => {
    setSelectedOrder(order);
    setSelectedDriverId(drivers[0]?.id || '');
  };

  const handleConfirmAssign = () => {
    if (selectedOrder && selectedDriverId) {
      const driver = drivers.find((d) => d.id === selectedDriverId);
      if (driver) {
        assignDriverToOrder(selectedOrder.id, `${driver.name} (${driver.vehicle})`, driver.phone);
        setSelectedOrder(null);
      }
    }
  };

  const handleOpenNotification = (order) => {
    setNotifyOrder(order);
    setNotificationMessage(
      `Ayubowan ${order.customerName}! Your Ceylon Feast catering order #${order.id} is now OUT FOR DELIVERY with rider ${order.assignedDriver || 'Nuwan Bandara'}. Expected arrival in 25 minutes.`
    );
  };

  const handleSendNotification = () => {
    showToast(`SMS / WhatsApp dispatch notification sent to ${notifyOrder?.customerPhone}`, 'success');
    setNotifyOrder(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: theme.palette.mode === 'dark' ? '#0F0F10' : '#F4F7FC', minHeight: '100%' }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Delivery & Fleet Logistics
            </Typography>
            <Chip
              label="Colombo Delivery Hub"
              size="small"
              sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16A34A', fontWeight: 800 }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Assign dispatch couriers, schedule delivery runs across Colombo 1-15, update transit status & notify clients.
          </Typography>
        </Box>
      </Stack>

      {/* Fleet Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {drivers.map((drv) => (
          <Grid item xs={12} sm={6} md={4} key={drv.id}>
            <Card
              sx={{
                p: 3,
                borderRadius: '20px',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar src={drv.avatar} alt={drv.name} sx={{ width: 52, height: 52, border: '2px solid #16A34A' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {drv.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                    {drv.vehicle}
                  </Typography>
                  <Chip
                    label={drv.status}
                    size="small"
                    sx={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      height: 20,
                      bgcolor: drv.status === 'En Route' ? 'rgba(37,99,235,0.1)' : 'rgba(22,163,74,0.1)',
                      color: drv.status === 'En Route' ? '#2563EB' : '#16A34A',
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Assigned Route Zone:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {drv.zone}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Deliveries Completed Today:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#16A34A' }}>
                  {drv.completedToday} Deliveries
                </Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Deliveries Schedule & Assignment Table */}
      <Card sx={{ p: 3.5, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Scheduled Catering Deliveries
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <TextField
              select
              size="small"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              sx={{ width: 180, '& fieldset': { borderRadius: '12px' } }}
            >
              <MenuItem value="All">All Sri Lanka Zones</MenuItem>
              <MenuItem value="Colombo 01">Colombo 01 (Fort)</MenuItem>
              <MenuItem value="Colombo 07">Colombo 07</MenuItem>
              <MenuItem value="Colombo 03">Colombo 03</MenuItem>
              <MenuItem value="Kandy">Kandy & Outstation</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Recipient & Address</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Scheduled Slot</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Assigned Driver</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((ord) => (
                <TableRow key={ord.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{ord.id}</TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {ord.customerName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      📍 {ord.deliveryAddress}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 600 }}>
                      📞 {ord.customerPhone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ord.eventDate}</Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {ord.eventTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ord.status}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor:
                          ord.status === 'Delivered'
                            ? '#16A34A'
                            : ord.status === 'Out for Delivery' || ord.status === 'En Route'
                            ? '#2563EB'
                            : '#EAB308',
                        color: '#FFF',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {ord.assignedDriver || '⚠️ Unassigned'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenAssign(ord)}
                        sx={{ borderRadius: '10px', fontSize: '0.78rem', textTransform: 'none' }}
                      >
                        Assign Rider
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenNotification(ord)}
                        startIcon={<WhatsAppIcon />}
                        sx={{ bgcolor: '#16A34A', '&:hover': { bgcolor: '#15803D' }, borderRadius: '10px', fontSize: '0.78rem', textTransform: 'none' }}
                      >
                        Notify
                      </Button>
                      {ord.status !== 'Delivered' && (
                        <Button
                          size="small"
                          onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                          sx={{ color: '#16A34A', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Assign Driver Dialog */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 800 }}>
              Assign Dispatch Rider to {selectedOrder.id}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                Destination: {selectedOrder.deliveryAddress}
              </Typography>

              <TextField
                select
                fullWidth
                label="Select Courier Rider"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
              >
                {drivers.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name} — {d.vehicle} ({d.zone})
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedOrder(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleConfirmAssign} sx={{ bgcolor: '#F97316', borderRadius: '10px' }}>
                Confirm Assignment
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Notify Customer Modal */}
      <Dialog
        open={Boolean(notifyOrder)}
        onClose={() => setNotifyOrder(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        {notifyOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 800 }}>
              Send Customer Dispatch Notification
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                Sending automated SMS / WhatsApp dispatch message to <b>{notifyOrder.customerPhone}</b> ({notifyOrder.customerName}):
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setNotifyOrder(null)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSendNotification}
                startIcon={<SendIcon />}
                sx={{ bgcolor: '#16A34A', '&:hover': { bgcolor: '#15803D' }, borderRadius: '10px' }}
              >
                Send WhatsApp Alert
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

