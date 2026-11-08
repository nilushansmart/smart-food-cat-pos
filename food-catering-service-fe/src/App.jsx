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
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { KitchenHistory } from './components/kitchen/KitchenHistory';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { LoginScreen } from './components/auth/LoginScreen';

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
      // Admin screens
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
      case 'menu':
        return <MenuManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;

      // Kitchen screens
      case 'kitchen-display':
        return <KitchenDisplay />;
      case 'kitchen-history':
        return <KitchenHistory />;

      // Customer screens
      case 'customer-menu':
      case 'customer-cart':
      case 'customer-tracking':
      case 'customer-history':
        return <CustomerPortal />;

      default:
        if (currentUser?.role === 'Kitchen') return <KitchenDisplay />;
        if (currentUser?.role === 'Customer') return <CustomerPortal />;
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
              minHeight: 'calc(100vh - 64px)',
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
              width: 38,
              height: 38,
              color: theme.palette.text.secondary,
              '&:hover': {
                color: '#DC2626',
                borderColor: '#DC2626',
              },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Global Modals & Drawers */}
        <ReceiptModal />
        <MobileCartDrawer open={mobileCartOpen} onClose={() => setMobileCartOpen(false)} />
        <MobileMoreDrawer open={mobileMoreOpen} onClose={() => setMobileMoreOpen(false)} />

        {/* Micro-interaction Toast Feedback */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3200}
          onClose={closeToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ mb: { xs: 8, md: 3 } }}
        >
          <Alert
            onClose={closeToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              ...(toast.severity === 'success' && { backgroundColor: '#16A34A' }),
              ...(toast.severity === 'info' && { backgroundColor: '#F97316' }),
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
