import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#F97316', // Warm Orange
        dark: '#C2410C', // Pressed state
        light: '#FB923C',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#16A34A', // Success / Completed / Income
        dark: '#15803D',
        light: '#4ADE80',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#FACC15', // Accent / Highlights / Badges
        dark: '#EAB308',
        light: '#FEF08A',
        contrastText: '#1C1917',
      },
      error: {
        main: '#DC2626', // Cancel / Delete / Errors
        dark: '#B91C1C',
        light: '#F87171',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#0F0F10' : '#FAFAF9',
        paper: isDark ? '#1A1A1C' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F5F5F4' : '#1C1917',
        secondary: isDark ? '#A8A29E' : '#78716C',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h1: {
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.015em',
      },
      h5: {
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 600,
      },
      h6: {
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 600,
      },
      button: {
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 16, // Soft rounded corners (12-20px as per design brief)
    },
    shadows: [
      'none',
      '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
      '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
      '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.03)',
      '0 20px 25px -5px rgba(0,0,0,0.07), 0 10px 10px -5px rgba(0,0,0,0.02)',
      ...Array(20).fill('0 20px 25px -5px rgba(0,0,0,0.07)'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            minHeight: 44, // Minimum 44px touch target
            padding: '10px 20px',
            boxShadow: 'none',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:active': {
              transform: 'scale(0.97)',
            },
            '&:hover': {
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
            },
          },
          containedPrimary: {
            background: '#F97316',
            '&:hover': {
              background: '#EA580C',
            },
            '&:active': {
              background: '#C2410C',
            },
          },
          containedSecondary: {
            background: '#16A34A',
            '&:hover': {
              background: '#15803D',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(28, 25, 23, 0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
            fontWeight: 500,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 14,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        },
      },
    },
  });
};

