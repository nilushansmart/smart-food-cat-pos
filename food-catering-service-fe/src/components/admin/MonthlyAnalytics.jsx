import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  useTheme,
  Stack,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PieChartIcon from '@mui/icons-material/PieChart';
import StarIcon from '@mui/icons-material/Star';
import { NumberCounter } from '../common/NumberCounter';
import { reportsApi } from '../../api';

export const MonthlyAnalytics = () => {
  const theme = useTheme();

  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [serverAnalytics, setServerAnalytics] = useState(null);

  // Sync with backend /api/reports/monthly
  useEffect(() => {
    let isMounted = true;
    const parts = selectedMonth.split('-');
    const year = Number(parts[0]) || 2026;
    const month = Number(parts[1]) || 11;

    reportsApi
      .getMonthlyAnalytics(year, month)
      .then((res) => {
        if (isMounted && res?.data) {
          setServerAnalytics(res.data);
        }
      })
      .catch(() => {
        // Fallback to local
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMonth]);

  // Weekly income distribution data
  const weeklyData = [
    { week: 'Week 1 (Nov 1 - 7)', revenue: 4400.90, orders: 177 },
    { week: 'Week 2 (Nov 8 - 14)', revenue: 2680.40, orders: 112 },
    { week: 'Week 3 (Nov 15 - 21)', revenue: 3820.00, orders: 145 },
    { week: 'Week 4 (Nov 22 - 30)', revenue: 4150.20, orders: 160 },
  ];

  const maxWeeklyRevenue = Math.max(...weeklyData.map((w) => w.revenue));
  const totalMonthlyIncome = serverAnalytics?.totalMonthlyIncome !== undefined && serverAnalytics.totalMonthlyIncome > 0
    ? Number(serverAnalytics.totalMonthlyIncome)
    : weeklyData.reduce((sum, w) => sum + w.revenue, 0);

  const totalMonthlyOrders = serverAnalytics?.totalMonthlyOrders !== undefined && serverAnalytics.totalMonthlyOrders > 0
    ? Number(serverAnalytics.totalMonthlyOrders)
    : weeklyData.reduce((sum, w) => sum + w.orders, 0);

  // Category breakdown calculation
  const defaultCategoryStats = [
    { name: 'Rice Dishes', orders: 248, percentage: 42, revenue: 6320.50, color: '#F97316' },
    { name: 'Snacks & Starters', orders: 165, percentage: 28, revenue: 4210.00, color: '#3B82F6' },
    { name: 'Desserts', orders: 106, percentage: 18, revenue: 2709.00, color: '#16A34A' },
    { name: 'Beverages', orders: 75, percentage: 12, revenue: 1812.00, color: '#FACC15' },
  ];

  const paletteColors = ['#F97316', '#3B82F6', '#16A34A', '#FACC15', '#8B5CF6'];

  const categoryStats = serverAnalytics?.categoryBreakdown && serverAnalytics.categoryBreakdown.length > 0
    ? serverAnalytics.categoryBreakdown.map((cat, idx) => ({
        name: cat.categoryName,
        orders: cat.ordersCount,
        percentage: cat.percentageShare,
        revenue: Number(cat.totalRevenue),
        color: paletteColors[idx % paletteColors.length],
      }))
    : defaultCategoryStats;

  // Top selling items leaderboard
  const defaultTopSellingItems = [
    { name: 'Royal Chicken Biryani', category: 'Rice', sold: 184, revenue: 2300.00, pct: 95 },
    { name: 'Fragrant Ghee Rice & Curry', category: 'Rice', sold: 142, revenue: 1420.00, pct: 75 },
    { name: 'Crispy Veggie Samosas (4 pcs)', category: 'Snacks', sold: 128, revenue: 704.00, pct: 68 },
    { name: 'Silky Caramel Pudding', category: 'Desserts', sold: 98, revenue: 470.40, pct: 52 },
    { name: 'Fresh Mint Lime Soda', category: 'Beverages', sold: 86, revenue: 301.00, pct: 45 },
  ];

  const topSellingItems = serverAnalytics?.topSellingItems && serverAnalytics.topSellingItems.length > 0
    ? serverAnalytics.topSellingItems.map((item, idx) => ({
        name: item.itemName,
        category: item.categoryName,
        sold: item.totalQuantitySold,
        revenue: Number(item.totalRevenue),
        pct: Math.max(20, 100 - idx * 15),
      }))
    : defaultTopSellingItems;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header & Month Selector */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Monthly Income & Product Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            In-depth sales velocity, popular dishes, and category distribution.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            <MenuItem value="2026-11">November 2026</MenuItem>
            <MenuItem value="2026-10">October 2026</MenuItem>
            <MenuItem value="2026-09">September 2026</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Monthly KPIs */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Total Monthly Revenue
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: 'rgba(22, 163, 74, 0.12)',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AttachMoneyIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#16A34A' }} className="tabular-nums">
              <NumberCounter value={totalMonthlyIncome} prefix="$" />
            </Typography>
            <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 600 }}>
              +24.6% vs previous month
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Total Orders Placed
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: 'rgba(249, 115, 22, 0.12)',
                  color: '#F97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBagIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }} className="tabular-nums">
              <NumberCounter value={totalMonthlyOrders} decimals={0} />
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              ~19.8 orders per active day
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Top Performing Category
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: 'rgba(249, 115, 22, 0.12)',
                  color: '#F97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PieChartIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F97316', mt: 0.5 }}>
              Rice Dishes
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              42% of total catering gross sales
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Best Seller Dish
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: 'rgba(250, 204, 21, 0.2)',
                  color: '#CA8A04',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StarIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }} noWrap>
              Chicken Biryani
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              184 units ordered this month
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Two Columns: Weekly Bar Chart & Category Donut Chart */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Weekly Revenue Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Revenue per Week (November 2026)
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 3, display: 'block' }}>
              Comparison of weekly sales figures
            </Typography>

            <Box sx={{ height: 220, display: 'flex', alignItems: 'flex-end', gap: 3, pt: 3, px: 2 }}>
              {weeklyData.map((w, index) => {
                const heightPct = (w.revenue / maxWeeklyRevenue) * 100;
                const isHovered = hoveredWeek === index;

                return (
                  <Box
                    key={w.week}
                    onMouseEnter={() => setHoveredWeek(index)}
                    onMouseLeave={() => setHoveredWeek(null)}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    {isHovered && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          backgroundColor: '#1C1917',
                          color: '#FFFFFF',
                          py: 0.5,
                          px: 1.2,
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          zIndex: 10,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}
                      >
                        ${w.revenue.toFixed(2)} ({w.orders} orders)
                      </Box>
                    )}

                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 60,
                        height: `${heightPct}%`,
                        borderRadius: '10px 10px 4px 4px',
                        backgroundColor: isHovered ? '#EA580C' : '#F97316',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isHovered ? 'scaleY(1.04)' : 'scaleY(1)',
                        transformOrigin: 'bottom',
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1.2,
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        fontSize: '0.72rem',
                      }}
                    >
                      {w.week.split(' (')[0]}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Orders by Category Donut Chart */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Orders by Category
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}>
              Proportional distribution of dish types ordered
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
              {/* Responsive SVG Donut Chart */}
              <svg width="180" height="180" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F97316" strokeWidth="16" strokeDasharray="100 138" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="16" strokeDasharray="67 171" strokeDashoffset="-100" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#16A34A" strokeWidth="16" strokeDasharray="43 195" strokeDashoffset="-167" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#FACC15" strokeWidth="16" strokeDasharray="28 210" strokeDashoffset="-210" />
                <text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill={theme.palette.text.primary}>
                  594
                </text>
                <text x="50" y="60" textAnchor="middle" fontSize="6" fill={theme.palette.text.secondary}>
                  Total Items
                </text>
              </svg>
            </Box>

            {/* Legend */}
            <Stack spacing={1}>
              {categoryStats.map((cat) => (
                <Box key={cat.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: cat.color }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {cat.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} className="tabular-nums">
                    {cat.percentage}% ({cat.orders})
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Two Columns: Category Breakdown Table & Top Selling Items Leaderboard */}
      <Grid container spacing={3}>
        {/* Category Breakdown Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Category Financial Breakdown
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FAFAF9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Items Sold</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Revenue Share</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryStats.map((cat) => (
                    <TableRow key={cat.name} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                      <TableCell className="tabular-nums">{cat.orders}</TableCell>
                      <TableCell className="tabular-nums">{cat.percentage}%</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#16A34A' }} className="tabular-nums">
                        ${cat.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Top Selling Items Leaderboard */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Top Selling Dishes Leaderboard
            </Typography>
            <Stack spacing={2}>
              {topSellingItems.map((item, index) => (
                <Box key={item.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: index === 0 ? '#F97316' : 'rgba(120, 113, 108, 0.15)',
                          color: index === 0 ? '#FFFFFF' : theme.palette.text.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#16A34A' }} className="tabular-nums">
                      ${item.revenue.toFixed(2)}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={item.pct}
                    sx={{
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: index === 0 ? '#F97316' : index === 1 ? '#FB923C' : '#3B82F6',
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.3, display: 'block' }}>
                    {item.sold} orders placed ({item.category})
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
