import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  useTheme,
  ListItemIcon,
  ListItemText,
  Stack,
  Divider,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TimelineIcon from '@mui/icons-material/Timeline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ onOpenCartMobile }) => {
  const {
    darkMode,
    toggleDarkMode,
    currentUser,
    switchRole,
    cart,
    cateringSettings,
    soundEnabled,
    setSoundEnabled,
    currentScreen,
    setCurrentScreen,
  } = useApp();

  const theme = useTheme();
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOpenRoleMenu = (event) => {
    setRoleAnchorEl(event.currentTarget);
  };

  const handleCloseRoleMenu = () => {
    setRoleAnchorEl(null);
  };

  const handleSelectRole = (role) => {
    switchRole(role);
    handleCloseRoleMenu();
  };

  // Customer navigation pages
  const customerNavPages = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Food Menu' },
    { id: 'packages', label: 'Packages' },
    { id: 'custom-order', label: 'Customize' },
    { id: 'events', label: 'Special Events' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        zIndex: (th) => th.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: 68 }}>
        {/* Brand & Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => setCurrentScreen('home')}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
            }}
          >
            <RestaurantMenuIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: '1rem', sm: '1.2rem' },
                letterSpacing: '-0.02em',
                color: theme.palette.text.primary,
              }}
            >
              Ceylon Feast
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#EA580C',
                fontWeight: 700,
                fontSize: '0.72rem',
                display: 'block',
              }}
            >
              🇱🇰 Smart Food Catering • Sri Lanka
            </Typography>
          </Box>
        </Box>

        {/* Center Navigation Links (Visible on Desktop & Tablet) */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
          }}
        >
          {customerNavPages.map((page) => {
            const isActive = currentScreen === page.id;
            return (
              <Button
                key={page.id}
                onClick={() => setCurrentScreen(page.id)}
                size="small"
                sx={{
                  color: isActive ? '#F97316' : theme.palette.text.secondary,
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.88rem',
                  borderRadius: '12px',
                  px: 1.5,
                  py: 0.8,
                  backgroundColor: isActive ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                  '&:hover': {
                    color: '#F97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.05)',
                  },
                }}
              >
                {page.label}
              </Button>
            );
          })}
        </Stack>

        {/* Right Side Controls */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Quick Track Order Pill */}
          <Button
            size="small"
            startIcon={<TimelineIcon />}
            onClick={() => setCurrentScreen('tracking')}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              color: currentScreen === 'tracking' ? '#F97316' : theme.palette.text.primary,
              fontWeight: 700,
              fontSize: '0.82rem',
              px: 1.6,
            }}
          >
            Track Order
          </Button>

          {/* Cart Pill with Price */}
          <Button
            size="small"
            variant="contained"
            startIcon={
              <Badge badgeContent={totalCartCount} color="error" overlap="circular">
                <ShoppingBagOutlinedIcon fontSize="small" />
              </Badge>
            }
            onClick={() => setCurrentScreen('cart')}
            sx={{
              backgroundColor: '#F97316',
              '&:hover': { backgroundColor: '#EA580C' },
              borderRadius: '14px',
              fontWeight: 800,
              px: { xs: 1.5, sm: 2 },
              py: 0.8,
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {totalCartCount > 0 ? `Rs. ${totalCartValue.toLocaleString()}` : 'Cart'}
            </Typography>
          </Button>

          {/* Admin Dashboard / Suite Quick Switch */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<DashboardIcon />}
            onClick={() => setCurrentScreen('dashboard')}
            sx={{
              borderRadius: '14px',
              borderColor: currentScreen === 'dashboard' ? '#3B82F6' : theme.palette.divider,
              bgcolor: currentScreen === 'dashboard' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
              color: currentScreen === 'dashboard' ? '#2563EB' : theme.palette.text.primary,
              fontWeight: 700,
              px: { xs: 1, sm: 1.8 },
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            Admin Suite
          </Button>

          {/* Role Switcher */}
          <Tooltip title="Switch Role Perspective">
            <Button
              onClick={handleOpenRoleMenu}
              size="small"
              startIcon={<SwapHorizIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: '0.8rem',
                px: 1.2,
              }}
            >
              {currentUser?.role}
            </Button>
          </Tooltip>

          {/* Role Selection Menu */}
          <Menu
            anchorEl={roleAnchorEl}
            open={Boolean(roleAnchorEl)}
            onClose={handleCloseRoleMenu}
            PaperProps={{ sx: { borderRadius: '16px', minWidth: 200, p: 0.5 } }}
          >
            <MenuItem onClick={() => handleSelectRole('Admin')} selected={currentUser?.role === 'Admin'}>
              <ListItemIcon><AdminPanelSettingsIcon sx={{ color: '#F97316' }} /></ListItemIcon>
              <ListItemText primary="Admin Portal" secondary="Dashboard & Analytics" />
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole('Kitchen')} selected={currentUser?.role === 'Kitchen'}>
              <ListItemIcon><SoupKitchenIcon sx={{ color: '#EA580C' }} /></ListItemIcon>
              <ListItemText primary="Kitchen KDS" secondary="Live Prep & Stock" />
            </MenuItem>
            <MenuItem onClick={() => { setCurrentScreen('delivery-admin'); handleCloseRoleMenu(); }}>
              <ListItemIcon><LocalShippingIcon sx={{ color: '#16A34A' }} /></ListItemIcon>
              <ListItemText primary="Delivery Logistics" secondary="Riders & Routes" />
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole('Customer')} selected={currentUser?.role === 'Customer'}>
              <ListItemIcon><PersonOutlinedIcon sx={{ color: '#3B82F6' }} /></ListItemIcon>
              <ListItemText primary="Customer View" secondary="Storefront & Menus" />
            </MenuItem>
          </Menu>

          {/* Sound Toggle */}
          <Tooltip title={soundEnabled ? 'Kitchen Bell: On' : 'Kitchen Bell: Muted'}>
            <IconButton
              onClick={() => setSoundEnabled((prev) => !prev)}
              size="small"
              sx={{
                color: soundEnabled ? '#F97316' : theme.palette.text.secondary,
                border: `1px solid ${theme.palette.divider}`,
                width: 38,
                height: 38,
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            >
              {soundEnabled ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleDarkMode}
              size="small"
              sx={{
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                width: 38,
                height: 38,
              }}
            >
              {darkMode ? <Brightness7Icon fontSize="small" sx={{ color: '#FACC15' }} /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Avatar */}
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            sx={{ width: 36, height: 36, border: '2px solid #F97316', display: { xs: 'none', md: 'inline-flex' } }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
