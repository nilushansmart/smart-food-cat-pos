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
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { currentScreen, setCurrentScreen, currentUser, orders, cart } = useApp();
  const theme = useTheme();

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'Preparing').length;
  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Define nav links based on currentUser.role
  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'Admin':
        return [
          { id: 'dashboard', label: 'Catering Dashboard', icon: DashboardIcon },
          { id: 'pos', label: 'Book Order (POS)', icon: PointOfSaleIcon, highlight: true },
          { id: 'orders', label: 'Catering Bookings', icon: ReceiptLongIcon, badge: pendingOrdersCount },
          { id: 'daily-income', label: 'Daily Income', icon: TodayIcon },
          { id: 'monthly-analytics', label: 'Monthly Analytics', icon: BarChartIcon },
          { divider: true },
          { id: 'menu', label: 'Catering Menu Catalog', icon: RestaurantMenuIcon },
          { id: 'users', label: 'User Management', icon: PeopleIcon },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ];
      case 'Staff':
        return [
          { id: 'pos', label: 'Book Catering (POS)', icon: PointOfSaleIcon, highlight: true },
          { id: 'orders', label: 'Scheduled Orders', icon: ReceiptLongIcon, badge: pendingOrdersCount },
        ];
      case 'Kitchen':
        return [
          { id: 'kitchen-display', label: 'Live KDS Board', icon: SoupKitchenIcon, badge: pendingOrdersCount + preparingOrdersCount },
          { id: 'kitchen-history', label: 'Completed Deliveries', icon: HistoryIcon },
        ];
      case 'Customer':
        return [
          { id: 'customer-menu', label: 'Online Catering Menu', icon: MenuBookIcon },
          { id: 'customer-cart', label: 'Booking Cart', icon: ShoppingBagIcon, badge: totalCartCount },
          { id: 'customer-tracking', label: 'Track Live Booking', icon: TimelineIcon },
          { id: 'customer-history', label: 'Past Bookings & Receipts', icon: ReceiptLongIcon },
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
        minHeight: 'calc(100vh - 64px)',
        py: 2.5,
        px: 1.5,
      }}
    >
      <Box sx={{ px: 2, mb: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: theme.palette.text.secondary,
          }}
        >
          {currentUser?.role} Navigation
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
                borderRadius: 3,
                mb: 0.8,
                py: 1.2,
                px: 2,
                transition: 'all 0.2s ease',
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
                  fontSize: '0.9rem',
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
                    fontSize: '0.75rem',
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
