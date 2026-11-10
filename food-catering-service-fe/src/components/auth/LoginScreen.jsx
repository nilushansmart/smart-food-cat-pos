import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
  Stack,
  Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useApp } from '../../context/AppContext';

export const LoginScreen = ({ onLoginSuccess }) => {
  const { cateringSettings, login, switchRole, loading } = useApp();
  const theme = useTheme();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    const res = await login(username.trim(), password);
    if (res?.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res?.error || 'Invalid username or password');
    }
  };

  const handleQuickLoginAs = (roleName) => {
    switchRole(roleName);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2.5,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 5,
          p: { xs: 2.5, sm: 3.5 },
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Logo & Brand */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                backgroundColor: '#F97316',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                mb: 1.5,
                boxShadow: '0 8px 20px rgba(249, 115, 22, 0.35)',
              }}
            >
              <RestaurantMenuIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {cateringSettings.name}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Smart Cloud Kitchen & Food Catering Platform — Sri Lanka
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="Username / Staff ID"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  minHeight: 50,
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: '#F97316',
                  '&:hover': { backgroundColor: '#EA580C' },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In to System'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 2.5 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Quick Demo One-Click Sign In
            </Typography>
          </Divider>

          {/* Role Quick Sign In Buttons */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickLoginAs('Admin')}
              startIcon={<AdminPanelSettingsIcon sx={{ color: '#F97316' }} />}
              sx={{ borderRadius: 2.5, fontSize: '0.8rem', fontWeight: 600 }}
            >
              Admin
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickLoginAs('Staff')}
              startIcon={<BadgeIcon sx={{ color: '#3B82F6' }} />}
              sx={{ borderRadius: 2.5, fontSize: '0.8rem', fontWeight: 600 }}
            >
              Staff POS
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickLoginAs('Kitchen')}
              startIcon={<SoupKitchenIcon sx={{ color: '#EA580C' }} />}
              sx={{ borderRadius: 2.5, fontSize: '0.8rem', fontWeight: 600 }}
            >
              Kitchen Display
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickLoginAs('Customer')}
              startIcon={<PersonOutlinedIcon sx={{ color: '#16A34A' }} />}
              sx={{ borderRadius: 2.5, fontSize: '0.8rem', fontWeight: 600 }}
            >
              Customer App
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
