import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Tooltip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useApp } from '../../context/AppContext';

export const UserManagement = () => {
  const { users, addUser, updateUser, toggleUserStatus } = useApp();
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'Staff',
    phone: '',
  });

  const handleOpenAddDialog = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      role: 'Staff',
      phone: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      phone: user.phone || '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.username.trim()) return;

    if (editingUser) {
      updateUser({
        ...editingUser,
        ...formData,
      });
    } else {
      addUser(formData);
    }
    setDialogOpen(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#F97316' }} />;
      case 'Staff':
        return <BadgeIcon fontSize="small" sx={{ color: '#3B82F6' }} />;
      case 'Kitchen':
        return <SoupKitchenIcon fontSize="small" sx={{ color: '#EA580C' }} />;
      case 'Customer':
        return <PersonOutlinedIcon fontSize="small" sx={{ color: '#16A34A' }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
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
            User & Role Management
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Assign roles across Admin, Staff, Kitchen team, and registered Customers.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenAddDialog}
          startIcon={<PersonAddIcon />}
          sx={{
            backgroundColor: '#F97316',
            minHeight: 46,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#EA580C' },
          }}
        >
          Add User Account
        </Button>
      </Box>

      {/* Users Table */}
      <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FAFAF9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User Profile</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>System Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Account Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={user.avatar} sx={{ width: 40, height: 40, border: '2px solid #F97316' }}>
                        {user.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          ID: {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    @{user.username}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor:
                          user.role === 'Admin'
                            ? 'rgba(249, 115, 22, 0.12)'
                            : user.role === 'Staff'
                            ? 'rgba(59, 130, 246, 0.12)'
                            : user.role === 'Kitchen'
                            ? 'rgba(234, 88, 12, 0.12)'
                            : 'rgba(22, 163, 74, 0.12)',
                        color:
                          user.role === 'Admin'
                            ? '#F97316'
                            : user.role === 'Staff'
                            ? '#3B82F6'
                            : user.role === 'Kitchen'
                            ? '#EA580C'
                            : '#16A34A',
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.phone || '—'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        size="small"
                        checked={user.status === 'Active'}
                        onChange={() => toggleUserStatus(user.id)}
                        color="success"
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: user.status === 'Active' ? '#16A34A' : '#DC2626',
                        }}
                      >
                        {user.status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit user details">
                      <IconButton size="small" onClick={() => handleOpenEditDialog(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add / Edit User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingUser ? 'Edit User Profile' : 'Create User Account'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Username (Login ID)"
              fullWidth
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role Assignment</InputLabel>
              <Select
                label="Role Assignment"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="Admin">Admin (Full System Access)</MenuItem>
                <MenuItem value="Staff">Staff (POS & Order Desk)</MenuItem>
                <MenuItem value="Kitchen">Kitchen (Live Kanban Display)</MenuItem>
                <MenuItem value="Customer">Customer (Online Menu & Tracking)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: theme.palette.text.secondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ backgroundColor: '#F97316', '&:hover': { backgroundColor: '#EA580C' } }}
          >
            {editingUser ? 'Save Updates' : 'Create Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
