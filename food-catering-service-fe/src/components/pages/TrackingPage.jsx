import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  IconButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useApp } from '../../context/AppContext';
import { generatePdfReceipt } from '../../utils/pdfReceipt';

export const TrackingPage = () => {
  const { orders, updateOrderStatus, openReceiptModal, cateringSettings } = useApp();
  const theme = useTheme();

  // Active tracking order is the most recent order, or first one
  const activeOrder = orders[0] || null;

  // Stepper mapping
  const steps = [
    { label: 'Booking Received', desc: 'Order verified & payment confirmed' },
    { label: 'Kitchen Preparing', desc: 'Chef cooking fresh Ceylon feast' },
    { label: 'Packaging & QA', desc: 'Insulated hot containers sealed' },
    { label: 'Out for Delivery', desc: 'Rider en route across Colombo' },
    { label: 'Delivered', desc: 'Handed over hot to customer' },
  ];

  const getActiveStep = (status) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Cooking':
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'En Route':
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
      case 'Completed':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = activeOrder ? getActiveStep(activeOrder.status) : 0;

  // Simulator helper
  const advanceDemoStatus = () => {
    if (!activeOrder) return;
    const flow = ['Pending', 'Cooking', 'Ready', 'Out for Delivery', 'Delivered'];
    const curIdx = flow.indexOf(activeOrder.status);
    const nextStatus = flow[(curIdx + 1) % flow.length];
    updateOrderStatus(activeOrder.id, nextStatus);
  };

  const handleDownloadPdf = (order) => {
    generatePdfReceipt(order, cateringSettings);
  };

  return (
    <Box sx={{ pb: 12 }}>
      {/* Banner */}
      <Box
        sx={{
          py: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #18181B 0%, #09090B 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #F0FDF4 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 5,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
            Live Order Tracking & History
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Real-time status updates from our Colombo central cloud kitchen to your doorstep.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {activeOrder ? (
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Live Tracking Card */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 4, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Booking {activeOrder.id}
                      </Typography>
                      <Chip
                        label={activeOrder.status}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          bgcolor: activeOrder.status === 'Delivered' ? '#16A34A' : '#F97316',
                          color: '#FFF',
                        }}
                      />
                    </Stack>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Event Date: {activeOrder.eventDate} • {activeOrder.eventTime}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, sm: 0 } }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={advanceDemoStatus}
                      sx={{ borderRadius: '10px', fontSize: '0.78rem' }}
                    >
                      Advance Demo Status
                    </Button>
                    <IconButton onClick={() => handleDownloadPdf(activeOrder)} color="primary">
                      <PictureAsPdfIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Animated Visual Stepper */}
                <Box sx={{ py: 3, mb: 3 }}>
                  <Stepper activeStep={currentStep} alternativeLabel>
                    {steps.map((st, i) => (
                      <Step key={i}>
                        <StepLabel
                          StepIconProps={{
                            sx: {
                              '&.Mui-active': { color: '#F97316' },
                              '&.Mui-completed': { color: '#16A34A' },
                            },
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            {st.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.72rem' }}>
                            {st.desc}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Assigned Delivery Driver Details */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
                        alt="Rider"
                        sx={{ width: 50, height: 50, border: '2px solid #F97316' }}
                      />
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: 'block' }}>
                          ASSIGNED COURIER / RIDER
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {activeOrder.assignedDriver || 'Nuwan Bandara (WP-BHI-4210)'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>
                          Insulated Delivery Bag • Temperature Verified
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PhoneIcon />}
                        href={`tel:${activeOrder.driverPhone || '+94771234567'}`}
                        sx={{ bgcolor: '#F97316', '&:hover': { bgcolor: '#EA580C' }, borderRadius: '10px' }}
                      >
                        Call Rider
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        href="https://wa.me/94771234567"
                        target="_blank"
                        sx={{ borderColor: '#16A34A', color: '#16A34A', borderRadius: '10px' }}
                      >
                        WhatsApp
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            </Grid>

            {/* Order Items & Destination Summary Right */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3.5, borderRadius: '24px', border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Booking Details
                </Typography>

                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: 'block' }}>
                  DELIVERY DESTINATION:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                  {activeOrder.deliveryAddress}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: 'block', mb: 1 }}>
                  ORDERED DISHES:
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {activeOrder.items?.map((item, idx) => (
                    <Stack direction="row" justifyContent="space-between" key={idx}>
                      <Typography variant="body2">
                        {item.quantity}x {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Total (LKR):
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#EA580C' }}>
                    Rs. {activeOrder.total?.toLocaleString()}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  onClick={() => openReceiptModal(activeOrder)}
                  sx={{ borderRadius: '12px' }}
                >
                  View Digital Invoice Receipt
                </Button>
              </Card>
            </Grid>
          </Grid>
        ) : null}

        {/* Order History Table */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
          Past Catering Orders & History
        </Typography>

        <Card sx={{ borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#27272A' : '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Event Schedule</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Total (LKR)</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((ord) => (
                  <TableRow key={ord.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{ord.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {ord.customerName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {ord.customerPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ord.eventDate}</Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {ord.eventTime}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {ord.items?.length || 0} items ({ord.guestCount || 'Catering'})
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ord.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor:
                            ord.status === 'Delivered' || ord.status === 'Completed'
                              ? 'rgba(22,163,74,0.1)'
                              : ord.status === 'Cooking'
                              ? 'rgba(37,99,235,0.1)'
                              : 'rgba(234,179,8,0.1)',
                          color:
                            ord.status === 'Delivered' || ord.status === 'Completed'
                              ? '#16A34A'
                              : ord.status === 'Cooking'
                              ? '#2563EB'
                              : '#CA8A04',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#EA580C' }}>
                      Rs. {ord.total?.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button
                        size="small"
                        onClick={() => openReceiptModal(ord)}
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
      </Container>
    </Box>
  );
};

