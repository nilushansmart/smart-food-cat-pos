import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TodayIcon from '@mui/icons-material/Today';
import BarChartIcon from '@mui/icons-material/BarChart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import CalculateIcon from '@mui/icons-material/Calculate';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { currentScreen, setCurrentScreen, currentUser, orders, cart } = useApp();
  const theme = useTheme();

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'Cooking' || o.status === 'Preparing').length;
  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Define nav links based on currentUser.role
  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'Admin':
        return [
          { id: 'dashboard', label: 'Overview Dashboard', icon: DashboardIcon },
          { id: 'orders', label: 'Orders & Bookings', icon: ReceiptLongIcon, badge: pendingOrdersCount },
          { id: 'kitchen-display', label: 'Kitchen KDS & Stock', icon: SoupKitchenIcon, badge: preparingOrdersCount },
          { id: 'delivery-admin', label: 'Delivery Logistics', icon: LocalShippingIcon },
          { id: 'payments-admin', label: 'Payments & PayHere', icon: PaymentIcon },
          { id: 'menu-admin', label: 'Manage Food & Packages', icon: RestaurantMenuIcon },
          { id: 'customers-admin', label: 'Customers', icon: PeopleIcon },
          { id: 'monthly-analytics', label: 'Sales Reports', icon: BarChartIcon },
          { divider: true },
          { id: 'home', label: 'Customer Storefront', icon: HomeIcon, highlight: true },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ];
      case 'Staff':
        return [
          { id: 'pos', label: 'Book Catering (POS)', icon: PointOfSaleIcon, highlight: true },
          { id: 'orders', label: 'Scheduled Orders', icon: ReceiptLongIcon, badge: pendingOrdersCount },
          { id: 'delivery-admin', label: 'Delivery Logistics', icon: LocalShippingIcon },
        ];
      case 'Kitchen':
        return [
          { id: 'kitchen-display', label: 'Live KDS & Batch Prep', icon: SoupKitchenIcon, badge: pendingOrdersCount + preparingOrdersCount },
          { id: 'orders', label: 'All Orders Queue', icon: ReceiptLongIcon },
        ];
      case 'Customer':
        return [
          { id: 'home', label: 'Home Page', icon: HomeIcon },
          { id: 'menu', label: 'Food Menu Catalog', icon: MenuBookIcon },
          { id: 'packages', label: 'Catering Packages', icon: RestaurantMenuIcon },
          { id: 'custom-order', label: 'Customize Your Order', icon: CalculateIcon, highlight: true },
          { id: 'events', label: 'Special Events Booking', icon: CelebrationIcon },
          { id: 'cart', label: 'Shopping Cart', icon: ShoppingBagIcon, badge: totalCartCount },
          { id: 'tracking', label: 'Live Order Tracking', icon: TimelineIcon },
          { divider: true },
          { id: 'about', label: 'About Ceylon Feast', icon: InfoIcon },
          { id: 'contact', label: 'Contact Us', icon: ContactSupportIcon },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <Box
      sx={{
        width: { md: 240, lg: 260 },
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        minHeight: 'calc(100vh - 68px)',
        py: 2.5,
        px: 1.5,
      }}
    >
      <Box sx={{ px: 2, mb: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: theme.palette.text.secondary,
            fontSize: '0.72rem',
          }}
        >
          {currentUser?.role === 'Customer' ? 'Storefront Navigation' : `${currentUser?.role} Operations`}
        </Typography>
      </Box>

      <List component="nav" sx={{ px: 0 }}>
        {navItems.map((item, index) => {
          if (item.divider) {
            return <Divider key={`div-${index}`} sx={{ my: 1.5, borderColor: theme.palette.divider }} />;
          }

          const isSelected = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.id}
              selected={isSelected}
              onClick={() => setCurrentScreen(item.id)}
              sx={{
                borderRadius: '14px',
                mb: 0.8,
                py: 1.1,
                px: 2,
                transition: 'all 0.15s ease',
                ...(isSelected && {
                  backgroundColor: '#F97316 !important',
                  color: '#FFFFFF !important',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                  '& .MuiListItemIcon-root': {
                    color: '#FFFFFF',
                  },
                  '& .MuiTypography-root': {
                    fontWeight: 700,
                  },
                }),
                ...(!isSelected && item.highlight && {
                  backgroundColor: 'rgba(249, 115, 22, 0.08)',
                  color: '#F97316',
                  '& .MuiListItemIcon-root': {
                    color: '#F97316',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(249, 115, 22, 0.16)',
                  },
                }),
                ...(!isSelected && !item.highlight && {
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isSelected ? '#FFFFFF' : theme.palette.text.secondary,
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? 700 : 500,
                }}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <Chip
                  size="small"
                  label={item.badge}
                  sx={{
                    height: 20,
                    minWidth: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: isSelected ? '#FFFFFF' : '#F97316',
                    color: isSelected ? '#F97316' : '#FFFFFF',
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};
