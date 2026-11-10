import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  useTheme,
  Button,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpaIcon from '@mui/icons-material/Spa';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useApp } from '../../context/AppContext';

export const AboutPage = () => {
  const { setCurrentScreen } = useApp();
  const theme = useTheme();

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header Banner */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="SRI LANKAN CULINARY EXCELLENCE"
            size="small"
            sx={{ fontWeight: 800, mb: 2, bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
            The Story Behind Ceylon Feast
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
            Born in the heart of Colombo, Smart Food Catering Service (Ceylon Feast) was created to bridge
            the gap between time-honored Sri Lankan culinary heritage and contemporary smart cloud kitchen operations.
            We provide corporations, wedding planners, and families with gourmet catering delivered hot, reliable,
            and beautifully presented.
          </Typography>
        </Container>
      </Box>

      {/* Pillars Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          {[
            {
              title: 'Authentic Ceylon Spices',
              icon: SpaIcon,
              color: '#16A34A',
              desc: 'We grind authentic Ceylon cinnamon from Mirissa, organic green cardamom from Kandy hills, and wild goraka from southern orchards without synthetic additives or artificial colorings.',
            },
            {
              title: '4,500 Sq.Ft Cloud Kitchen',
              icon: SoupKitchenIcon,
              color: '#F97316',
              desc: 'Our central facility in Colombo 03 is purpose-built for high-volume commercial catering with dedicated meat, poultry, and pure vegetarian prep zones complying with strict HACCP standards.',
            },
            {
              title: 'Thermal Insulated Logistics',
              icon: LocalShippingIcon,
              color: '#3B82F6',
              desc: 'Food is packaged into double-walled insulated hot boxes and dispatched via our dedicated fleet covering Colombo 1-15, Gampaha, Kandy, and southern coastal wedding venues.',
            },
            {
              title: '100% Halal & Clean Certified',
              icon: VerifiedIcon,
              color: '#9333EA',
              desc: 'All poultry and meats are 100% Halal certified and sourced from accredited local farms. We maintain digital temperature logs from cooking to customer handover.',
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: '20px',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '14px',
                      bgcolor: `${pillar.color}15`,
                      color: pillar.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Icon fontSize="medium" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {pillar.desc}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Leadership & Master Chefs */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="OUR CULINARY MASTERS" size="small" sx={{ fontWeight: 800, mb: 1, bgcolor: 'rgba(249,115,22,0.1)', color: '#EA580C' }} />
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Crafted by Seasoned Sri Lankan Chefs
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              name: 'Chef Anura Senanayake',
              role: 'Executive Head Chef',
              bio: 'Over 22 years leading 5-star kitchens across Sri Lanka and Dubai. Specialist in Ceylon royal dum biryani and heirloom banquets.',
              avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80',
            },
            {
              name: 'Chef Dilrukshi Fernando',
              role: 'Head of Pastry & Traditional Sweets',
              bio: 'Trained under Colombo’s premier confectionery houses. Creator of our signature cardamom watalappan and salted caramel puddings.',
              avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80',
            },
            {
              name: 'Nuwan Jayatillake',
              role: 'Head of Cloud Kitchen Operations',
              bio: 'Former hotel operations director ensuring prompt dispatch, food safety standards, and smart delivery fleet routing across Colombo.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
            },
          ].map((chef, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  borderRadius: '20px',
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Avatar
                  src={chef.avatar}
                  alt={chef.name}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '3px solid #F97316' }}
                />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {chef.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#F97316', fontWeight: 700, display: 'block', mb: 1.5 }}>
                  {chef.role}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {chef.bio}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setCurrentScreen('packages')}
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: '#F97316',
            '&:hover': { backgroundColor: '#EA580C' },
            px: 4,
            py: 1.6,
            borderRadius: '16px',
            fontWeight: 700,
          }}
        >
          View Catering Menus & Packages
        </Button>
      </Container>
    </Box>
  );
};

