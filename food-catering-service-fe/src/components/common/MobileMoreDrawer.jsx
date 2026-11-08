import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import TodayIcon from '@mui/icons-material/Today';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useApp } from '../../context/AppContext';

export const MobileMoreDrawer = ({ open, onClose }) => {
  const { currentScreen, setCurrentScreen } = useApp();
  const theme = useTheme();

  const handleSelectScreen = (screenId) => {
    setCurrentScreen(screenId);
    onClose();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: DashboardIcon },
    { id: 'pos', label: 'Create Order (POS)', icon: PointOfSaleIcon },
    { id: 'orders', label: 'Orders List', icon: ReceiptLongIcon },
    { id: 'daily-income', label: 'Daily Income Report', icon: TodayIcon },
    { id: 'monthly-analytics', label: 'Monthly Analytics', icon: BarChartIcon },
    { divider: true },
    { id: 'menu', label: 'Menu Catalog Management', icon: RestaurantMenuIcon },
    { id: 'users', label: 'User & Staff Management', icon: PeopleIcon },
    { id: 'settings', label: 'Branding & Receipt Settings', icon: SettingsIcon },
  ];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          maxHeight: '80vh',
          p: 2,
        },
      }}
    >
      <Box sx={{ width: 44, height: 5, backgroundColor: 'rgba(120, 113, 108, 0.3)', borderRadius: 9999, mx: 'auto', mb: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Navigation & Controls
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <List sx={{ pt: 0 }}>
        {navItems.map((item, index) => {
          if (item.divider) {
            return <Divider key={`div-${index}`} sx={{ my: 1 }} />;
          }

          const isSelected = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.id}
              selected={isSelected}
              onClick={() => handleSelectScreen(item.id)}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                py: 1.2,
                ...(isSelected && {
                  backgroundColor: '#F97316 !important',
                  color: '#FFFFFF !important',
                  '& .MuiListItemIcon-root': { color: '#FFFFFF' },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isSelected ? '#FFFFFF' : theme.palette.text.secondary }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};
