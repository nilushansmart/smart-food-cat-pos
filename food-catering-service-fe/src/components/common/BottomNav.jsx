import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  useTheme,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BarChartIcon from '@mui/icons-material/BarChart';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TimelineIcon from '@mui/icons-material/Timeline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useApp } from '../../context/AppContext';

export const BottomNav = ({ onOpenMoreMenu }) => {
  const { currentScreen, setCurrentScreen, currentUser, orders, cart } = useApp();
  const theme = useTheme();

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'Admin':
        return [
          { id: 'dashboard', label: 'Overview', icon: <DashboardIcon /> },
          { id: 'pos', label: 'POS', icon: <PointOfSaleIcon /> },
          {
            id: 'orders',
            label: 'Orders',
            icon: (
              <Badge badgeContent={pendingCount} color="error">
                <ReceiptLongIcon />
              </Badge>
            ),
          },
          { id: 'monthly-analytics', label: 'Analytics', icon: <BarChartIcon /> },
          { id: 'more', label: 'More', icon: <MoreHorizIcon /> },
        ];
      case 'Staff':
        return [
          { id: 'pos', label: 'New Order', icon: <PointOfSaleIcon /> },
          {
            id: 'orders',
            label: 'My Orders',
            icon: (
              <Badge badgeContent={pendingCount} color="error">
                <ReceiptLongIcon />
              </Badge>
            ),
          },
        ];
      case 'Kitchen':
        return [
          { id: 'kitchen-display', label: 'Live Board', icon: <SoupKitchenIcon /> },
          { id: 'kitchen-history', label: 'Completed', icon: <HistoryIcon /> },
        ];
      case 'Customer':
        return [
          { id: 'customer-menu', label: 'Menu', icon: <MenuBookIcon /> },
          {
            id: 'customer-cart',
            label: 'Cart',
            icon: (
              <Badge badgeContent={cartCount} color="error">
                <ShoppingBagIcon />
              </Badge>
            ),
          },
          { id: 'customer-tracking', label: 'Track Order', icon: <TimelineIcon /> },
          { id: 'customer-history', label: 'Receipts', icon: <ReceiptLongIcon /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, height: 68 }}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <BottomNavigation
          showLabels
          value={currentScreen}
          onChange={(event, newValue) => {
            if (newValue === 'more') {
              if (onOpenMoreMenu) onOpenMoreMenu();
            } else {
              setCurrentScreen(newValue);
            }
          }}
          sx={{
            height: 68,
            backgroundColor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              minHeight: 56, // Touch target requirement (56px)
              py: 1,
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: '#F97316',
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                },
              },
            },
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.id}
              value={item.id}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
