import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Switch,
  Divider,
  useTheme,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PaletteIcon from '@mui/icons-material/Palette';
import StoreIcon from '@mui/icons-material/Store';
import { useApp } from '../../context/AppContext';

export const Settings = () => {
  const {
    cateringSettings,
    updateSettings,
    resetToMockData,
    darkMode,
    toggleDarkMode,
  } = useApp();

  const theme = useTheme();

  const [formData, setFormData] = useState({ ...cateringSettings });

  const handleSave = () => {
    updateSettings({
      ...formData,
      taxRate: parseFloat(formData.taxRate) || 0.05,
    });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          System & Receipt Settings
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Configure catering brand branding, WhatsApp messaging templates, and system preferences.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Catering Profile */}
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <StoreIcon sx={{ color: '#F97316' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Catering Service Profile (Printed on Receipts)
            </Typography>
          </Box>
          <Divider sx={{ mb: 2.5 }} />

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Catering Service Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tagline / Motto"
                fullWidth
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Official Contact Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Official Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Physical Address / Kitchen Location"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Standard Tax Rate (e.g. 0.05 = 5%)"
                type="number"
                fullWidth
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Currency Symbol"
                fullWidth
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </Grid>
          </Grid>
        </Card>

        {/* WhatsApp Receipt Integration */}
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <WhatsAppIcon sx={{ color: '#25D366' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              WhatsApp Receipt Deep Link Config
            </Typography>
          </Box>
          <Divider sx={{ mb: 2.5 }} />

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                label="Default Message Header Prefix"
                multiline
                rows={2}
                fullWidth
                value={formData.whatsappPrefix}
                onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                helperText="Pre-appended to the receipt before sending to customer phone via WhatsApp API/Web."
              />
            </Grid>
          </Grid>
        </Card>

        {/* Theme & Display Mode */}
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <PaletteIcon sx={{ color: '#F97316' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Appearance & Dark Mode
            </Typography>
          </Box>
          <Divider sx={{ mb: 2.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Dark Theme Mode
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Optimized high-contrast view for low-light kitchen prep areas & night shifts.
              </Typography>
            </Box>
            <Switch checked={darkMode} onChange={toggleDarkMode} color="warning" />
          </Box>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={resetToMockData}
            startIcon={<RestartAltIcon />}
            sx={{ borderRadius: 3, minHeight: 46 }}
          >
            Reset Demo Data
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#F97316',
              minHeight: 48,
              px: 3.5,
              fontWeight: 700,
              '&:hover': { backgroundColor: '#EA580C' },
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
