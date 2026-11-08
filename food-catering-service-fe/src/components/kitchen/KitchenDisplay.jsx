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
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
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

  // Colors: < 10m normal, 10-20m amber, > 20m red
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
  const { orders, updateOrderStatus, categories } = useApp();
  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleTestChime = () => {
    sound.playKitchenChime();
  };

  // Filter orders by category if needed
  const filterByCat = (orderList) => {
    if (selectedCategory === 'All') return orderList;
    return orderList.filter((ord) =>
      ord.items.length > 0
    );
  };

  const newOrders = filterByCat(orders.filter((o) => o.status === 'Pending'));
  const preparingOrders = filterByCat(orders.filter((o) => o.status === 'Preparing'));
  const readyOrders = filterByCat(orders.filter((o) => o.status === 'Ready'));

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Kitchen Minimal Top Bar with Category Filter & Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalFireDepartmentIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Kitchen Live Display System (KDS)
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Wall-mounted & tablet board • {newOrders.length + preparingOrders.length} active tickets
            </Typography>
          </Box>
        </Box>

        {/* Category Filters & Bell Sound Action */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.8, overflowX: 'auto' }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  fontWeight: 600,
                  backgroundColor: selectedCategory === cat ? '#EA580C' : 'transparent',
                  color: selectedCategory === cat ? '#FFFFFF' : theme.palette.text.primary,
                  border: `1px solid ${selectedCategory === cat ? '#EA580C' : theme.palette.divider}`,
                }}
              />
            ))}
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={handleTestChime}
            startIcon={<VolumeUpIcon />}
            sx={{ borderRadius: 2.5, minHeight: 38, borderColor: theme.palette.divider }}
          >
            Test Bell
          </Button>
        </Box>
      </Box>

      {/* 3-Column Kanban Board */}
      <Grid container spacing={2.5} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Column 1: New (Pending) */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.08)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              mb: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#EA580C' }}>
              1. NEW ORDERS
            </Typography>
            <Chip
              size="small"
              label={newOrders.length}
              sx={{ backgroundColor: '#EA580C', color: '#FFFFFF', fontWeight: 800 }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, pr: 0.5 }}>
            {newOrders.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                <Typography variant="body2">No pending tickets right now.</Typography>
              </Box>
            ) : (
              newOrders.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="new-ticket-pulse"
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    border: '2px solid #F97316',
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  {/* Ticket Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ maxWidth: '68%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                        #{ticket.id}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                        {ticket.orderType || 'Online Delivery'} • {ticket.customerName}
                      </Typography>
                      {ticket.eventDate && (
                        <Typography variant="caption" sx={{ color: '#EA580C', fontWeight: 700, display: 'block' }}>
                          ⏰ Due: {ticket.eventDate} ({ticket.eventTime || 'Lunch'})
                        </Typography>
                      )}
                      {ticket.deliveryAddress && (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }} noWrap>
                          📍 {ticket.deliveryAddress}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                      <ElapsedTimer createdAt={ticket.createdAt} />
                      {ticket.guestCount && (
                        <Chip size="small" label={ticket.guestCount} sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }} />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                  {/* Items list with prominent quantities */}
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {ticket.items.map((item, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              backgroundColor: '#EA580C',
                              color: '#FFFFFF',
                              px: 1,
                              py: 0.2,
                              borderRadius: 1.5,
                              fontWeight: 800,
                              fontSize: '0.9rem',
                            }}
                          >
                            {item.quantity}x
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {item.name}
                          </Typography>
                        </Box>
                        {item.specialNote && (
                          <Box
                            sx={{
                              backgroundColor: 'rgba(234, 179, 8, 0.15)',
                              color: '#854D0E',
                              p: 0.8,
                              borderRadius: 1.5,
                              mt: 0.5,
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            ⚡ Instructions: {item.specialNote}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Stack>

                  {/* Big Touch Action Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => updateOrderStatus(ticket.id, 'Preparing')}
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      minHeight: 52,
                      fontSize: '1rem',
                      fontWeight: 800,
                      backgroundColor: '#EA580C',
                      '&:hover': { backgroundColor: '#C2410C' },
                    }}
                  >
                    Start Preparing
                  </Button>
                </Card>
              ))
            )}
          </Box>
        </Grid>

        {/* Column 2: Preparing */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(202, 138, 4, 0.15)' : 'rgba(202, 138, 4, 0.08)',
              border: '1px solid rgba(202, 138, 4, 0.25)',
              mb: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#CA8A04' }}>
              2. IN PREPARATION
            </Typography>
            <Chip
              size="small"
              label={preparingOrders.length}
              sx={{ backgroundColor: '#CA8A04', color: '#FFFFFF', fontWeight: 800 }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, pr: 0.5 }}>
            {preparingOrders.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                <Typography variant="body2">No dishes currently on the stove.</Typography>
              </Box>
            ) : (
              preparingOrders.map((ticket) => (
                <Card
                  key={ticket.id}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    border: '2px solid #CA8A04',
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ maxWidth: '68%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                        #{ticket.id}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                        {ticket.orderType || 'Online Delivery'} • {ticket.customerName}
                      </Typography>
                      {ticket.eventDate && (
                        <Typography variant="caption" sx={{ color: '#CA8A04', fontWeight: 700, display: 'block' }}>
                          ⏰ Due: {ticket.eventDate} ({ticket.eventTime || 'Lunch'})
                        </Typography>
                      )}
                      {ticket.deliveryAddress && (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }} noWrap>
                          📍 {ticket.deliveryAddress}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                      <ElapsedTimer createdAt={ticket.createdAt} />
                      {ticket.guestCount && (
                        <Chip size="small" label={ticket.guestCount} sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }} />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {ticket.items.map((item, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              backgroundColor: '#CA8A04',
                              color: '#FFFFFF',
                              px: 1,
                              py: 0.2,
                              borderRadius: 1.5,
                              fontWeight: 800,
                              fontSize: '0.9rem',
                            }}
                          >
                            {item.quantity}x
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {item.name}
                          </Typography>
                        </Box>
                        {item.specialNote && (
                          <Box
                            sx={{
                              backgroundColor: 'rgba(234, 179, 8, 0.15)',
                              color: '#854D0E',
                              p: 0.8,
                              borderRadius: 1.5,
                              mt: 0.5,
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            ⚡ Instructions: {item.specialNote}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => updateOrderStatus(ticket.id, 'Ready')}
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      minHeight: 52,
                      fontSize: '1rem',
                      fontWeight: 800,
                      backgroundColor: '#16A34A',
                      '&:hover': { backgroundColor: '#15803D' },
                    }}
                  >
                    Mark Ready for Pickup
                  </Button>
                </Card>
              ))
            )}
          </Box>
        </Grid>

        {/* Column 3: Ready */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(22, 163, 74, 0.15)' : 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              mb: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#16A34A' }}>
              3. READY / PACKED
            </Typography>
            <Chip
              size="small"
              label={readyOrders.length}
              sx={{ backgroundColor: '#16A34A', color: '#FFFFFF', fontWeight: 800 }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, pr: 0.5 }}>
            {readyOrders.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary }}>
                <Typography variant="body2">No orders waiting on the pass.</Typography>
              </Box>
            ) : (
              readyOrders.map((ticket) => (
                <Card
                  key={ticket.id}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    border: '2px solid #16A34A',
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ maxWidth: '68%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                        #{ticket.id}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                        {ticket.orderType || 'Online Delivery'} • {ticket.customerName}
                      </Typography>
                      {ticket.eventDate && (
                        <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700, display: 'block' }}>
                          ⏰ Due: {ticket.eventDate} ({ticket.eventTime || 'Lunch'})
                        </Typography>
                      )}
                      {ticket.deliveryAddress && (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }} noWrap>
                          📍 {ticket.deliveryAddress}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                      <ElapsedTimer createdAt={ticket.createdAt} />
                      {ticket.guestCount && (
                        <Chip size="small" label={ticket.guestCount} sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }} />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                  <Stack spacing={0.8} sx={{ mb: 2 }}>
                    {ticket.items.map((item, idx) => (
                      <Typography key={idx} variant="body2" sx={{ fontWeight: 600 }}>
                        • {item.quantity}x {item.name}
                      </Typography>
                    ))}
                  </Stack>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => updateOrderStatus(ticket.id, 'Completed')}
                    startIcon={<DoneAllIcon />}
                    sx={{
                      minHeight: 52,
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      borderColor: '#16A34A',
                      color: '#16A34A',
                      '&:hover': {
                        backgroundColor: 'rgba(22, 163, 74, 0.08)',
                        borderColor: '#15803D',
                      },
                    }}
                  >
                    Complete / Hand Over
                  </Button>
                </Card>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
