import { useMemo, useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider, useApp } from './context/AppContext';
import { getAppTheme } from './theme/theme';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { MobileMoreDrawer } from './components/common/MobileMoreDrawer';
import { MobileCartDrawer } from './components/pos/CartDrawer';
import { ReceiptModal } from './components/receipt/ReceiptModal';
import { Dashboard } from './components/admin/Dashboard';
import { POSScreen } from './components/pos/POSScreen';
import { OrdersList } from './components/admin/OrdersList';
import { DailyIncome } from './components/admin/DailyIncome';
import { MonthlyAnalytics } from './components/admin/MonthlyAnalytics';
import { MenuManagement } from './components/admin/MenuManagement';
import { UserManagement } from './components/admin/UserManagement';
import { Settings } from './components/admin/Settings';
import { PaymentsManagement } from './components/admin/PaymentsManagement';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { KitchenHistory } from './components/kitchen/KitchenHistory';
import { DeliveryManagement } from './components/delivery/DeliveryManagement';
import { LoginScreen } from './components/auth/LoginScreen';

// Modern Sri Lanka Customer Pages
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { MenuPage } from './components/pages/MenuPage';
import { PackagesPage } from './components/pages/PackagesPage';
import { SpecialEventsPage } from './components/pages/SpecialEventsPage';
import { CustomOrderPage } from './components/pages/CustomOrderPage';
import { CartPage } from './components/pages/CartPage';
import { TrackingPage } from './components/pages/TrackingPage';
import { ContactPage } from './components/pages/ContactPage';

function AppContent() {
  const {
    darkMode,
    currentUser,
    currentScreen,
    toast,
    closeToast,
  } = useApp();

  const theme = useMemo(() => getAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  // Mobile drawer states
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Render current active screen
  const renderScreen = () => {
    switch (currentScreen) {
      // Customer Website Pages
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'menu':
        return <MenuPage />;
      case 'packages':
        return <PackagesPage />;
      case 'events':
        return <SpecialEventsPage />;
      case 'custom-order':
        return <CustomOrderPage />;
      case 'cart':
      case 'customer-cart':
        return <CartPage />;
      case 'tracking':
      case 'customer-tracking':
        return <TrackingPage />;
      case 'contact':
        return <ContactPage />;

      // Admin Management Screens
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <POSScreen />;
      case 'orders':
        return <OrdersList />;
      case 'daily-income':
        return <DailyIncome />;
      case 'monthly-analytics':
        return <MonthlyAnalytics />;
      case 'menu-admin':
      case 'admin-menu':
        return <MenuManagement />;
      case 'customers-admin':
      case 'users':
        return <UserManagement />;
      case 'payments-admin':
        return <PaymentsManagement />;
      case 'settings':
        return <Settings />;

      // Kitchen Management
      case 'kitchen-display':
        return <KitchenDisplay />;
      case 'kitchen-history':
        return <KitchenHistory />;

      // Delivery Management
      case 'delivery-admin':
        return <DeliveryManagement />;

      // Fallback for legacy customer screens
      case 'customer-menu':
        return <MenuPage />;
      case 'customer-history':
        return <TrackingPage />;

      default:
        if (currentUser?.role === 'Kitchen') return <KitchenDisplay />;
        if (currentUser?.role === 'Customer') return <HomePage />;
        if (currentUser?.role === 'Staff') return <POSScreen />;
        return <Dashboard />;
    }
  };

  if (isLoggedOut) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginScreen onLoginSuccess={() => setIsLoggedOut(false)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        {/* Top Navbar */}
        <Navbar onOpenCartMobile={() => setMobileCartOpen(true)} />

        {/* Main Body Area: Sidebar + Screen Content */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Persistent Sidebar on Desktop & Tablet */}
          <Sidebar />

          {/* Dynamic Content View */}
          <Box
            component="main"
            sx={{
              flex: 1,
              overflowY: 'auto',
              minHeight: 'calc(100vh - 68px)',
              position: 'relative',
            }}
          >
            {renderScreen()}
          </Box>
        </Box>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav onOpenMoreMenu={() => setMobileMoreOpen(true)} />

        {/* Floating Logout / Test Login Button */}
        <Tooltip title="Switch to Login Screen">
          <IconButton
            size="small"
            onClick={() => setIsLoggedOut(true)}
            sx={{
              position: 'fixed',
              bottom: { xs: 80, md: 24 },
              left: 20,
              zIndex: 900,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#F5F5F4',
              },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Mobile Cart Drawer */}
        <MobileCartDrawer
          open={mobileCartOpen}
          onClose={() => setMobileCartOpen(false)}
        />

        {/* Mobile More Drawer */}
        <MobileMoreDrawer
          open={mobileMoreOpen}
          onClose={() => setMobileMoreOpen(false)}
        />

        {/* Global Digital Invoice & PDF Receipt Modal */}
        <ReceiptModal />

        {/* Toast / Snackbar Notifications */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={closeToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={closeToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              width: '100%',
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
