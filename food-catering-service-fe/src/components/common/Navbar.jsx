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
  } = useApp();

  const theme = useTheme();
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <AdminPanelSettingsIcon fontSize="small" />;
      case 'Staff':
        return <BadgeIcon fontSize="small" />;
      case 'Kitchen':
        return <SoupKitchenIcon fontSize="small" />;
      case 'Customer':
        return <PersonOutlinedIcon fontSize="small" />;
      default:
        return <PersonOutlinedIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return { bg: 'rgba(249, 115, 22, 0.15)', text: '#F97316' };
      case 'Staff':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' };
      case 'Kitchen':
        return { bg: 'rgba(234, 88, 12, 0.15)', text: '#EA580C' };
      case 'Customer':
        return { bg: 'rgba(22, 163, 74, 0.15)', text: '#16A34A' };
      default:
        return { bg: 'rgba(120, 113, 108, 0.15)', text: '#78716C' };
    }
  };

  const roleStyle = getRoleColor(currentUser?.role);

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
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: 64 }}>
        {/* Brand & Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(249, 115, 22, 0.35)',
            }}
          >
            <RestaurantMenuIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                fontSize: { xs: '1rem', sm: '1.15rem' },
                color: theme.palette.text.primary,
              }}
            >
              {cateringSettings.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Online Catering & Event Booking POS
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/* Quick Role Switcher Chip */}
          <Button
            onClick={handleOpenRoleMenu}
            size="small"
            variant="outlined"
            startIcon={getRoleIcon(currentUser?.role)}
            endIcon={<SwapHorizIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 9999,
              borderColor: 'transparent',
              backgroundColor: roleStyle.bg,
              color: roleStyle.text,
              fontWeight: 600,
              px: { xs: 1.2, sm: 1.8 },
              py: 0.6,
              minHeight: 38,
              '&:hover': {
                backgroundColor: roleStyle.bg,
                borderColor: roleStyle.text,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline' } }}>
              Role:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, ml: { sm: 0.5 } }}>
              {currentUser?.role}
            </Typography>
          </Button>

          {/* Role Selection Dropdown */}
          <Menu
            anchorEl={roleAnchorEl}
            open={Boolean(roleAnchorEl)}
            onClose={handleCloseRoleMenu}
            PaperProps={{
              sx: {
                borderRadius: 3,
                mt: 1.5,
                minWidth: 180,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              },
            }}
          >
            <MenuItem onClick={() => handleSelectRole('Admin')} selected={currentUser?.role === 'Admin'}>
              <ListItemIcon>
                <AdminPanelSettingsIcon sx={{ color: '#F97316' }} />
              </ListItemIcon>
              <ListItemText primary="Admin" secondary="Full System Access" />
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole('Staff')} selected={currentUser?.role === 'Staff'}>
              <ListItemIcon>
                <BadgeIcon sx={{ color: '#3B82F6' }} />
              </ListItemIcon>
              <ListItemText primary="Staff" secondary="Fast Order POS" />
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole('Kitchen')} selected={currentUser?.role === 'Kitchen'}>
              <ListItemIcon>
                <SoupKitchenIcon sx={{ color: '#EA580C' }} />
              </ListItemIcon>
              <ListItemText primary="Kitchen" secondary="Live Kanban Board" />
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole('Customer')} selected={currentUser?.role === 'Customer'}>
              <ListItemIcon>
                <PersonOutlinedIcon sx={{ color: '#16A34A' }} />
              </ListItemIcon>
              <ListItemText primary="Customer" secondary="Menu & Tracking" />
            </MenuItem>
          </Menu>

          {/* Sound Toggle (especially useful for Kitchen audio chime) */}
          <Tooltip title={soundEnabled ? 'Kitchen Bell Sound: Enabled' : 'Kitchen Bell Sound: Muted'}>
            <IconButton
              onClick={() => setSoundEnabled((prev) => !prev)}
              size="small"
              sx={{
                color: soundEnabled ? '#F97316' : theme.palette.text.secondary,
                border: `1px solid ${theme.palette.divider}`,
                width: 40,
                height: 40,
              }}
            >
              {soundEnabled ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Theme Mode Toggle */}
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleDarkMode}
              size="small"
              sx={{
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                width: 40,
                height: 40,
              }}
            >
              {darkMode ? <Brightness7Icon fontSize="small" sx={{ color: '#FACC15' }} /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Mobile Cart Button with count badge (shown when in POS or Customer Menu on small screens) */}
          {(currentUser?.role === 'Admin' || currentUser?.role === 'Staff' || currentUser?.role === 'Customer') && (
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton
                onClick={onOpenCartMobile}
                sx={{
                  backgroundColor: '#F97316',
                  color: '#FFFFFF',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#EA580C',
                  },
                }}
              >
                <Badge badgeContent={totalCartCount} color="error" overlap="circular">
                  <ShoppingBagOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Box>
          )}

          {/* User Avatar */}
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            sx={{
              width: 38,
              height: 38,
              border: '2px solid #F97316',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            {currentUser?.name?.[0]}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
