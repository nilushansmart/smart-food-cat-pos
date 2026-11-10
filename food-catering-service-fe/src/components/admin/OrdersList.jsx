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
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatWhatsAppReceipt } from '../../utils/whatsapp';
import { generatePdfReceipt } from '../../utils/pdfReceipt';

export const OrdersList = () => {
  const {
    orders,
    openReceiptModal,
    updateOrderStatus,
    cancelOrder,
    cateringSettings,
    currentUser,
    prepareWhatsAppShare,
  } = useApp();

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState(null);

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatusTab === 'All' || order.status === selectedStatusTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(q) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.customerPhone && order.customerPhone.includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleOpenMenu = (event, order) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedOrderForAction(order);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedOrderForAction(null);
  };

  const handleWhatsApp = async (order) => {
    try {
      const serverUrl = await prepareWhatsAppShare(order.id);
      if (serverUrl) {
        window.open(serverUrl, '_blank');
        handleCloseMenu();
        return;
      }
    } catch {
      // ignore
    }
    const url = formatWhatsAppReceipt(order, cateringSettings);
    window.open(url, '_blank');
    handleCloseMenu();
  };

  const handlePdf = (order) => {
    const id = order.numericId || order.id;
    if (typeof id === 'number') {
      window.open(`/api/receipts/${id}/view`, '_blank');
      handleCloseMenu();
      return;
    }
    generatePdfReceipt(order, cateringSettings);
    handleCloseMenu();
  };

  const handleCancel = (order) => {
    cancelOrder(order.id);
    handleCloseMenu();
  };

  const handleMarkComplete = (order) => {
    updateOrderStatus(order.id, 'Completed');
    handleCloseMenu();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {currentUser?.role === 'Staff' ? 'Online Catering Orders Log' : 'Online Catering Bookings & Orders'}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Track scheduled event deliveries, customer venues, catering trays, and instant WhatsApp receipts.
        </Typography>
      </Box>

      {/* Search & Status Filters */}
      <Card sx={{ p: 2, borderRadius: 3.5, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Order ID (#ORD-...), customer name, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{ mb: 2 }}
        />

        <Tabs
          value={selectedStatusTab}
          onChange={(e, val) => setSelectedStatusTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              mr: 1,
              px: 2,
              '&.Mui-selected': {
                color: '#F97316',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#F97316',
              height: 3,
              borderRadius: 3,
            },
          }}
        >
          {statuses.map((st) => {
            const count = st === 'All' ? orders.length : orders.filter((o) => o.status === st).length;
            return <Tab key={st} value={st} label={`${st} (${count})`} />;
          })}
        </Tabs>
      </Card>

      {/* Orders Desktop Table / Mobile Card Layout */}
      {filteredOrders.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            No orders match the current criteria
          </Typography>
          <Button
            variant="text"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatusTab('All');
            }}
            sx={{ color: '#F97316', fontWeight: 600 }}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FAFAF9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Booking ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Scheduled Event</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Customer & Venue</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Catering Dishes</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Service / Pax</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((order) => (
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
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#C2410C' }}>
                            {order.eventDate || new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {order.eventTime || new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                            {order.customerPhone}
                          </Typography>
                          {order.deliveryAddress && (
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }} noWrap>
                              📍 {order.deliveryAddress}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 240 }}>
                          <Typography variant="body2" noWrap>
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {order.orderType || 'Online Delivery'}
                          </Typography>
                          {order.guestCount && (
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              👥 {order.guestCount}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#16A34A' }} className="tabular-nums">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
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
                            <Tooltip title="Share WhatsApp">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWhatsApp(order);
                                }}
                                sx={{ color: '#25D366' }}
                              >
                                <WhatsAppIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <IconButton
                              size="small"
                              onClick={(e) => handleOpenMenu(e, order)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>

          {/* Mobile Cards View */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                sx={{ p: 2, borderRadius: 3.5, cursor: 'pointer' }}
                onClick={() => openReceiptModal(order)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      #{order.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </Typography>
                  </Box>
                  <StatusBadge status={order.status} size="small" />
                </Box>

                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {order.customerName} ({order.customerPhone})
                </Typography>

                {order.eventDate && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#F97316', fontWeight: 700, display: 'block' }}>
                      📅 Event: {order.eventDate} ({order.eventTime || 'Lunch'}) • {order.orderType}
                    </Typography>
                    {order.deliveryAddress && (
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }} noWrap>
                        📍 {order.deliveryAddress}
                      </Typography>
                    )}
                  </Box>
                )}

                <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F5F5F4', p: 1.2, borderRadius: 2, mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 0.5 }}>
                    Items:
                  </Typography>
                  {order.items.map((item, idx) => (
                    <Typography key={idx} variant="body2" sx={{ fontSize: '0.85rem' }}>
                      • {item.quantity}x {item.name}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Total
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#16A34A' }} className="tabular-nums">
                      ${order.total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsApp(order);
                      }}
                      sx={{ borderRadius: 2, fontSize: '0.78rem', minHeight: 36 }}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        openReceiptModal(order);
                      }}
                      sx={{
                        backgroundColor: '#F97316',
                        borderRadius: 2,
                        fontSize: '0.78rem',
                        minHeight: 36,
                        '&:hover': { backgroundColor: '#EA580C' },
                      }}
                    >
                      Receipt
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      )}

      {/* Row Action Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 180 } }}
      >
        <MenuItem onClick={() => selectedOrderForAction && handleWhatsApp(selectedOrderForAction)}>
          <ListItemIcon>
            <WhatsAppIcon sx={{ color: '#25D366' }} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Send via WhatsApp" />
        </MenuItem>

        <MenuItem onClick={() => selectedOrderForAction && handlePdf(selectedOrderForAction)}>
          <ListItemIcon>
            <PictureAsPdfIcon sx={{ color: '#DC2626' }} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download PDF" />
        </MenuItem>

        {selectedOrderForAction?.status !== 'Completed' && selectedOrderForAction?.status !== 'Cancelled' && (
          <MenuItem onClick={() => selectedOrderForAction && handleMarkComplete(selectedOrderForAction)}>
            <ListItemIcon>
              <CheckCircleOutlineIcon sx={{ color: '#16A34A' }} fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Mark Completed" />
          </MenuItem>
        )}

        {selectedOrderForAction?.status !== 'Cancelled' && (
          <MenuItem onClick={() => selectedOrderForAction && handleCancel(selectedOrderForAction)} sx={{ color: '#DC2626' }}>
            <ListItemIcon>
              <CancelOutlinedIcon sx={{ color: '#DC2626' }} fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Cancel Order" />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
